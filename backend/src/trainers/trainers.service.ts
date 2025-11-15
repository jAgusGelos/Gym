import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Class } from '../classes/entities/class.entity';
import { ClassSchedule } from '../classes/entities/class-schedule.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Routine } from '../routines/entities/routine.entity';
import { WorkoutRoutine } from '../workout-routines/entities/workout-routine.entity';
import { WorkoutLog } from '../workout-routines/entities/workout-log.entity';

@Injectable()
export class TrainersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassSchedule)
    private classScheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(WorkoutRoutine)
    private workoutRoutineRepository: Repository<WorkoutRoutine>,
    @InjectRepository(WorkoutLog)
    private workoutLogRepository: Repository<WorkoutLog>,
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
      .where('routine.creadorId = :trainerId', { trainerId })
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
            creadorId: trainerId,
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
      throw new ForbiddenException(
        'No tienes rutinas asignadas a este cliente',
      );
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
        fechaReserva: 'DESC',
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

    // Buscar todos los schedules donde el trainer es instructor
    const schedules = await this.classScheduleRepository.find({
      where: {
        instructorId: trainerId,
        activo: true,
      },
      relations: ['class'],
      take: 50,
    });

    // Agrupar por clase
    const classMap = new Map();
    for (const schedule of schedules) {
      if (!classMap.has(schedule.classId)) {
        const attendanceCount = await this.bookingRepository.count({
          where: {
            classId: schedule.classId,
            estado: BookingStatus.ASISTIDO,
          },
        });

        classMap.set(schedule.classId, {
          ...schedule.class,
          schedules: [schedule],
          attendanceCount,
        });
      } else {
        classMap.get(schedule.classId).schedules.push(schedule);
      }
    }

    return Array.from(classMap.values());
  }

  // Obtener estadísticas del entrenador
  async getMyStats(trainerId: string) {
    await this.verifyTrainer(trainerId);

    // Total de clientes
    const routines = await this.routineRepository
      .createQueryBuilder('routine')
      .select('DISTINCT routine.userId')
      .where('routine.creadorId = :trainerId', { trainerId })
      .getRawMany();

    const totalClients = routines.length;

    // Total de rutinas creadas
    const totalRoutines = await this.routineRepository.count({
      where: {
        creadorId: trainerId,
      },
    });

    // Total de rutinas activas
    const activeRoutines = await this.routineRepository.count({
      where: {
        creadorId: trainerId,
        activo: true,
      },
    });

    // Total de horarios de clases (schedules) del entrenador
    const totalClasses = await this.classScheduleRepository.count({
      where: {
        instructorId: trainerId,
        activo: true,
      },
    });

    // Obtener schedules del entrenador para calcular asistencia
    const schedules = await this.classScheduleRepository.find({
      where: {
        instructorId: trainerId,
      },
      select: ['id', 'classId'],
    });

    let totalAttendance = 0;
    if (schedules.length > 0) {
      const scheduleIds = schedules.map((s) => s.id);
      totalAttendance = await this.bookingRepository.count({
        where: {
          scheduleId: In(scheduleIds),
          estado: BookingStatus.ASISTIDO,
        },
      });
    }

    // Próximas clases (schedules activos)
    const upcomingClasses = await this.classScheduleRepository.count({
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

  // === NUEVOS MÉTODOS PARA WORKOUT ROUTINES ===

  // Obtener clientes con workout routines
  async getWorkoutClients(trainerId: string) {
    await this.verifyTrainer(trainerId);

    // Obtener todos los usuarios únicos que tienen workout routines creadas por este entrenador
    const routines = await this.workoutRoutineRepository
      .createQueryBuilder('routine')
      .select('DISTINCT routine.clientId', 'clientId')
      .where('routine.trainerId = :trainerId', { trainerId })
      .andWhere('routine.clientId IS NOT NULL')
      .getRawMany();

    const userIds = routines.map((r) => r.clientId);

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
        const routineCount = await this.workoutRoutineRepository.count({
          where: {
            clientId: client.id,
            trainerId,
          },
        });

        // Obtener rutina activa
        const activeRoutine = await this.workoutRoutineRepository.findOne({
          where: {
            clientId: client.id,
            trainerId,
            activa: true,
          },
          order: {
            createdAt: 'DESC',
          },
        });

        // Obtener total de workout logs (entrenamientos completados)
        const workoutLogs = await this.workoutLogRepository
          .createQueryBuilder('log')
          .leftJoin('log.routineExercise', 'routineExercise')
          .leftJoin('routineExercise.routine', 'routine')
          .where('routine.clientId = :clientId', { clientId: client.id })
          .andWhere('routine.trainerId = :trainerId', { trainerId })
          .getCount();

        // Obtener últimos 7 días de actividad
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentWorkouts = await this.workoutLogRepository
          .createQueryBuilder('log')
          .leftJoin('log.routineExercise', 'routineExercise')
          .leftJoin('routineExercise.routine', 'routine')
          .where('routine.clientId = :clientId', { clientId: client.id })
          .andWhere('routine.trainerId = :trainerId', { trainerId })
          .andWhere('log.fecha >= :sevenDaysAgo', { sevenDaysAgo })
          .getCount();

        return {
          id: client.id,
          nombre: client.nombre,
          apellido: client.apellido,
          email: client.email,
          telefono: client.telefono,
          routineCount,
          activeRoutine: activeRoutine
            ? {
                id: activeRoutine.id,
                nombre: activeRoutine.nombre,
                objetivo: activeRoutine.objetivo,
              }
            : null,
          totalWorkouts: workoutLogs,
          recentWorkouts,
        };
      }),
    );

    return clientsWithInfo;
  }

  // Obtener progreso detallado de un cliente
  async getClientProgress(trainerId: string, clientId: string) {
    await this.verifyTrainer(trainerId);

    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que el entrenador tiene rutinas para este cliente
    const hasRoutines = await this.workoutRoutineRepository.count({
      where: {
        clientId,
        trainerId,
      },
    });

    if (hasRoutines === 0) {
      throw new ForbiddenException(
        'No tienes rutinas asignadas a este cliente',
      );
    }

    // Obtener rutinas del cliente
    const routines = await this.workoutRoutineRepository.find({
      where: {
        clientId,
        trainerId,
      },
      relations: ['exercises', 'exercises.exercise'],
      order: {
        createdAt: 'DESC',
      },
    });

    // Obtener workout logs recientes
    const recentLogs = await this.workoutLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.routineExercise', 'routineExercise')
      .leftJoinAndSelect('routineExercise.exercise', 'exercise')
      .leftJoinAndSelect('routineExercise.routine', 'routine')
      .where('routine.clientId = :clientId', { clientId })
      .andWhere('routine.trainerId = :trainerId', { trainerId })
      .orderBy('log.fecha', 'DESC')
      .addOrderBy('log.createdAt', 'DESC')
      .limit(20)
      .getMany();

    // Estadísticas de adherencia
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logsLast30Days = await this.workoutLogRepository
      .createQueryBuilder('log')
      .leftJoin('log.routineExercise', 'routineExercise')
      .leftJoin('routineExercise.routine', 'routine')
      .where('routine.clientId = :clientId', { clientId })
      .andWhere('routine.trainerId = :trainerId', { trainerId })
      .andWhere('log.fecha >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    // Días únicos de entrenamiento en los últimos 30 días
    const uniqueDays = await this.workoutLogRepository
      .createQueryBuilder('log')
      .select('DISTINCT DATE(log.fecha)', 'fecha')
      .leftJoin('log.routineExercise', 'routineExercise')
      .leftJoin('routineExercise.routine', 'routine')
      .where('routine.clientId = :clientId', { clientId })
      .andWhere('routine.trainerId = :trainerId', { trainerId })
      .andWhere('log.fecha >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getRawMany();

    return {
      client: {
        id: client.id,
        nombre: client.nombre,
        apellido: client.apellido,
        email: client.email,
      },
      routines,
      recentLogs,
      stats: {
        totalWorkoutsLast30Days: logsLast30Days,
        uniqueTrainingDaysLast30Days: uniqueDays.length,
        totalRoutines: routines.length,
        activeRoutineCount: routines.filter((r) => r.activa).length,
      },
    };
  }

  // Obtener todos los clientes del gimnasio (para asignar rutinas)
  async getAllMembers(trainerId: string) {
    await this.verifyTrainer(trainerId);

    const members = await this.userRepository.find({
      where: {
        rol: UserRole.SOCIO,
      },
      select: ['id', 'nombre', 'apellido', 'email'],
      order: {
        nombre: 'ASC',
      },
    });

    return members;
  }
}
