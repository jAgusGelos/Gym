import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsUUID()
  @IsNotEmpty()
  instructorId: string;

  @IsDateString()
  @IsNotEmpty()
  fechaHoraInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaHoraFin: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  cupoMaximo: number;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;
}
