import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { ModuleRef } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import AuthRepo from './auth.repository';
import { User } from '../entities/user.entity';
import { ITokens } from '../interfaces/Tokens.interface';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
    private authRepo: AuthRepo,
  ) {}

  private async hashPass(pass: string): Promise<string> {
    return await bcrypt.hash(pass, 10);
  }
  private async generateTokens(payload: Partial<User>): Promise<ITokens> {
    const accessToken = jwt.sign( payload, this.configService.get('JWT_ACCESS_SECRET'), { expiresIn: '24h' }, );
    const refreshToken = jwt.sign( payload, this.configService.get('JWT_REFRESH_SECRET'), { expiresIn: '7d' }, );
    return { accessToken, refreshToken };
  }
  private async saveTokens(userId: Partial<User>, tokens: ITokens): Promise<void> {
    await this.authRepo.create(userId, tokens);
  }

  async getHashPass(pass: string): Promise<string> {
    return await this.hashPass(pass);
  }

  async register(user: CreateUserDto): Promise<generalResponse<Partial<User>>> {
    try {
      const userService = this.moduleRef.get(UsersService, { strict: false });

      const hashPass = await this.hashPass(user.password);

      let modifiedUser = {
        ...user,
        password: hashPass,
      };

      let { detail: createdUser } = await userService.create(modifiedUser);
      const tokens = await this.generateTokens({...createdUser});
      await this.saveTokens({id: createdUser.id}, tokens);


      return { status_code: HttpStatus.CREATED, detail: {...createdUser, ...tokens}, result: 'user was registered' };

    } catch (error) {
      throw new HttpException( error, error.status || HttpStatus.INTERNAL_SERVER_ERROR, );
    }
  }

  async login(user: UpdateUserDto) {
    // console.log(user)
  }
}
