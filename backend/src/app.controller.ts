import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('CheckApp')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: '2XX',
    description: 'Server is running',
  })
  @ApiResponse({ status: '5XX', description: 'App Not working' })
  @Get()
  getRoot(): string {
    return this.appService.getRoot();
  }
}
