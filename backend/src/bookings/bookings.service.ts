import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const { classId } = createBookingDto;

    // Verificar que la clase existe
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });

    if (!classEntity) {
      throw new NotFoundException('Clase no encontrada');
    }

    // Verificar que la clase está activa
    if (!classEntity.activo) {
      throw new BadRequestException('La clase no está activa');
    }

    // Verificar que la clase no ha pasado
    if (new Date(classEntity.fechaHoraInicio) < new Date()) {
      throw new BadRequestException('No se puede reservar una clase pasada');
    }

    // Verificar que el usuario no tiene ya una reserva para esta clase
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        userId,
        classId,
        estado: BookingStatus.RESERVADO,
      },
    });

    if (existingBooking) {
      throw new ConflictException('Ya tiene una reserva para esta clase');
    }

    // Verificar disponibilidad de cupo
    const hasSpots = classEntity.cupoActual < classEntity.cupoMaximo;

    let booking: Booking;

    if (hasSpots) {
      // Hay cupo disponible
      booking = this.bookingRepository.create({
        userId,
        classId,
        estado: BookingStatus.RESERVADO,
        enListaEspera: false,
      });

      // Incrementar cupo actual
      classEntity.cupoActual += 1;
      await this.classRepository.save(classEntity);
    } else {
      // No hay cupo, agregar a lista de espera
      const maxPosition = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.classId = :classId', { classId })
        .andWhere('booking.enListaEspera = :enLista', { enLista: true })
        .select('MAX(booking.posicionListaEspera)', 'max')
        .getRawOne();

      const nextPosition = (maxPosition?.max || 0) + 1;

      booking = this.bookingRepository.create({
        userId,
        classId,
        estado: BookingStatus.RESERVADO,
        enListaEspera: true,
        posicionListaEspera: nextPosition,
      });
    }

    const savedBooking = await this.bookingRepository.save(booking);

    return await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['class', 'class.instructor', 'user'],
    });
  }

  async cancel(id: string, userId: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['class'],
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

    // Verificar que falten al menos 2 horas para la clase
    const hoursUntilClass =
      (new Date(booking.class.fechaHoraInicio).getTime() - new Date().getTime()) /
      (1000 * 60 * 60);

    if (hoursUntilClass < 2) {
      throw new BadRequestException(
        'No se puede cancelar con menos de 2 horas de anticipación',
      );
    }

    // Si estaba en la lista principal, decrementar cupo y promover de lista de espera
    if (!booking.enListaEspera) {
      booking.class.cupoActual -= 1;
      await this.classRepository.save(booking.class);

      // Buscar el primero en lista de espera
      const nextInWaitlist = await this.bookingRepository.findOne({
        where: {
          classId: booking.classId,
          enListaEspera: true,
          estado: BookingStatus.RESERVADO,
        },
        order: {
          posicionListaEspera: 'ASC',
        },
      });

      if (nextInWaitlist) {
        // Promover de lista de espera
        nextInWaitlist.enListaEspera = false;
        nextInWaitlist.posicionListaEspera = null;
        await this.bookingRepository.save(nextInWaitlist);

        // Incrementar cupo nuevamente
        booking.class.cupoActual += 1;
        await this.classRepository.save(booking.class);

        // TODO: Enviar notificación al usuario promovido
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
      .leftJoinAndSelect('class.instructor', 'instructor')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.estado = :estado', { estado: BookingStatus.RESERVADO })
      .skip(skip)
      .take(limit)
      .orderBy('class.fechaHoraInicio', 'ASC');

    if (!includeExpired) {
      queryBuilder.andWhere('class.fechaHoraInicio >= :now', { now: new Date() });
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

  async findClassBookings(classId: string): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: {
        classId,
        estado: BookingStatus.RESERVADO,
      },
      relations: ['user'],
      order: {
        enListaEspera: 'ASC',
        posicionListaEspera: 'ASC',
        fechaReserva: 'ASC',
      },
    });
  }

  async checkInWithQR(qrCode: string, classId: string): Promise<Booking> {
    // Buscar usuario por QR
    const user = await this.userRepository.findOne({
      where: { qrCode },
    });

    if (!user) {
      throw new NotFoundException('Código QR inválido');
    }

    // Buscar reserva del usuario para esta clase
    const booking = await this.bookingRepository.findOne({
      where: {
        userId: user.id,
        classId,
        estado: BookingStatus.RESERVADO,
      },
      relations: ['class'],
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
}
