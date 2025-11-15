import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WorkoutLog } from './entities/workout-log.entity';
import { ExerciseSet } from './entities/exercise-set.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto } from './dto/update-workout-log.dto';

@Injectable()
export class WorkoutLogsService {
  constructor(
    @InjectRepository(WorkoutLog)
    private workoutLogRepository: Repository<WorkoutLog>,
    @InjectRepository(ExerciseSet)
    private exerciseSetRepository: Repository<ExerciseSet>,
  ) {}

  // Crear un nuevo workout log con sets
  async create(userId: string, createWorkoutLogDto: CreateWorkoutLogDto): Promise<WorkoutLog> {
    const { sets, ...logData } = createWorkoutLogDto;

    // Crear el workout log
    const workoutLog = this.workoutLogRepository.create({
      ...logData,
      userId,
    });

    const savedLog = await this.workoutLogRepository.save(workoutLog);

    // Crear los sets y verificar PRs
    const exerciseSets = await Promise.all(
      sets.map(async (setDto) => {
        const set = this.exerciseSetRepository.create({
          ...setDto,
          workoutLogId: savedLog.id,
        });

        // Verificar si es PR
        const isPR = await this.checkIfPR(userId, setDto.exerciseId, setDto.peso, setDto.repeticiones);
        set.esPR = isPR;

        return this.exerciseSetRepository.save(set);
      }),
    );

    savedLog.sets = exerciseSets;
    return savedLog;
  }

  // Obtener todos los workout logs del usuario
  async findAllByUser(userId: string): Promise<WorkoutLog[]> {
    return this.workoutLogRepository.find({
      where: { userId },
      relations: ['sets', 'sets.exercise', 'routine'],
      order: { fecha: 'DESC' },
    });
  }

