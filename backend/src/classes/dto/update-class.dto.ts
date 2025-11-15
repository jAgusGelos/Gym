import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UpdateClassScheduleDto } from './class-schedule.dto';

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  cupoMaximo?: number;

  @Transform(({ value }) => value === '' || value === null ? null : value)
  @IsOptional()
  @IsString()
  imagenUrl?: string | null;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateClassScheduleDto)
  schedules?: UpdateClassScheduleDto[];
}
