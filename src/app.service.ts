import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { generalResponse } from './interfaces/generalResponse.interface';
import { MyLogger } from './logger/logger.service';

@Injectable()
export class AppService {
  private readonly logger = new MyLogger(AppService.name);

  async healthCheck(): Promise<generalResponse> {
    this.logger.toLog({message: 'healthCheck Log'})
    return {'status_code': HttpStatus.OK, 'detail': 'ok', 'result': 'working'}
  }
}
