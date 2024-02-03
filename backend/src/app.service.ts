import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getRoot(res: Response): void {
    return res.redirect('/swagger');
  }
}
