import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { AnnouncementType } from '../entities/announcement.entity';

export class UpdateAnnouncementDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  contenido?: string;

  @IsEnum(AnnouncementType)
  @IsOptional()
  tipo?: AnnouncementType;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;

  @IsDateString()
  @IsOptional()
  fechaPublicacion?: string;

  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
