import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import UserRepository from './repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt').jwtSecret,
    });
  }

  async validate(payload: { id: number; role: string; tokenType: string }) {
    const { id, tokenType } = payload;
    const user = await this.userRepository.getUserById(id);

    if (user && user.id === id && tokenType === 'access') {
      return {
        id: user.id,
        role: user.role,
      };
    }
    throw new UnauthorizedException();
  }
}
