import {
  IsEnum,
  IsDateString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  MembershipType,
  MembershipStatus,
  PaymentMethod,
} from '../entities/membership.entity';

export class UpdateMembershipDto {
  @IsEnum(MembershipType)
  @IsOptional()
  tipo?: MembershipType;

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsEnum(MembershipStatus)
  @IsOptional()
  estado?: MembershipStatus;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  metodoPago?: PaymentMethod;

  @IsString()
  @IsOptional()
  notas?: string;
}
