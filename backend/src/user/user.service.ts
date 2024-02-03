import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';
import { TokenService } from './token.service';
import { RoleEnum } from 'types/common';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: TokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userInfo = await this.userRepository.signUp(createUserDto);
    return await this.authService.createRefreshAndAccessToken(
      userInfo.id,
      userInfo.role,
    );
  }

  async signIn(signInUserDto: SignInUserDto) {
    const userInfo = await this.userRepository.signIn(signInUserDto);
    return await this.authService.createRefreshAndAccessToken(
      userInfo.id,
      userInfo.role,
    );
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { id, refreshToken } = refreshTokenDto;
    const { role } = await this.authService.validateUser(+id, refreshToken);
    return this.authService.createRefreshAndAccessToken(id, role);
  }

  async findAllUser() {
    return await this.userRepository.getAllUsers();
  }

  async viewUser(id: number, user: User): Promise<User | null> {
    if (user.id !== id && user.role !== RoleEnum.ADMIN) {
      throw new UnauthorizedException();
    } else {
      return await this.userRepository.getUserById(id);
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, user: User) {
    if (
      (user.id !== id && user.role !== RoleEnum.ADMIN) ||
      ('role' in updateUserDto && user.role !== RoleEnum.ADMIN)
    ) {
      throw new UnauthorizedException();
    } else {
      return await this.userRepository.updateUser(id, updateUserDto);
    }
  }

  async removeUser(id: number) {
    return await this.userRepository.deleteUser(id);
  }
}
