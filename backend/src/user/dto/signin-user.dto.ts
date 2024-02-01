import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class SignInUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  name?: string;
  password: string;
}
