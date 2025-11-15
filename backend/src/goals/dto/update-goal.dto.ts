import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { GoalType, GoalStatus } from '../entities/user-goal.entity';

export class UpdateGoalDto {
  @IsOptional()
  @IsEnum(GoalType)
  tipo?: GoalType;

  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  pesoObjetivo?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  grasaCorporalObjetivo?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  masaMuscularObjetivo?: number;

  @IsOptional()
  @IsDateString()
  fechaObjetivo?: string;

  @IsOptional()
  @IsEnum(GoalStatus)
  estado?: GoalStatus;
}
