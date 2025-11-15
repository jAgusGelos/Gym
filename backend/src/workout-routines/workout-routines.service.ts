import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkoutRoutine, RoutineType } from './entities/workout-routine.entity';
import { RoutineExercise } from './entities/routine-exercise.entity';
import { WorkoutLog } from './entities/workout-log.entity';
import { CreateWorkoutRoutineDto } from './dto/create-workout-routine.dto';
import { UpdateWorkoutRoutineDto } from './dto/update-workout-routine.dto';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UserRole, User } from '../users/entities/user.entity';

@Injectable()
export class WorkoutRoutinesService {
  constructor(
    @InjectRepository(WorkoutRoutine)
    private routineRepository: Repository<WorkoutRoutine>,
    @InjectRepository(RoutineExercise)
    private routineExerciseRepository: Repository<RoutineExercise>,
    @InjectRepository(WorkoutLog)
    private workoutLogRepository: Repository<WorkoutLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    trainerId: string,
    createWorkoutRoutineDto: CreateWorkoutRoutineDto,
  ): Promise<WorkoutRoutine> {
    const { exercises, ...routineData } = createWorkoutRoutineDto;

    // Create routine
    const routine = this.routineRepository.create({
      ...routineData,
      trainerId,
    });

    const savedRoutine = await this.routineRepository.save(routine);

    // Create routine exercises
    if (exercises && exercises.length > 0) {
      const routineExercises = exercises.map((ex) =>
        this.routineExerciseRepository.create({
          ...ex,
          routineId: savedRoutine.id,
        }),
      );

      await this.routineExerciseRepository.save(routineExercises);
    }

    return await this.findOne(savedRoutine.id);
  }

  async findAll(
    trainerId?: string,
    clientId?: string,
    activa?: boolean,
    tipo?: string,
    nivel?: string,
  ): Promise<WorkoutRoutine[]> {
    const query = this.routineRepository
      .createQueryBuilder('routine')
      .leftJoinAndSelect('routine.exercises', 'exercises')
      .leftJoinAndSelect('exercises.exercise', 'exercise')
      .leftJoinAndSelect('routine.trainer', 'trainer')
      .leftJoinAndSelect('routine.client', 'client');

    if (trainerId) {
      query.andWhere('routine.trainerId = :trainerId', { trainerId });
    }

    if (clientId) {
      query.andWhere('routine.clientId = :clientId', { clientId });
    }

    if (activa !== undefined) {
      query.andWhere('routine.activa = :activa', { activa });
    }

    if (tipo) {
      query.andWhere('routine.tipo = :tipo', { tipo });
    }

    if (nivel) {
      query.andWhere('routine.nivel = :nivel', { nivel });
    }

    query.orderBy('routine.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<WorkoutRoutine> {
    const routine = await this.routineRepository.findOne({
      where: { id },
      relations: ['exercises', 'exercises.exercise', 'trainer', 'client'],
      order: {
        exercises: {
          dia: 'ASC',
          orden: 'ASC',
        },
      },
    });

    if (!routine) {
      throw new NotFoundException(`Routine with ID ${id} not found`);
    }

    return routine;
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    updateWorkoutRoutineDto: UpdateWorkoutRoutineDto,
  ): Promise<WorkoutRoutine> {
    const routine = await this.findOne(id);

    // Only trainer who created it or admin can update
    if (routine.trainerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own routines');
    }

    const { exercises, ...routineData } = updateWorkoutRoutineDto;

    Object.assign(routine, routineData);
    await this.routineRepository.save(routine);

    // Update exercises if provided
    if (exercises) {
      // Remove existing exercises
      await this.routineExerciseRepository.delete({ routineId: id });

      // Add new exercises
      const routineExercises = exercises.map((ex) =>
        this.routineExerciseRepository.create({
          ...ex,
          routineId: id,
        }),
      );

      await this.routineExerciseRepository.save(routineExercises);
    }

    return await this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const routine = await this.findOne(id);

    if (routine.trainerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own routines');
    }

    await this.routineRepository.remove(routine);
  }

  async activateRoutine(id: string, userId: string): Promise<WorkoutRoutine> {
    const routine = await this.findOne(id);

    if (routine.clientId !== userId) {
      throw new ForbiddenException('You can only activate your own routines');
    }

    // Deactivate other routines for this client
    await this.routineRepository.update(
      { clientId: userId, activa: true },
      { activa: false },
    );

    // Activate this routine
    routine.activa = true;
    return await this.routineRepository.save(routine);
  }

  // Workout Log methods
  async logWorkout(
    userId: string,
    createWorkoutLogDto: CreateWorkoutLogDto,
  ): Promise<WorkoutLog> {
    const log = this.workoutLogRepository.create({
      ...createWorkoutLogDto,
      userId,
      fecha: createWorkoutLogDto.fecha
        ? new Date(createWorkoutLogDto.fecha)
        : new Date(),
    });

    return await this.workoutLogRepository.save(log);
  }

  async getWorkoutLogs(
    userId: string,
    routineId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<WorkoutLog[]> {
    const query = this.workoutLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.routineExercise', 'routineExercise')
      .leftJoinAndSelect('routineExercise.exercise', 'exercise')
      .leftJoinAndSelect('routineExercise.routine', 'routine')
      .where('log.userId = :userId', { userId });

    if (routineId) {
      query.andWhere('routine.id = :routineId', { routineId });
    }

    if (startDate) {
      query.andWhere('log.fecha >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('log.fecha <= :endDate', { endDate });
    }

    query.orderBy('log.fecha', 'DESC').addOrderBy('log.createdAt', 'DESC');

    return await query.getMany();
  }

  async getExerciseProgress(
    userId: string,
    exerciseId: string,
  ): Promise<WorkoutLog[]> {
    return await this.workoutLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.routineExercise', 'routineExercise')
      .leftJoinAndSelect('routineExercise.exercise', 'exercise')
      .where('log.userId = :userId', { userId })
      .andWhere('exercise.id = :exerciseId', { exerciseId })
      .orderBy('log.fecha', 'DESC')
      .limit(50)
      .getMany();
  }

  // Personal Plan methods
  async assignPersonalPlan(
    userId: string,
    routineId: string,
  ): Promise<WorkoutRoutine> {
    const routine = await this.findOne(routineId);

    // Verificar que el plan sea del tipo PERSONAL o asignado al usuario
    if (routine.tipo !== RoutineType.PERSONAL && routine.clientId !== userId) {
      throw new ForbiddenException(
        'Solo puedes asignar planes personales o planes asignados a ti',
      );
    }

    // Actualizar el usuario con el plan activo
    await this.userRepository.update(userId, { activePlanId: routineId });

    return routine;
  }

  async getMyPlan(userId: string): Promise<WorkoutRoutine | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.activePlanId) {
      return null;
    }

    return await this.findOne(user.activePlanId);
  }

  async createPersonalPlan(
    trainerId: string,
    clientId: string,
    createWorkoutRoutineDto: CreateWorkoutRoutineDto,
  ): Promise<WorkoutRoutine> {
    const planData = {
      ...createWorkoutRoutineDto,
      clientId,
      tipo: RoutineType.PERSONAL,
    };

    const routine = await this.create(trainerId, planData);

    // Asignar automáticamente como plan activo del usuario
    await this.userRepository.update(clientId, { activePlanId: routine.id });

    return routine;
  }
}
