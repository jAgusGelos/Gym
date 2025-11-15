import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { MuscleGroup, DifficultyLevel } from '../entities/exercise.entity';

export class CreateExerciseDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  descripcion: string;

  @IsEnum(MuscleGroup)
  grupoMuscular: MuscleGroup;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  equipamiento?: string;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  nivelDificultad?: DifficultyLevel;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  imagenUrl?: string;

  @IsBoolean()
  @IsOptional()
  trackeaPeso?: boolean;
}
