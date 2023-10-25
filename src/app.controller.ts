import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { mainInterface } from './app.main.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async healthChecker(): Promise<mainInterface> {return this.appService.healthCheck()}
}