  // Obtener workout logs por rango de fechas
  async findByDateRange(userId: string, startDate: string, endDate: string): Promise<WorkoutLog[]> {
    return this.workoutLogRepository.find({
      where: {
        userId,
        fecha: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['sets', 'sets.exercise', 'routine'],
      order: { fecha: 'DESC' },
    });
  }

  // Obtener un workout log específico
  async findOne(id: string, userId: string): Promise<WorkoutLog> {
    const workoutLog = await this.workoutLogRepository.findOne({
      where: { id },
      relations: ['sets', 'sets.exercise', 'routine'],
    });

    if (!workoutLog) {
      throw new NotFoundException('Workout log no encontrado');
    }

    if (workoutLog.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este workout log');
    }

    return workoutLog;
  }

  // Actualizar un workout log
  async update(id: string, userId: string, updateWorkoutLogDto: UpdateWorkoutLogDto): Promise<WorkoutLog> {
    const workoutLog = await this.findOne(id, userId);

    const { sets, ...logData } = updateWorkoutLogDto;

    // Actualizar datos básicos del log
    Object.assign(workoutLog, logData);
    await this.workoutLogRepository.save(workoutLog);

    // Si se envían sets, actualizarlos
    if (sets) {
      // Eliminar sets anteriores
      await this.exerciseSetRepository.delete({ workoutLogId: id });

      // Crear nuevos sets
      const exerciseSets = await Promise.all(
        sets.map(async (setDto) => {
          const set = this.exerciseSetRepository.create({
            ...setDto,
            workoutLogId: id,
          });

          const isPR = await this.checkIfPR(userId, setDto.exerciseId, setDto.peso, setDto.repeticiones);
          set.esPR = isPR;

          return this.exerciseSetRepository.save(set);
        }),
      );

      workoutLog.sets = exerciseSets;
    }

    return workoutLog;
  }

  // Eliminar un workout log
  async remove(id: string, userId: string): Promise<void> {
    const workoutLog = await this.findOne(id, userId);
    await this.workoutLogRepository.remove(workoutLog);
  }

  // Obtener historial de un ejercicio específico
  async getExerciseHistory(userId: string, exerciseId: string) {
    const sets = await this.exerciseSetRepository.find({
      where: {
        exerciseId,
        workoutLog: { userId },
      },
      relations: ['workoutLog'],
      order: { createdAt: 'DESC' },
      take: 100,
    });

    // Agrupar por sesión
    const sessions = sets.reduce((acc, set) => {
      const logId = set.workoutLog.id;
      if (!acc[logId]) {
        acc[logId] = {
          fecha: set.workoutLog.fecha,
          sets: [],
        };
      }
      acc[logId].sets.push({
        setNumber: set.setNumber,
        peso: Number(set.peso),
        repeticiones: set.repeticiones,
        rir: set.rir,
        esPR: set.esPR,
      });
      return acc;
    }, {} as any);

    return Object.values(sessions);
  }

  // Obtener estadísticas de un ejercicio
  async getExerciseStats(userId: string, exerciseId: string) {
    const sets = await this.exerciseSetRepository.find({
      where: {
        exerciseId,
        workoutLog: { userId },
      },
      relations: ['workoutLog'],
      order: { createdAt: 'DESC' },
    });

    if (sets.length === 0) {
      return {
        totalSets: 0,
        totalReps: 0,
        volumeTotal: 0,
        pr: null,
        pesoPromedio: 0,
        repsPromedio: 0,
        ultimaSesion: null,
      };
    }

    const totalSets = sets.length;
    const totalReps = sets.reduce((sum, set) => sum + set.repeticiones, 0);
    const volumeTotal = sets.reduce((sum, set) => sum + Number(set.peso) * set.repeticiones, 0);

    // Encontrar PR (mejor peso x reps)
    const pr = sets.reduce((best, set) => {
      const current1RM = this.calculate1RM(Number(set.peso), set.repeticiones);
      const best1RM = best ? this.calculate1RM(Number(best.peso), best.repeticiones) : 0;
      return current1RM > best1RM ? set : best;
    }, null as ExerciseSet | null);

    const pesoPromedio = sets.reduce((sum, set) => sum + Number(set.peso), 0) / totalSets;
    const repsPromedio = totalReps / totalSets;

    // Última sesión
    const lastWorkout = sets[0]?.workoutLog;

    return {
      totalSets,
      totalReps,
      volumeTotal: Math.round(volumeTotal),
      pr: pr
        ? {
            peso: Number(pr.peso),
            repeticiones: pr.repeticiones,
            fecha: pr.createdAt,
            estimado1RM: this.calculate1RM(Number(pr.peso), pr.repeticiones),
          }
        : null,
      pesoPromedio: Math.round(pesoPromedio * 10) / 10,
      repsPromedio: Math.round(repsPromedio * 10) / 10,
      ultimaSesion: lastWorkout ? lastWorkout.fecha : null,
    };
  }

  // Obtener gráfico de evolución de un ejercicio
  async getExerciseChart(userId: string, exerciseId: string, limit: number = 10) {
    const sets = await this.exerciseSetRepository.find({
      where: {
        exerciseId,
        workoutLog: { userId },
      },
      relations: ['workoutLog'],
      order: { createdAt: 'DESC' },
      take: limit * 5, // Tomamos más para agrupar por sesión
    });

    // Agrupar por fecha y calcular el mejor set de cada sesión
    const sessionMap = new Map<string, ExerciseSet>();

    sets.forEach((set) => {
      const dateKey = new Date(set.workoutLog.fecha).toISOString().split('T')[0];
      const existing = sessionMap.get(dateKey);

      if (!existing) {
        sessionMap.set(dateKey, set);
      } else {
        const current1RM = this.calculate1RM(Number(set.peso), set.repeticiones);
        const existing1RM = this.calculate1RM(Number(existing.peso), existing.repeticiones);

        if (current1RM > existing1RM) {
          sessionMap.set(dateKey, set);
        }
      }
    });

    // Convertir a array y ordenar por fecha
    const chartData = Array.from(sessionMap.entries())
      .map(([fecha, set]) => ({
        fecha,
        peso: Number(set.peso),
        repeticiones: set.repeticiones,
        estimado1RM: this.calculate1RM(Number(set.peso), set.repeticiones),
        volumen: Number(set.peso) * set.repeticiones,
      }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(-limit); // Tomar solo las últimas N sesiones

    return chartData;
  }

  // Verificar si un set es PR
  private async checkIfPR(userId: string, exerciseId: string, peso: number, reps: number): Promise<boolean> {
    const current1RM = this.calculate1RM(peso, reps);

    const bestSet = await this.exerciseSetRepository
      .createQueryBuilder('set')
      .innerJoin('set.workoutLog', 'log')
      .where('log.userId = :userId', { userId })
      .andWhere('set.exerciseId = :exerciseId', { exerciseId })
      .orderBy('set.peso * set.repeticiones', 'DESC')
      .getOne();

    if (!bestSet) {
      return true; // Primer set del ejercicio siempre es PR
    }

    const best1RM = this.calculate1RM(Number(bestSet.peso), bestSet.repeticiones);
    return current1RM > best1RM;
  }

  // Calcular 1RM estimado usando fórmula de Epley
  private calculate1RM(peso: number, reps: number): number {
    if (reps === 1) return peso;
    return peso * (1 + reps / 30);
  }

  // Obtener PRs de todos los ejercicios del usuario
  async getAllPRs(userId: string) {
    const sets = await this.exerciseSetRepository.find({
      where: {
        esPR: true,
        workoutLog: { userId },
      },
      relations: ['exercise', 'workoutLog'],
      order: { createdAt: 'DESC' },
    });

    // Agrupar por ejercicio y tomar el mejor PR de cada uno
    const prsMap = new Map();

    sets.forEach((set) => {
      const exerciseId = set.exerciseId;
      const current1RM = this.calculate1RM(Number(set.peso), set.repeticiones);

      if (!prsMap.has(exerciseId)) {
        prsMap.set(exerciseId, {
          exercise: set.exercise,
          peso: Number(set.peso),
          repeticiones: set.repeticiones,
          fecha: set.workoutLog.fecha,
          estimado1RM: current1RM,
        });
      } else {
        const existing = prsMap.get(exerciseId);
        if (current1RM > existing.estimado1RM) {
          prsMap.set(exerciseId, {
            exercise: set.exercise,
            peso: Number(set.peso),
            repeticiones: set.repeticiones,
            fecha: set.workoutLog.fecha,
            estimado1RM: current1RM,
          });
        }
      }
    });

    return Array.from(prsMap.values());
  }

  // Obtener estadísticas generales del usuario
  async getUserStats(userId: string) {
    const logs = await this.workoutLogRepository.find({
      where: { userId },
      relations: ['sets'],
    });

    const totalWorkouts = logs.length;
    const totalSets = logs.reduce((sum, log) => sum + log.sets.length, 0);
    const totalVolume = logs.reduce(
      (sum, log) =>
        sum + log.sets.reduce((setSum, set) => setSum + Number(set.peso) * set.repeticiones, 0),
      0,
    );

    // Calcular racha actual
    const sortedLogs = logs.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const log of sortedLogs) {
      const logDate = new Date(log.fecha);

      if (!lastDate) {
        currentStreak = 1;
        lastDate = logDate;
      } else {
        const diffDays = Math.floor(
          (lastDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          currentStreak++;
          lastDate = logDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }

    return {
      totalWorkouts,
      totalSets,
      totalVolume: Math.round(totalVolume),
      currentStreak,
      avgSetsPerWorkout: totalWorkouts > 0 ? Math.round((totalSets / totalWorkouts) * 10) / 10 : 0,
    };
  }
}
