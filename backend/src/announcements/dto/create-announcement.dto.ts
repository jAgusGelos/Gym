import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { AnnouncementType } from '../entities/announcement.entity';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsEnum(AnnouncementType)
  @IsNotEmpty()
  tipo: AnnouncementType;

  @IsUrl()
  @IsOptional()
  imagenUrl?: string;

  @IsDateString()
  @IsNotEmpty()
  fechaPublicacion: string;

  @IsDateString()
  @IsOptional()
  fechaExpiracion?: string;
}
