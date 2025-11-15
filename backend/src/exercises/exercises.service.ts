import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Exercise,
  MuscleGroup,
  DifficultyLevel,
} from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';

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
    page: number = 1,
    limit: number = 20,
    grupoMuscular?: MuscleGroup,
    nivelDificultad?: DifficultyLevel,
  ): Promise<PaginatedResult<Exercise>> {
    const query = this.exerciseRepository.createQueryBuilder('exercise');

    if (grupoMuscular) {
      query.andWhere('exercise.grupoMuscular = :grupoMuscular', {
        grupoMuscular,
      });
    }

    if (nivelDificultad) {
      query.andWhere('exercise.nivelDificultad = :nivelDificultad', {
        nivelDificultad,
      });
    }

    query.orderBy('exercise.nombre', 'ASC');

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({ where: { id } });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
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
    await this.exerciseRepository.remove(exercise);
  }

  async searchByName(searchTerm: string): Promise<Exercise[]> {
    return await this.exerciseRepository
      .createQueryBuilder('exercise')
      .where('exercise.nombre ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orderBy('exercise.nombre', 'ASC')
      .getMany();
  }
}
