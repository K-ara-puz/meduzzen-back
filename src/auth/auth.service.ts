import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async hashPass(pass: string): Promise<string> {
    return await bcrypt.hash(pass, 10);
  }
}
