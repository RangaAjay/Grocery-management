import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: "User's refresh Token", required: true })
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  refreshToken: string;

  @ApiProperty({ example: "User's Id from Get Profile", required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
