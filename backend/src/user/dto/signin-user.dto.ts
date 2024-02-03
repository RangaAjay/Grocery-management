import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'temp@xyz.com', required: true })
  email: string;
  @ApiProperty({ example: 'StrongPassword@123', required: true })
  password: string;
}
