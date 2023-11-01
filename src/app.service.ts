import { Injectable, Logger } from '@nestjs/common';
import { mainInterface } from './app.main.interface';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async healthCheck(): Promise<mainInterface> {
    this.logger.log('healthCheck log')
    return {'status_code': 200, 'detail': 'ok', 'result': 'working'}
  }
}
