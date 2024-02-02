import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'types/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleGuard } from './role/role.guard';
import { Roles } from './roles/roles.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInUserDto: SignInUserDto) {
    return this.userService.signIn(signInUserDto);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard())
  refreshTokens(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  findAll() {
    return this.userService.findAllUser();
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.viewUser(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch(':id/role')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, { role: updateUserDto?.role });
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
