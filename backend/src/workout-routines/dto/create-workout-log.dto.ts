import {
  IsUUID,
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateWorkoutLogDto {
  @IsUUID()
  routineExerciseId: string;

  @IsDateString()
  @IsOptional()
  fecha?: string; // Defaults to today in service

  @IsInt()
  @Min(1)
  seriesCompletadas: number;

  @IsString()
  @MaxLength(100)
  repeticionesRealizadas: string; // "12,10,10,8"

  @IsNumber()
  @IsOptional()
  @Min(0)
  pesoUtilizado?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  duracionMinutos?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  rpe?: number;

  @IsString()
  @IsOptional()
  notas?: string;
}
