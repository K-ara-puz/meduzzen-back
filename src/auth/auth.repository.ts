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
    return await this.authRepository.save(res);
  }

  async findOneByToken(token: string): Promise<User> {
    const auth = await this.authRepository.findOne({
      where: [{ accessToken: token }, { refreshToken: token }],
      select: {userId: {id: true}}
    });
    return auth.userId;
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
    return await this.authRepository.save({ id: auth.id, ...res });
  }

  async remove(token: string) {
    const auth = await this.authRepository.findOne({
      where: [{ accessToken: token }, { refreshToken: token }],
    });
    if (!auth) throw new Error('user is not exist');
    return await this.authRepository.delete({ id: auth.id });
  }
}