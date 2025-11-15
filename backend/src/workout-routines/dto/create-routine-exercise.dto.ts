import {
  IsUUID,
  IsString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateRoutineExerciseDto {
  @IsUUID()
  exerciseId: string;

  @IsString()
  @MaxLength(50)
  dia: string;

  @IsInt()
  @Min(0)
  orden: number;

  @IsInt()
  @Min(1)
  series: number;

  @IsString()
  @MaxLength(50)
  repeticiones: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  pesoSugerido?: number;

  @IsInt()
  @Min(0)
  descansoSegundos: number;

  @IsString()
  @IsOptional()
  notas?: string;
}
