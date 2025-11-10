import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';
import {
  ExerciseCategory,
  DifficultyLevel,
  MuscleGroup,
} from '../entities/exercise.entity';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;

  @IsEnum(ExerciseCategory)
  @IsNotEmpty()
  categoria: ExerciseCategory;

  @IsEnum(DifficultyLevel)
  @IsNotEmpty()
  nivelDificultad: DifficultyLevel;

  @IsArray()
  @IsEnum(MuscleGroup, { each: true })
  @IsNotEmpty()
  grupoMuscular: MuscleGroup[];

  @IsString()
  @IsOptional()
  instrucciones?: string;
}
