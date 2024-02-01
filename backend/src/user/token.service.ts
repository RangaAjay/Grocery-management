import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(userId: number) {
    return this.jwtService.sign({ id: userId });
  }

  async createRefreshToken(userId: number) {
    const tokenId = 'uuid()';
    return this.jwtService.sign(
      { id: userId, tokenId: tokenId },
      { expiresIn: '7d' },
    );
  }

  async createRefreshAndAccessToken(userId: number) {
    const accessToken = await this.createAccessToken(userId);
    const refreshToken = await this.createRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  async validateUser(payload: any): Promise<any> {
    // Validate the user exists in your database, etc.
    return { id: payload.id };
  }
}
