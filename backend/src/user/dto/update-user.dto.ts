import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { RoleEnum } from 'types/common';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum([RoleEnum.ADMIN, RoleEnum.USER], { message: 'Invalid Role' })
  role?: string;
}
