import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateClassScheduleDto } from './class-schedule.dto';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  cupoMaximo: number;

  @Transform(({ value }) => value === '' || value === null ? null : value)
  @IsOptional()
  @IsString()
  imagenUrl?: string | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassScheduleDto)
  schedules: CreateClassScheduleDto[];
}
