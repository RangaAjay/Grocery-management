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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Auth User')
  @ApiOkResponse({
    description: 'Access and Refresh Token Corresponding to user',
  })
  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @ApiTags('Auth User')
  @ApiOkResponse({
    description: 'Access and Refresh Token Corresponding to user',
  })
  @Post('/signin')
  signIn(@Body(ValidationPipe) signInUserDto: SignInUserDto) {
    return this.userService.signIn(signInUserDto);
  }

  @ApiTags('Auth User')
  @Post('/refreshToken')
  @ApiOkResponse({
    description: 'Access and Refresh Token Corresponding to user',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  refreshTokens(@Body(ValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return this.userService.refreshToken(refreshTokenDto);
  }

  @ApiTags('Auth Admin')
  @Roles(RoleEnum.ADMIN)
  @ApiOkResponse({
    description: 'List of all Users',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  @ApiTags('Auth User')
  @Get('/me')
  @ApiOkResponse({
    description: "Current User's Profile",
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  findOne(@GetUser() user: User) {
    return this.userService.getMyProfile(user);
  }

  @ApiTags('Auth Admin')
  @Get('/:id/admin')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Any User Profile',
  })
  @UseGuards(AuthGuard())
  findOneByAdmin(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.viewUser(id, user);
  }

  @ApiTags('Auth User')
  @Patch('/me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  update(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUser(user.id, updateUserDto, user);
  }

  @ApiTags('Auth User')
  @Patch('/make-admin-temp')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  makeAdmin(
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUser(
      user.id,
      { role: RoleEnum.ADMIN },
      user,
      true,
    );
  }

  @ApiTags('Auth Admin')
  @Patch(':id/admin')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @ApiTags('Auth Admin')
  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AuthGuard(), RoleGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
