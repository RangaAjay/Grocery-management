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
import { SignInUserDto } from '../dto/signin-user.dto';

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

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create(createUserDto);
    try {
      return await user.save();
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(createUserDto: SignInUserDto) {
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

  getUserById(id: number) {
    return this.findOneByOrFail({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { name, email: newEmail, password, role } = updateUserDto;
    const user = await this.getUserById(id);
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

  async deleteUser(id: number) {
    const delRes = await this.delete(id);
    if (delRes.affected === 0) {
      throw new NotFoundException();
    }
    return { message: 'Success' };
  }
}
export default UserRepository;
