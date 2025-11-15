import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine, RoutineLevel, RoutineGoal } from './entities/routine.entity';
import { RoutineExercise } from './entities/routine-exercise.entity';
import { UserFavoriteRoutine } from './entities/user-favorite-routine.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

export interface RoutineFilters {
  nivel?: RoutineLevel;
  objetivo?: RoutineGoal;
  publico?: boolean;
  activo?: boolean;
}

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(RoutineExercise)
    private routineExerciseRepository: Repository<RoutineExercise>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(UserFavoriteRoutine)
    private favoriteRepository: Repository<UserFavoriteRoutine>,
  ) {}

  async create(
    createRoutineDto: CreateRoutineDto,
    creadorId: string,
  ): Promise<Routine> {
    const { ejercicios, ...routineData } = createRoutineDto;

    // Crear la rutina
    const routine = this.routineRepository.create({
      ...routineData,
      creadorId,
    });

    const savedRoutine = await this.routineRepository.save(routine);

    // Crear los ejercicios de la rutina
    if (ejercicios && ejercicios.length > 0) {
      const routineExercises = ejercicios.map((ejercicio) =>
        this.routineExerciseRepository.create({
          routineId: savedRoutine.id,
          ...ejercicio,
        }),
      );

      await this.routineExerciseRepository.save(routineExercises);
    }

    return await this.findOne(savedRoutine.id);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: RoutineFilters,
  ): Promise<PaginatedResult<Routine>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.routineRepository
      .createQueryBuilder('routine')
      .leftJoinAndSelect('routine.creador', 'creador')
      .leftJoinAndSelect('routine.ejercicios', 'ejercicios')
      .leftJoinAndSelect('ejercicios.exercise', 'exercise')
      .skip(skip)
      .take(limit)
      .orderBy('routine.createdAt', 'DESC');

    if (filters?.nivel) {
      queryBuilder.andWhere('routine.nivel = :nivel', { nivel: filters.nivel });
    }

    if (filters?.objetivo) {
      queryBuilder.andWhere('routine.objetivo = :objetivo', {
        objetivo: filters.objetivo,
      });
    }

    if (filters?.publico !== undefined) {
      queryBuilder.andWhere('routine.publico = :publico', {
        publico: filters.publico,
      });
    }

    if (filters?.activo !== undefined) {
      queryBuilder.andWhere('routine.activo = :activo', {
        activo: filters.activo,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    // Agregar cantidad de ejercicios a cada rutina
    const dataWithCount = data.map((routine) => ({
      ...routine,
      cantidadEjercicios: routine.ejercicios?.length || 0,
    }));

    return {
      data: dataWithCount as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id },
      relations: ['creador', 'ejercicios', 'ejercicios.exercise'],
      order: {
        ejercicios: {
          orden: 'ASC',
        },
      },
    });

    if (!routine) {
      throw new NotFoundException('Rutina no encontrada');
    }

    return routine;
  }

  async update(
    id: string,
    updateRoutineDto: UpdateRoutineDto,
  ): Promise<Routine> {
    const routine = await this.findOne(id);
    const { ejercicios, ...routineData } = updateRoutineDto;

    // Actualizar datos de la rutina
    Object.assign(routine, routineData);
    await this.routineRepository.save(routine);

    // Si se actualizan los ejercicios, eliminar los anteriores y crear nuevos
    if (ejercicios) {
      await this.routineExerciseRepository.delete({ routineId: id });

      if (ejercicios.length > 0) {
        const routineExercises = ejercicios.map((ejercicio) =>
          this.routineExerciseRepository.create({
            routineId: id,
            ...ejercicio,
          }),
        );

        await this.routineExerciseRepository.save(routineExercises);
      }
    }

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    // Soft delete
    routine.activo = false;
    await this.routineRepository.save(routine);
  }

  async toggleFavorite(routineId: string, userId: string): Promise<boolean> {
    // Verificar que la rutina existe
    await this.findOne(routineId);

    // Buscar si ya está en favoritos
    const existing = await this.favoriteRepository.findOne({
      where: {
        routineId,
        userId,
      },
    });

    if (existing) {
      // Quitar de favoritos
      await this.favoriteRepository.remove(existing);
      return false;
    } else {
      // Agregar a favoritos
      const favorite = this.favoriteRepository.create({
        routineId,
        userId,
      });
      await this.favoriteRepository.save(favorite);
      return true;
    }
  }

  async findUserFavorites(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Routine>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['routine', 'routine.creador', 'routine.ejercicios'],
      skip,
      take: limit,
    });

    const routines = favorites.map((fav) => fav.routine);
    const total = await this.favoriteRepository.count({ where: { userId } });

    return {
      data: routines,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async isFavorite(routineId: string, userId: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        routineId,
        userId,
      },
    });

    return !!favorite;
  }
}
