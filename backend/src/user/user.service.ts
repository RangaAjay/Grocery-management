import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.userRepository.signUp(createUserDto);
  }

  async signIn(createUserDto: CreateUserDto) {
    return await this.userRepository.signIn(createUserDto);
  }

  async findAllUser() {
    return await this.userRepository.getAllUsers();
  }

  async viewUser(email: string): Promise<User | null> {
    return await this.userRepository.getUserByEmail(email);
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.updateUser(email, updateUserDto);
  }

  async removeUser(email: string): Promise<{ affected?: number | null }> {
    return await this.userRepository.deleteUser(email);
  }
}
