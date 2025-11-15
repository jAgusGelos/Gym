import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import {
  AchievementCategory,
  AchievementCriterio,
} from '../entities/achievement.entity';

export class CreateAchievementDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsString()
  icono: string;

  @IsNotEmpty()
  @IsEnum(AchievementCategory)
  categoria: AchievementCategory;

  @IsNotEmpty()
  @IsEnum(AchievementCriterio)
  criterio: AchievementCriterio;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  objetivo: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  puntos?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  orden?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
