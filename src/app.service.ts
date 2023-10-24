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
    const promise: Promise<string> = new Promise((resolve) => {
      setTimeout(() => {
        const res: string = JSON.stringify(obj);
        resolve(res);
      }, 1000);
    });
    return promise;
  }
}
