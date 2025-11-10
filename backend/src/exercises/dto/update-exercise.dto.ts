import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import {
  ExerciseCategory,
  DifficultyLevel,
  MuscleGroup,
} from '../entities/exercise.entity';

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;

  @IsEnum(ExerciseCategory)
  @IsOptional()
  categoria?: ExerciseCategory;

  @IsEnum(DifficultyLevel)
  @IsOptional()
  nivelDificultad?: DifficultyLevel;

  @IsArray()
  @IsEnum(MuscleGroup, { each: true })
  @IsOptional()
  grupoMuscular?: MuscleGroup[];

  @IsString()
  @IsOptional()
  instrucciones?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
