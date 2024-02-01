import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return `Server is Running on Port ${process.env.PORT ?? 3000}`;
  }
}
