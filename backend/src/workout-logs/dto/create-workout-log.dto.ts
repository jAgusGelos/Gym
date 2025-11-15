import {
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExerciseSetDto } from './create-exercise-set.dto';

export class CreateWorkoutLogDto {
  @IsOptional()
  @IsUUID()
  routineId?: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duracionMinutos?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseSetDto)
  sets: CreateExerciseSetDto[];
}
