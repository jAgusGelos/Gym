import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  scheduleId: string;

  @IsDateString()
  @IsNotEmpty()
  classDate: string; // Fecha específica de la clase (YYYY-MM-DD)
}
