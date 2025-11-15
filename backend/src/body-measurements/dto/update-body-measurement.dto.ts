import { PartialType } from '@nestjs/mapped-types';
import { CreateBodyMeasurementDto } from './create-body-measurement.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBodyMeasurementDto extends PartialType(
  CreateBodyMeasurementDto,
) {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  bmi?: number;
}
