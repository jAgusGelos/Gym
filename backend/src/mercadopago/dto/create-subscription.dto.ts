import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { SubscriptionFrequency } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  planId: string;

  @IsNotEmpty()
  @IsEnum(SubscriptionFrequency)
  frequency: SubscriptionFrequency;

  @IsOptional()
  @IsDateString()
  startDate?: string;
}
