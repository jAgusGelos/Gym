import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Class } from '../classes/entities/class.entity';
import { ClassSchedule } from '../classes/entities/class-schedule.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  NotificationPriority,
  NotificationType,
} from 'src/notifications/entities/notification.entity';
import {
  parseLocalDate,
  combineDateAndTime,
  isPast,
  getHoursDifference,
} from '../common/utils/date.utils';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassSchedule)
    private scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const { scheduleId, classDate } = createBookingDto;

    // Verificar que el horario existe
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['class'],
    });

    if (!schedule) {
      throw new NotFoundException('Horario de clase no encontrado');
    }

    // Verificar que la clase y el horario están activos
    if (!schedule.class.activo || !schedule.activo) {
      throw new BadRequestException('La clase o el horario no están activos');
    }

    // Parsear la fecha en zona horaria local
    const parsedDate = parseLocalDate(classDate);

    // Verificar que el día de la semana coincida
    if (parsedDate.getDay() !== schedule.dayOfWeek) {
      throw new BadRequestException(
        'La fecha no corresponde al día de la semana del horario',
      );
    }

    // Verificar que la fecha/hora no ha pasado
    if (isPast(parsedDate, schedule.startTime)) {
      throw new BadRequestException('No se puede reservar una clase pasada');
    }

    // Obtener fecha y hora completa de la clase
    const classDateTime = combineDateAndTime(parsedDate, schedule.startTime);

    // Verificar que el usuario no tiene ya una reserva para esta clase en esta fecha
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        userId,
        scheduleId,
        classDate: parsedDate,
        estado: BookingStatus.RESERVADO,
      },
    });

    if (existingBooking) {
      throw new ConflictException('Ya tiene una reserva para esta clase');
    }

    // Contar reservas actuales para este horario y fecha
    const currentBookings = await this.bookingRepository.count({
      where: {
        scheduleId,
        classDate: parsedDate,
        estado: BookingStatus.RESERVADO,
        enListaEspera: false,
      },
    });

    // Determinar cupo máximo (usar el del schedule si está definido, sino el de la clase)
    const cupoMaximo = schedule.cupoMaximo || schedule.class.cupoMaximo;
    const hasSpots = currentBookings < cupoMaximo;

    let booking: Booking;

    if (hasSpots) {
      // Hay cupo disponible
      booking = this.bookingRepository.create({
        userId,
        classId: schedule.classId,
        scheduleId,
        classDate: parsedDate,
        estado: BookingStatus.RESERVADO,
        enListaEspera: false,
      });
    } else {
      // No hay cupo, agregar a lista de espera
      const maxPosition = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.scheduleId = :scheduleId', { scheduleId })
        .andWhere('booking.classDate = :classDate', {
          classDate: parsedDate,
        })
        .andWhere('booking.enListaEspera = :enLista', { enLista: true })
        .select('MAX(booking.posicionListaEspera)', 'max')
        .getRawOne();

      const nextPosition = (maxPosition?.max || 0) + 1;

      booking = this.bookingRepository.create({
        userId,
        classId: schedule.classId,
        scheduleId,
        classDate: parsedDate,
        estado: BookingStatus.RESERVADO,
        enListaEspera: true,
        posicionListaEspera: nextPosition,
      });
    }

    const savedBooking = await this.bookingRepository.save(booking);

    // Enviar notificaciones
    try {
      const fechaClase = format(
        classDateTime,
        "dd 'de' MMMM 'a las' HH:mm",
        {
          locale: es,
        },
      );

      if (savedBooking.enListaEspera) {
        // Notificación de lista de espera
        await this.notificationsService.create({
          userId,
          type: NotificationType.WAITLIST_PROMOTED,
          priority: NotificationPriority.MEDIUM,
          title: 'En Lista de Espera',
          message: `Estás en la posición ${savedBooking.posicionListaEspera} de la lista de espera para ${schedule.class.nombre} el ${fechaClase}.`,
          actionUrl: '/classes',
          actionLabel: 'Ver Clases',
        });
      } else {
        // Notificación de confirmación de reserva
        await this.notificationsService.create({
          userId,
          type: NotificationType.BOOKING_CONFIRMED,
          priority: NotificationPriority.HIGH,
          title: 'Reserva Confirmada',
          message: `Tu reserva para ${schedule.class.nombre} el ${fechaClase} fue confirmada exitosamente.`,
          actionUrl: '/classes',
          actionLabel: 'Ver Mis Reservas',
        });
      }
    } catch (error) {
      console.error('Error enviando notificación de booking:', error);
    }

    return await this.bookingRepository.findOneOrFail({
      where: { id: savedBooking.id },
      relations: ['class', 'schedule', 'schedule.instructor', 'user'],
    });
  }

  async cancel(id: string, userId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['class', 'schedule'],
    });

    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Verificar que la reserva pertenece al usuario
    if (booking.userId !== userId) {
      throw new BadRequestException('Esta reserva no le pertenece');
    }

    // Verificar que no está ya cancelada
    if (booking.estado === BookingStatus.CANCELADO) {
      throw new BadRequestException('La reserva ya está cancelada');
    }

    // Calcular fecha y hora de la clase
    const classDateTime = combineDateAndTime(
      booking.classDate,
      booking.schedule.startTime,
    );

    // Verificar que falten al menos 2 horas para la clase
    const hoursUntilClass = getHoursDifference(classDateTime, new Date());

    if (hoursUntilClass < 2) {
      throw new BadRequestException(
        'No se puede cancelar con menos de 2 horas de anticipación',
      );
    }

    // Si estaba en la lista principal, promover de lista de espera
    if (!booking.enListaEspera) {
      // Buscar el primero en lista de espera para este horario y fecha
      const nextInWaitlist = await this.bookingRepository.findOne({
        where: {
          scheduleId: booking.scheduleId,
          classDate: booking.classDate,
          enListaEspera: true,
          estado: BookingStatus.RESERVADO,
        },
        order: {
          posicionListaEspera: 'ASC',
        },
        relations: ['schedule', 'class'],
      });

      if (nextInWaitlist) {
        // Promover de lista de espera
        nextInWaitlist.enListaEspera = false;
        nextInWaitlist.posicionListaEspera = 0;
        await this.bookingRepository.save(nextInWaitlist);

        // Enviar notificación al usuario promovido
        try {
          const fechaClase = format(
            classDateTime,
            "dd 'de' MMMM 'a las' HH:mm",
            {
              locale: es,
            },
          );

          await this.notificationsService.create({
            userId: nextInWaitlist.userId,
            type: NotificationType.WAITLIST_PROMOTED,
            priority: NotificationPriority.URGENT,
            title: '¡Promovido de Lista de Espera!',
            message: `¡Buenas noticias! Se liberó un cupo para ${booking.class.nombre} el ${fechaClase}. Tu reserva está confirmada.`,
            actionUrl: '/classes',
            actionLabel: 'Ver Mis Reservas',
          });
        } catch (error) {
          console.error('Error enviando notificación de promoción:', error);
        }
      }
    }

    // Marcar como cancelada
    booking.estado = BookingStatus.CANCELADO;
    await this.bookingRepository.save(booking);
  }

  async findUserBookings(
    userId: string,
    paginationDto: PaginationDto,
    includeExpired: boolean = false,
  ): Promise<PaginatedResult<Booking>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.class', 'class')
      .leftJoinAndSelect('booking.schedule', 'schedule')
      .leftJoinAndSelect('schedule.instructor', 'instructor')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.estado = :estado', { estado: BookingStatus.RESERVADO })
      .skip(skip)
      .take(limit)
      .orderBy('booking.classDate', 'ASC')
      .addOrderBy('schedule.startTime', 'ASC');

    if (!includeExpired) {
      queryBuilder.andWhere('booking.classDate >= :now', {
        now: new Date(),
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findScheduleBookings(
    scheduleId: string,
    classDate?: Date,
  ): Promise<Booking[]> {
    const where: any = {
      scheduleId,
      estado: BookingStatus.RESERVADO,
    };

    if (classDate) {
      where.classDate = classDate;
    }

    return await this.bookingRepository.find({
      where,
      relations: ['user'],
      order: {
        enListaEspera: 'ASC',
        posicionListaEspera: 'ASC',
        fechaReserva: 'ASC',
      },
    });
  }

  async checkInWithQR(
    qrCode: string,
    scheduleId: string,
    classDate: Date,
  ): Promise<Booking> {
    // Buscar usuario por QR
    const user = await this.userRepository.findOne({
      where: { qrCode },
    });

    if (!user) {
      throw new NotFoundException('Código QR inválido');
    }

    // Buscar reserva del usuario para este horario y fecha
    const booking = await this.bookingRepository.findOne({
      where: {
        userId: user.id,
        scheduleId,
        classDate,
        estado: BookingStatus.RESERVADO,
      },
      relations: ['class', 'schedule'],
    });

    if (!booking) {
      throw new NotFoundException(
        'No tiene una reserva confirmada para esta clase',
      );
    }

    if (booking.enListaEspera) {
      throw new BadRequestException(
        'Está en lista de espera, no puede ingresar aún',
      );
    }

    // Marcar como asistido
    booking.estado = BookingStatus.ASISTIDO;
    return await this.bookingRepository.save(booking);
  }

  // Obtener historial completo de clases del usuario
  async findUserHistory(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Booking>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.class', 'class')
      .leftJoinAndSelect('booking.schedule', 'schedule')
      .leftJoinAndSelect('schedule.instructor', 'instructor')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.estado IN (:...estados)', {
        estados: [
          BookingStatus.ASISTIDO,
          BookingStatus.CANCELADO,
          BookingStatus.NO_ASISTIO,
        ],
      })
      .skip(skip)
      .take(limit)
      .orderBy('booking.classDate', 'DESC')
      .addOrderBy('schedule.startTime', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Obtener estadísticas de asistencia del usuario
  async getUserAttendanceStats(userId: string) {
    // Total de bookings realizados (excluyendo lista de espera que nunca se concretó)
    const totalBookings = await this.bookingRepository.count({
      where: {
        userId,
        enListaEspera: false,
      },
    });

    // Clases asistidas
    const attendedClasses = await this.bookingRepository.count({
      where: {
        userId,
        estado: BookingStatus.ASISTIDO,
      },
    });

    // Clases canceladas
    const canceledClasses = await this.bookingRepository.count({
      where: {
        userId,
        estado: BookingStatus.CANCELADO,
      },
    });

    // Clases no asistidas (no shows)
    const noShowClasses = await this.bookingRepository.count({
      where: {
        userId,
        estado: BookingStatus.NO_ASISTIO,
      },
    });

    // Calcular tasa de asistencia
    const totalCompleted = attendedClasses + noShowClasses;
    const attendanceRate =
      totalCompleted > 0 ? (attendedClasses / totalCompleted) * 100 : 0;

    // Obtener últimas clases asistidas para calcular racha
    const recentBookings = await this.bookingRepository.find({
      where: {
        userId,
        estado: BookingStatus.ASISTIDO,
      },
      relations: ['schedule'],
      order: {
        classDate: 'DESC',
      },
      take: 50,
    });

    // Calcular racha actual (días consecutivos con al menos una clase)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceDates = new Set(
      recentBookings.map((booking) => {
        const date = new Date(booking.classDate);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );

    const sortedDates = Array.from(attendanceDates).sort((a, b) => b - a);

    let checkDate = today.getTime();
    for (const date of sortedDates) {
      const diffDays = Math.floor((checkDate - date) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        currentStreak++;
        checkDate = date;
      } else {
        break;
      }
    }

    // Obtener instructor favorito (más frecuente)
    const instructorFrequency = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('schedule.instructorId', 'instructorId')
      .addSelect('instructor.nombre', 'instructorName')
      .addSelect('COUNT(*)', 'count')
      .innerJoin('booking.schedule', 'schedule')
      .innerJoin('schedule.instructor', 'instructor')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.estado = :estado', { estado: BookingStatus.ASISTIDO })
      .groupBy('schedule.instructorId')
      .addGroupBy('instructor.nombre')
      .orderBy('count', 'DESC')
      .getRawOne();

    return {
      totalBookings,
      attendedClasses,
      canceledClasses,
      noShowClasses,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      currentStreak,
      favoriteInstructor: instructorFrequency
        ? {
            id: instructorFrequency.instructorId,
            nombre: instructorFrequency.instructorName,
            classCount: parseInt(instructorFrequency.count),
          }
        : null,
    };
  }

  // Obtener historial mensual de asistencia (para gráficos)
  async getUserMonthlyAttendance(userId: string, months: number = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const bookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.estado = :estado', { estado: BookingStatus.ASISTIDO })
      .andWhere('booking.classDate >= :startDate', { startDate })
      .select('booking.classDate', 'fecha')
      .getRawMany();

    // Agrupar por mes
    const monthlyData = new Map<string, number>();

    bookings.forEach((booking) => {
      const date = new Date(booking.fecha);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1);
    });

    // Convertir a array ordenado
    const result = Array.from(monthlyData.entries())
      .map(([month, count]) => ({
        month,
        count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return result;
  }
}
