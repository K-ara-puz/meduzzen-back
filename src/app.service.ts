import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async healthCheck(): Promise<string> {
    const result: string = `{ status_code: 200, detail: 'ok', result: 'working' }`;
    return result;
  }
}
