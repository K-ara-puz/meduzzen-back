import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { generalResponse } from './interfaces/generalResponse.interface';
import { MyLogger } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new MyLogger(AppController.name);

  @Get()
  async healthChecker(): Promise<generalResponse> {
    this.logger.toLog({ message: 'App Controller health check' });
    return this.appService.healthCheck();
  }
}
