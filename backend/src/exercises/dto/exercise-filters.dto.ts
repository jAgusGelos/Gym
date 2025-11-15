import { IsOptional, IsEnum } from 'class-validator';
import { MuscleGroup, DifficultyLevel } from '../entities/exercise.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class ExerciseFiltersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(MuscleGroup)
  grupoMuscular?: MuscleGroup;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  nivelDificultad?: DifficultyLevel;
}
