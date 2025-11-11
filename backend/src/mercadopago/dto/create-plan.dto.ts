import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { MembershipType } from '../../memberships/entities/membership.entity';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsEnum(MembershipType)
  @IsNotEmpty()
  tipo: MembershipType;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  duracionDias: number;

  @IsArray()
  @IsOptional()
  beneficios?: string[];

  @IsBoolean()
  @IsOptional()
  destacado?: boolean;

  @IsNumber()
  @IsOptional()
  orden?: number;
}
