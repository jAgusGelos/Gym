import { IsString, IsEnum, IsOptional, IsUrl, MaxLength } from 'class-validator';
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

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;
}
