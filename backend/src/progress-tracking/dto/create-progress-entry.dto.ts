import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export class CreateProgressEntryDto {
  @IsDateString()
  fecha: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(500)
  peso?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  grasaCorporal?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(300)
  masaMuscular?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(300)
  pecho?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(300)
  cintura?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(300)
  caderas?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  brazoIzquierdo?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  brazoDerecho?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(200)
  piernaIzquierda?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(200)
  piernaDerecha?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fotos?: string[];

  @IsString()
  @IsOptional()
  notas?: string;
}
