import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { RoutineLevel, RoutineGoal } from '../entities/routine.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class RoutineFiltersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(RoutineLevel)
  nivel?: RoutineLevel;

  @IsOptional()
  @IsEnum(RoutineGoal)
  objetivo?: RoutineGoal;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  publico?: boolean;

  @IsOptional()
  userId?: string;

  @IsOptional()
  creadorId?: string;
}
