import { IsInt, IsString, IsUUID, IsBoolean, IsOptional, Min, Max, Matches } from 'class-validator';
import { DayOfWeek } from '../entities/class-schedule.entity';

export class CreateClassScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: DayOfWeek;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime debe estar en formato HH:mm',
  })
  startTime: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime debe estar en formato HH:mm',
  })
  endTime: string;

  @IsUUID()
  instructorId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateClassScheduleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: DayOfWeek;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime debe estar en formato HH:mm',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime debe estar en formato HH:mm',
  })
  endTime?: string;

  @IsOptional()
  @IsUUID()
  instructorId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
