import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  qrCode: string;
}

export class ManualCheckInDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class CheckOutDto {
  @IsUUID()
  @IsNotEmpty()
  attendanceId: string;
}
