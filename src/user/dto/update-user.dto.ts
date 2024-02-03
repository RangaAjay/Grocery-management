import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RoleEnum } from 'types/common';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'USER', required: false })
  @IsEnum([RoleEnum.ADMIN, RoleEnum.USER], { message: 'Invalid Role' })
  role?: string;
}
