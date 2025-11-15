import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { GoalType } from '../entities/user-goal.entity';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsEnum(GoalType)
  tipo: GoalType;

  @IsNotEmpty()
  @IsString()
  titulo: string;

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
  @IsNumber()
  pesoInicial?: number;

  @IsOptional()
  @IsNumber()
  grasaCorporalInicial?: number;

  @IsOptional()
  @IsNumber()
  masaMuscularInicial?: number;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsOptional()
  @IsDateString()
  fechaObjetivo?: string;
}
