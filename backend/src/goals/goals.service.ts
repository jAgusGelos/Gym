import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGoal, GoalType, GoalStatus } from './entities/user-goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ProgressEntry } from '../progress-tracking/entities/progress-entry.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(UserGoal)
    private goalRepository: Repository<UserGoal>,
    @InjectRepository(ProgressEntry)
    private progressRepository: Repository<ProgressEntry>,
  ) {}

  // Crear un nuevo objetivo
  async create(userId: string, createGoalDto: CreateGoalDto): Promise<UserGoal> {
    // Si no se especifican valores iniciales, obtenerlos del último progreso
    if (!createGoalDto.pesoInicial && !createGoalDto.grasaCorporalInicial) {
      const latestProgress = await this.progressRepository.findOne({
        where: { userId },
        order: { fecha: 'DESC' },
      });

      if (latestProgress) {
        createGoalDto.pesoInicial = latestProgress.peso ? Number(latestProgress.peso) : undefined;
        createGoalDto.grasaCorporalInicial = latestProgress.grasaCorporal
          ? Number(latestProgress.grasaCorporal)
          : undefined;
        createGoalDto.masaMuscularInicial = latestProgress.masaMuscular
          ? Number(latestProgress.masaMuscular)
          : undefined;
      }
    }

    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId,
      porcentajeProgreso: 0,
    });

    return this.goalRepository.save(goal);
  }

  // Obtener todos los objetivos del usuario
  async findAllByUser(userId: string): Promise<UserGoal[]> {
    return this.goalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener objetivos activos del usuario
  async findActiveByUser(userId: string): Promise<UserGoal[]> {
    const goals = await this.goalRepository.find({
      where: { userId, estado: GoalStatus.ACTIVO },
      order: { createdAt: 'DESC' },
    });

    // Actualizar progreso de cada objetivo activo
    for (const goal of goals) {
      await this.updateProgress(goal);
    }

    return goals;
  }

  // Obtener un objetivo específico
  async findOne(id: string, userId: string): Promise<UserGoal> {
    const goal = await this.goalRepository.findOne({ where: { id } });

    if (!goal) {
      throw new NotFoundException('Objetivo no encontrado');
    }

    if (goal.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este objetivo');
    }

    // Actualizar progreso antes de retornar
    await this.updateProgress(goal);

    return goal;
  }

  // Actualizar un objetivo
  async update(id: string, userId: string, updateGoalDto: UpdateGoalDto): Promise<UserGoal> {
    const goal = await this.findOne(id, userId);

    Object.assign(goal, updateGoalDto);

    // Si se marca como completado, guardar fecha
    if (updateGoalDto.estado === GoalStatus.COMPLETADO && !goal.fechaCompletado) {
      goal.fechaCompletado = new Date();
    }

    return this.goalRepository.save(goal);
  }

  // Eliminar un objetivo
  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.findOne(id, userId);
    await this.goalRepository.remove(goal);
  }

  // Actualizar el progreso de un objetivo basado en los últimos registros
  async updateProgress(goal: UserGoal): Promise<UserGoal> {
    const latestProgress = await this.progressRepository.findOne({
      where: { userId: goal.userId },
      order: { fecha: 'DESC' },
    });

    if (!latestProgress) {
      return goal;
    }

    let porcentaje = 0;

    switch (goal.tipo) {
      case GoalType.PERDER_PESO:
        if (goal.pesoInicial && goal.pesoObjetivo && latestProgress.peso) {
          const totalChange = goal.pesoInicial - goal.pesoObjetivo;
          const currentChange = goal.pesoInicial - Number(latestProgress.peso);
          porcentaje = Math.min(Math.round((currentChange / totalChange) * 100), 100);
        }
        break;

      case GoalType.GANAR_PESO:
      case GoalType.GANAR_MUSCULO:
        if (goal.pesoInicial && goal.pesoObjetivo && latestProgress.peso) {
          const totalChange = goal.pesoObjetivo - goal.pesoInicial;
          const currentChange = Number(latestProgress.peso) - goal.pesoInicial;
          porcentaje = Math.min(Math.round((currentChange / totalChange) * 100), 100);
        }
        break;

      case GoalType.REDUCIR_GRASA:
        if (goal.grasaCorporalInicial && goal.grasaCorporalObjetivo && latestProgress.grasaCorporal) {
          const totalChange = goal.grasaCorporalInicial - goal.grasaCorporalObjetivo;
          const currentChange = goal.grasaCorporalInicial - Number(latestProgress.grasaCorporal);
          porcentaje = Math.min(Math.round((currentChange / totalChange) * 100), 100);
        }
        break;

      case GoalType.MANTENER_PESO:
        if (goal.pesoInicial && latestProgress.peso) {
          const diff = Math.abs(goal.pesoInicial - Number(latestProgress.peso));
          // Considerar exitoso si se mantiene +/- 2kg
          porcentaje = diff <= 2 ? 100 : Math.max(0, 100 - Math.round(diff * 10));
        }
        break;

      default:
        // Para otros tipos, calcular basado en tiempo transcurrido
        if (goal.fechaObjetivo) {
          const totalDays = Math.floor(
            (new Date(goal.fechaObjetivo).getTime() - new Date(goal.fechaInicio).getTime()) /
            (1000 * 60 * 60 * 24)
          );
          const elapsedDays = Math.floor(
            (new Date().getTime() - new Date(goal.fechaInicio).getTime()) /
            (1000 * 60 * 60 * 24)
          );
          porcentaje = Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
        }
        break;
    }

    // Auto-completar si alcanzó el 100%
    if (porcentaje >= 100 && goal.estado === GoalStatus.ACTIVO) {
      goal.estado = GoalStatus.COMPLETADO;
      goal.fechaCompletado = new Date();
    }

    goal.porcentajeProgreso = Math.max(0, porcentaje);
    return this.goalRepository.save(goal);
  }

  // Recalcular progreso de todos los objetivos activos de un usuario
  async recalculateUserProgress(userId: string): Promise<void> {
    const activeGoals = await this.goalRepository.find({
      where: { userId, estado: GoalStatus.ACTIVO },
    });

    for (const goal of activeGoals) {
      await this.updateProgress(goal);
    }
  }
}
