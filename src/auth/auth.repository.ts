import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Auth } from "../entities/auth.entity";
import { ITokens } from "../interfaces/Tokens.interface";
import { User } from "../entities/user.entity";

export default class AuthRepo {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async create(userId: Partial<User>, tokens: ITokens) {
    let res = {
      userId: userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      created_at: '1999-01-08',
      deleted_at: '1999-01-08',
      updated_at: '1999-01-08'
    }
    return await this.authRepository.save(res);
  }

}