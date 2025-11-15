import {
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID()
  @IsOptional()
  instructorId?: string;

  @IsDateString()
  @IsOptional()
  fechaHoraInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaHoraFin?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  cupoMaximo?: number;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
