import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBodyMeasurementDto {
  @IsDateString()
  @IsNotEmpty()
  measurementDate: string;

  // Medidas básicas
  @IsNumber()
  @Min(20)
  @Max(500)
  @Type(() => Number)
  weight: number; // kg

  @IsNumber()
  @Min(50)
  @Max(300)
  @Type(() => Number)
  height: number; // cm

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  bodyFatPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  muscleMassPercentage?: number;

  // Medidas corporales en cm
  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  neck?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(200)
  @Type(() => Number)
  shoulders?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(200)
  @Type(() => Number)
  chest?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(200)
  @Type(() => Number)
  waist?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(200)
  @Type(() => Number)
  hips?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  leftBicep?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  rightBicep?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  leftForearm?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  rightForearm?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(150)
  @Type(() => Number)
  leftThigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(150)
  @Type(() => Number)
  rightThigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  leftCalf?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100)
  @Type(() => Number)
  rightCalf?: number;

  // Fotos
  @IsOptional()
  @IsString()
  frontPhoto?: string;

  @IsOptional()
  @IsString()
  sidePhoto?: string;

  @IsOptional()
  @IsString()
  backPhoto?: string;

  // Notas
  @IsOptional()
  @IsString()
  notes?: string;
}
