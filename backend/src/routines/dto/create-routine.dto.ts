import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoutineLevel, RoutineGoal } from '../entities/routine.entity';

export class RoutineExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseId: string;

  @IsNumber()
  @IsNotEmpty()
  orden: number;

  @IsNumber()
  @IsNotEmpty()
  series: number;

  @IsString()
  @IsNotEmpty()
  repeticiones: string;

  @IsNumber()
  @IsNotEmpty()
  descanso: number;

  @IsString()
  @IsOptional()
  notas?: string;
}

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(RoutineLevel)
  @IsNotEmpty()
  nivel: RoutineLevel;

  @IsEnum(RoutineGoal)
  @IsNotEmpty()
  objetivo: RoutineGoal;

  @IsNumber()
  @IsOptional()
  duracionEstimada?: number;

  @IsBoolean()
  @IsOptional()
  publico?: boolean;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineExerciseDto)
  @IsNotEmpty()
  ejercicios: RoutineExerciseDto[];
}
