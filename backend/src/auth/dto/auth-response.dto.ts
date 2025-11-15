import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class AuthResponseDto {
  user: Partial<User>;
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
