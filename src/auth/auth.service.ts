import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private async hashPass(pass: string): Promise<string> {
    return await bcrypt.hash(pass, 10);
  }
  async getHashPass(pass: string): Promise<string> {
    return await this.hashPass(pass);
  }
}
