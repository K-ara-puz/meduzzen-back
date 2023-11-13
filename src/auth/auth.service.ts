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
import { LoginUser } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
    private authRepo: AuthRepo,
  ) {}

  private async hashPass(pass: string): Promise<string> {
    try {
      return await bcrypt.hash(pass, 10);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private async generateTokens(payload: Partial<User>): Promise<ITokens> {
    try {
      const actionToken: string = jwt.sign(
        payload,
        this.configService.get('JWT_ACTION_SECRET'),
        { expiresIn: '30m' },
      );
      const accessToken: string = jwt.sign(
        payload,
        this.configService.get('JWT_ACCESS_SECRET'),
        { expiresIn: '1d' },
      );
      const refreshToken: string = jwt.sign(
        payload,
        this.configService.get('JWT_REFRESH_SECRET'),
        { expiresIn: '7d' },
      );
      return { accessToken, actionToken, refreshToken };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private async saveTokens(
    userId: Partial<User>,
    tokens: ITokens,
  ): Promise<Partial<User>> {
    try {
      return await this.authRepo.create(userId, tokens);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private async updateTokens(
    userId: Partial<User>,
    tokens: ITokens,
  ): Promise<Partial<User>> {
    try {
      return await this.authRepo.update(userId, tokens);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async comparePass(pass1: string, pass2: string): Promise<boolean> {
    try {
      return await bcrypt.compare(pass1, pass2);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHashPass(pass: string): Promise<string> {
    try {
      return await this.hashPass(pass);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      const tokens = await this.generateTokens({ ...createdUser });
      await this.saveTokens({ id: createdUser.id }, tokens);
      return {
        status_code: HttpStatus.CREATED,
        detail: { ...createdUser, ...tokens },
        result: 'user was registered',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(userData: LoginUser): Promise<generalResponse<Partial<User>>> {
    try {
      const userService = this.moduleRef.get(UsersService, { strict: false });

      const user = await userService.findOneByEmail(userData.email);
      if (!user)
        throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);

      const isPassEquals = await this.comparePass(
        userData.password,
        user.password,
      );
      if (!isPassEquals)
        throw new HttpException('incorrect pass', HttpStatus.BAD_REQUEST);

      const tokens = await this.generateTokens(userData);
      const savedTokens = await this.updateTokens({ id: user.id }, tokens);
      const { password, ...userForBack } = user;

      return {
        status_code: HttpStatus.OK,
        detail: { ...userForBack, ...savedTokens },
        result: 'login success',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(token: ITokens): Promise<generalResponse<string>> {
    try {
      // get tokens from headers
      const modifiedToken = token.toString().split(' ');
      await this.authRepo.remove(modifiedToken[1]);

      return {
        status_code: HttpStatus.OK,
        detail: 'logout success',
        result: 'logout success',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authMe(token: ITokens): Promise<generalResponse<Partial<User>>> {
    try {
      // get tokens from headers
      const modifiedToken = token.toString().split(' ');
      const { password, ...user } = await this.authRepo.findOneByToken(
        modifiedToken[1],
      );
      return {
        status_code: HttpStatus.OK,
        detail: user,
        result: 'auth me',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshTokens(userId: string): Promise<generalResponse<string>> {
    try {
      const userService = this.moduleRef.get(UsersService, { strict: false });

      const { detail } = await userService.findOne(userId);
      if (!detail)
        throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);

      const tokens = await this.generateTokens(detail);
      await this.updateTokens({ id: detail.id }, tokens);

      return {
        status_code: HttpStatus.OK,
        detail: 'tokens updated',
        result: 'refresh tokens success',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
