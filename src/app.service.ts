import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async healthCheck(): Promise<string> {
    interface objTypes {
      status_code: number;
      detail: string;
      result: string;
    }
    const obj: objTypes = { status_code: 200, detail: 'ok', result: 'working' };
    return JSON.stringify(obj);
  }
}
