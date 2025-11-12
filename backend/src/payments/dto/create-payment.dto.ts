import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  IsEnum,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '../../memberships/entities/membership.entity';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsOptional()
  membershipId?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  monto: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  metodoPago: PaymentMethod;

  @IsString()
  @IsOptional()
  comprobante?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
