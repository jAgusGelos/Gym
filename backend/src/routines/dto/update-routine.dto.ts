import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoutineLevel, RoutineGoal } from '../entities/routine.entity';
import { RoutineExerciseDto } from './create-routine.dto';

export class UpdateRoutineDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(RoutineLevel)
  @IsOptional()
  nivel?: RoutineLevel;

  @IsEnum(RoutineGoal)
  @IsOptional()
  objetivo?: RoutineGoal;

  @IsNumber()
  @IsOptional()
  duracionEstimada?: number;

  @IsBoolean()
  @IsOptional()
  publico?: boolean;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineExerciseDto)
  @IsOptional()
  ejercicios?: RoutineExerciseDto[];
}
