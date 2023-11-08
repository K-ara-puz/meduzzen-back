import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MyLogger } from './logger/logger.service';
import { generalResponse } from './interfaces/generalResponse.interface';

@Injectable()
export class AppService {
  private readonly logger = new MyLogger(AppService.name);

  async healthCheck(): Promise<generalResponse<string>> {
    this.logger.toLog({message: 'healthCheck Log'})
    return {'status_code': HttpStatus.OK, 'detail': 'ok', 'result': 'working'}
  }
}
