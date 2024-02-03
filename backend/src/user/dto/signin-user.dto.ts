import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'ajay@gmail.com', required: true })
  email: string;
  @ApiProperty({ example: 'Ajay@123', required: true })
  password: string;
}
