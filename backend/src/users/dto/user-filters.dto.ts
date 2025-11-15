import { IsOptional, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class UserFiltersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(UserRole)
  rol?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  estado?: UserStatus;
}
