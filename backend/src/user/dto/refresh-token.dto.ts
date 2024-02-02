import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
