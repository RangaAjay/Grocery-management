import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'temp@xyz.com', required: true })
  @IsNotEmpty()
  @MinLength(4)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ajay Ranga', required: true })
  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  name: string;

  @ApiProperty({ example: 'StrongPassword@123', required: true })
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
