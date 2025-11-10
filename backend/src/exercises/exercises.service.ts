import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import {
  Exercise,
  ExerciseCategory,
  DifficultyLevel,
  MuscleGroup,
} from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

export interface ExerciseFilters {
  search?: string;
  categoria?: ExerciseCategory;
  nivelDificultad?: DifficultyLevel;
  grupoMuscular?: MuscleGroup;
  activo?: boolean;
}

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto);
    return await this.exerciseRepository.save(exercise);
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: ExerciseFilters,
  ): Promise<PaginatedResult<Exercise>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.exerciseRepository
      .createQueryBuilder('exercise')
      .skip(skip)
      .take(limit)
      .orderBy('exercise.nombre', 'ASC');

    // Aplicar filtros
    if (filters?.search) {
      queryBuilder.andWhere(
        '(exercise.nombre ILIKE :search OR exercise.descripcion ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters?.categoria) {
      queryBuilder.andWhere('exercise.categoria = :categoria', {
        categoria: filters.categoria,
      });
    }

    if (filters?.nivelDificultad) {
      queryBuilder.andWhere('exercise.nivelDificultad = :nivel', {
        nivel: filters.nivelDificultad,
      });
    }

    if (filters?.grupoMuscular) {
      queryBuilder.andWhere(':grupo = ANY(exercise.grupoMuscular)', {
        grupo: filters.grupoMuscular,
      });
    }

    if (filters?.activo !== undefined) {
      queryBuilder.andWhere('exercise.activo = :activo', {
        activo: filters.activo,
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

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
    });

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    return exercise;
  }

  async update(
    id: string,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.findOne(id);
    Object.assign(exercise, updateExerciseDto);
    return await this.exerciseRepository.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    // Soft delete
    exercise.activo = false;
    await this.exerciseRepository.save(exercise);
  }
}
