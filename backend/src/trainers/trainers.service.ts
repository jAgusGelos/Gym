import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Routine } from '../routines/entities/routine.entity';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
  ) {}

  // Verificar que el usuario sea entrenador
  async verifyTrainer(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.rol !== UserRole.ENTRENADOR && user.rol !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permisos de entrenador');
    }

    return user;
  }

  // Obtener clientes del entrenador (usuarios que tienen rutinas creadas por él)
  async getMyClients(trainerId: string) {
    await this.verifyTrainer(trainerId);

    // Obtener todos los usuarios únicos que tienen rutinas creadas por este entrenador
    const routines = await this.routineRepository
      .createQueryBuilder('routine')
      .select('DISTINCT routine.userId', 'userId')
      .where('routine.creadoPor = :trainerId', { trainerId })
      .getRawMany();

    const userIds = routines.map((r) => r.userId);

    if (userIds.length === 0) {
      return [];
    }

    // Obtener los datos completos de los usuarios
    const clients = await this.userRepository.find({
      where: { id: In(userIds) },
      order: { nombre: 'ASC' },
    });

    // Agregar información adicional para cada cliente
    const clientsWithInfo = await Promise.all(
      clients.map(async (client) => {
        // Contar rutinas del cliente
        const routineCount = await this.routineRepository.count({
          where: {
            userId: client.id,
            creadoPor: trainerId,
          },
        });

        // Obtener última rutina activa
        const latestRoutine = await this.routineRepository.findOne({
          where: {
            userId: client.id,
            creadoPor: trainerId,
            activo: true,
          },
          order: {
            createdAt: 'DESC',
          },
        });

        return {
          ...client,
          routineCount,
          latestRoutine: latestRoutine
            ? {
                id: latestRoutine.id,
                nombre: latestRoutine.nombre,
                objetivo: latestRoutine.objetivo,
                createdAt: latestRoutine.createdAt,
              }
            : null,
        };
      }),
    );

    return clientsWithInfo;
  }

  // Obtener detalle de un cliente específico
  async getClientDetails(trainerId: string, clientId: string) {
    await this.verifyTrainer(trainerId);

    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que el entrenador tiene rutinas para este cliente
    const hasRoutines = await this.routineRepository.count({
      where: {
        userId: clientId,
        creadoPor: trainerId,
      },
    });

    if (hasRoutines === 0) {
      throw new ForbiddenException('No tienes rutinas asignadas a este cliente');
    }

    // Obtener rutinas del cliente creadas por este entrenador
    const routines = await this.routineRepository.find({
      where: {
        userId: clientId,
        creadoPor: trainerId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    // Obtener clases del cliente
    const bookings = await this.bookingRepository.find({
      where: {
        userId: clientId,
        estado: BookingStatus.ASISTIDO,
      },
      relations: ['class'],
      order: {
        createdAt: 'DESC',
      },
      take: 10,
    });

    return {
      client,
      routines,
      recentClasses: bookings,
    };
  }

  // Obtener clases del entrenador
  async getMyClasses(trainerId: string) {
    await this.verifyTrainer(trainerId);

    const classes = await this.classRepository.find({
      where: {
        instructorId: trainerId,
      },
      order: {
        fechaHoraInicio: 'DESC',
      },
      take: 50,
    });

    // Agregar información de asistencia para cada clase
    const classesWithAttendance = await Promise.all(
      classes.map(async (classItem) => {
        const bookings = await this.bookingRepository.count({
          where: {
            classId: classItem.id,
            estado: BookingStatus.ASISTIDO,
          },
        });

        return {
          ...classItem,
          attendanceCount: bookings,
        };
      }),
    );

    return classesWithAttendance;
  }

  // Obtener estadísticas del entrenador
  async getMyStats(trainerId: string) {
    await this.verifyTrainer(trainerId);

    // Total de clientes
    const routines = await this.routineRepository
      .createQueryBuilder('routine')
      .select('DISTINCT routine.userId')
      .where('routine.creadoPor = :trainerId', { trainerId })
      .getRawMany();

    const totalClients = routines.length;

    // Total de rutinas creadas
    const totalRoutines = await this.routineRepository.count({
      where: {
        creadoPor: trainerId,
      },
    });

    // Total de rutinas activas
    const activeRoutines = await this.routineRepository.count({
      where: {
        creadoPor: trainerId,
        activo: true,
      },
    });

    // Total de clases impartidas
    const totalClasses = await this.classRepository.count({
      where: {
        instructorId: trainerId,
      },
    });

    // Clases con asistencia
    const classIds = await this.classRepository.find({
      where: {
        instructorId: trainerId,
      },
      select: ['id'],
    });

    let totalAttendance = 0;
    if (classIds.length > 0) {
      const ids = classIds.map((c) => c.id);
      totalAttendance = await this.bookingRepository.count({
        where: {
          classId: In(ids),
          estado: BookingStatus.ASISTIDO,
        },
      });
    }

    // Próximas clases
    const now = new Date();
    const upcomingClasses = await this.classRepository.count({
      where: {
        instructorId: trainerId,
        activo: true,
      },
    });

    return {
      totalClients,
      totalRoutines,
      activeRoutines,
      totalClasses,
      totalAttendance,
      upcomingClasses,
    };
  }
}
