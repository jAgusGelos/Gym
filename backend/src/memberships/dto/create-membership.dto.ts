import {
  IsNotEmpty,
  IsUUID,
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

export class CreateMembershipDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(MembershipType)
  @IsNotEmpty()
  tipo: MembershipType;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  metodoPago?: PaymentMethod;

  @IsString()
  @IsOptional()
  notas?: string;
}
