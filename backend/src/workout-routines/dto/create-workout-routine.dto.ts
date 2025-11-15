import {
  IsString,
  IsEnum,
  IsUUID,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  WorkoutGoal,
  RoutineType,
  DifficultyLevel,
} from '../entities/workout-routine.entity';
import { CreateRoutineExerciseDto } from './create-routine-exercise.dto';

export class CreateWorkoutRoutineDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  descripcion: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsEnum(RoutineType)
  @IsOptional()
  tipo?: RoutineType;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  nivel?: DifficultyLevel;

  @IsInt()
  @Min(1)
  @Max(52)
  duracionSemanas: number;

  @IsInt()
  @Min(1)
  @Max(7)
  diasPorSemana: number;

  @IsEnum(WorkoutGoal)
  objetivo: WorkoutGoal;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineExerciseDto)
  exercises: CreateRoutineExerciseDto[];
}
