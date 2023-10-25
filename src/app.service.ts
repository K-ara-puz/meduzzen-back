import { Injectable } from '@nestjs/common';
import { mainInterface } from './app.main.interface';

@Injectable()
export class AppService {
  async healthCheck(): Promise<mainInterface> {return {'status_code': 200, 'detail': 'ok', 'result': 'working'}}
}
