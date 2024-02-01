import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';
import { TokenService } from './token.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authService: TokenService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const userInfo = await this.userRepository.signUp(createUserDto);
    return await this.authService.createRefreshAndAccessToken(userInfo.id);
  }

  async signIn(signInUserDto: SignInUserDto) {
    const userInfo = await this.userRepository.signIn(signInUserDto);
    return await this.authService.createRefreshAndAccessToken(userInfo.id);
  }

  async findAllUser() {
    return await this.userRepository.getAllUsers();
  }

  async viewUser(id: number): Promise<User | null> {
    return await this.userRepository.getUserById(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.updateUser(id, updateUserDto);
  }

  async removeUser(id: number) {
    return await this.userRepository.deleteUser(id);
  }
}
