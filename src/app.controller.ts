import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { generalResponse } from './interfaces/generalResponse.interface';
import { MyLogger } from './logger/logger.service';
import { ApiTags } from '@nestjs/swagger';
import { MyAuthGuard } from './auth/auth.guard';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new MyLogger(AppController.name);

  @UseGuards(MyAuthGuard)
  @Get()
  async healthChecker(): Promise<generalResponse<string>> {
    this.logger.toLog({ message: 'App Controller health check' });
    return this.appService.healthCheck();
  }
}
