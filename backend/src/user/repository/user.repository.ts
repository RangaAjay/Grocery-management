import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
  ) {
    super(
      authRepository.target,
      authRepository.manager,
      authRepository.queryRunner,
    );
  }

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const user = this.create(createUserDto);
    try {
      await user.save();
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`No User exists with email ${email}`);
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException("Password didn't match");
    }
    return user;
  }

  getAllUsers(options?: FindManyOptions<User>): Promise<User[]> {
    return this.find(options);
  }

  getUserByEmail(email: string) {
    return this.findOneByOrFail({ email });
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    const { name, email: newEmail, password, role } = updateUserDto;
    const user = await this.getUserByEmail(email);
    if (name) {
      user.name = name;
    }
    if (newEmail) {
      user.email = newEmail;
    }
    if (password) {
      user.password = password;
    }
    if (role) {
      user.role = role;
    }
    return await user.save();
  }

  async deleteUser(email: string) {
    const user = await this.findOneBy({ email });
    if (user?.id) {
      return await this.delete(user?.id);
    }
    throw new NotFoundException("User Don't exists");
  }
}
export default UserRepository;
