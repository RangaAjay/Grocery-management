import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.signIn(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  @Get('/:email')
  findOne(@Param('email') email: string) {
    return this.userService.viewUser(email);
  }

  @Patch(':email')
  update(
    @Param('email') email: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(email, updateUserDto);
  }

  @Patch(':email/role')
  updateRole(
    @Param('email') email: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(email, { role: updateUserDto?.role });
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.userService.removeUser(email);
  }
}
