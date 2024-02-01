import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  name: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
