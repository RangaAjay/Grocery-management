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
import { GetUser } from './Get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RoleGuard } from './role/role.guard';
import { Roles } from './roles/roles.decorator';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Auth User')
  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @ApiTags('Auth User')
  @Post('/signin')
  signIn(@Body(ValidationPipe) signInUserDto: SignInUserDto) {
    return this.userService.signIn(signInUserDto);
  }

  @ApiTags('Auth User')
  @Post('/refreshToken')
  @UseGuards(AuthGuard())
  refreshTokens(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @ApiTags('Auth Admin')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  @ApiTags('Auth User')
  @Get('/:id')
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.viewUser(id, user);
  }

  @ApiTags('Auth Admin')
  @Get('/:id/admin')
  @UseGuards(AuthGuard())
  findOneByAdmin(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.viewUser(id, user);
  }

  @ApiTags('Auth User')
  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @ApiTags('Auth Admin')
  @Patch(':id/admin')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @ApiTags('Auth Admin')
  @Patch(':id/role')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUser(id, { role: updateUserDto?.role }, user);
  }

  @ApiTags('Auth Admin')
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
