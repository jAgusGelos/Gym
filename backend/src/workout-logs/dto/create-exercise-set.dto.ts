import {
  IsNotEmpty,
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExerciseSetDto {
  @IsNotEmpty()
  @IsUUID()
  exerciseId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  setNumber: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  peso: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  repeticiones: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  rir?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  tiempoDescansoSegundos?: number;

  @IsOptional()
  @IsString()
  notas?: string;
}
