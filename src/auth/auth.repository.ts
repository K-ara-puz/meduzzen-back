import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { ITokens } from '../interfaces/Tokens.interface';
import { User } from '../entities/user.entity';

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
      actionToken: tokens.actionToken,
    };
    return this.authRepository.save(res);
  }

  async update(userId: Partial<User>, tokens: ITokens) {
    let res = {
      accessToken: tokens.accessToken,
      actionToken: tokens.actionToken,
      refreshToken: tokens.refreshToken,
    };
    const auth = await this.authRepository.findOne({
      where: { userId: { id: userId.id } },
    });
    if (!auth) {
      const {accessToken, actionToken, refreshToken, id} = await this.create(userId, tokens)
      return {accessToken, actionToken, refreshToken, id}
    }
    return this.authRepository.save({ id: auth.id, ...res });
  }

  async remove(userId: string) {
    const auth = await this.authRepository.findOne({
      where: { userId: { id: userId } },
    });
    if (!auth) throw new Error('user is not exist');
    return this.authRepository.delete({ id: auth.id });
  }
}