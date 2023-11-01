import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { mainInterface } from './app.main.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  // Http code works on local , but not working in Docker. need to figure it out
  @HttpCode(200)
  @Get()
  async healthChecker(): Promise<mainInterface> {
    this.logger.log('App Controller health check')
    return this.appService.healthCheck()
  }
}
