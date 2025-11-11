import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePreferenceDto {
  @IsString()
  @IsNotEmpty()
  planId: string;
}
