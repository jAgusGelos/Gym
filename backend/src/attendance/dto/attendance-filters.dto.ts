import { IsOptional, IsDateString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class AttendanceFiltersDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
