import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(userId: number, role: string) {
    return this.jwtService.sign({ id: userId, role, tokenType: 'access' });
  }

  async createRefreshToken(userId: number, role: string) {
    return this.jwtService.sign(
      { id: userId, role, tokenType: 'refresh' },
      { expiresIn: '7d' },
    );
  }

  async createRefreshAndAccessToken(userId: number, role: string) {
    const accessToken = await this.createAccessToken(userId, role);
    const refreshToken = await this.createRefreshToken(userId, role);
    return { accessToken, refreshToken };
  }

  async validateUser(id: number, token: string) {
    try {
      const tokenPayload = await this.jwtService.verify(token);
      console.log({ tokenPayload, id });
      if (id === tokenPayload.id) {
        return tokenPayload;
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException();
      }
    }
  }
}
