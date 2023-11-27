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
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
    private authRepo: AuthRepo,
  ) {}

  private async hashPass(pass: string): Promise<string> {
    try {
      return bcrypt.hash(pass, 10);
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
        { expiresIn: '30m' },
      );
      const refreshToken: string = jwt.sign(
        payload,
        this.configService.get('JWT_REFRESH_SECRET'),
        { expiresIn: '1d' },
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
      return this.authRepo.create(userId, tokens);
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
      return this.authRepo.update(userId, tokens);
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
      return this.hashPass(pass);
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
      await this.saveTokens({ id: createdUser['id'] }, tokens);
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
      const savedTokens = await this.updateTokens({ id: user['id'] }, tokens);
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
    const userService = this.moduleRef.get(UsersService, { strict: false });
    const modifiedToken = token.toString().split(' ');
    const userFromToken = jwtDecode(modifiedToken[1]);
    try {
      const user = await userService.findOneByEmail(userFromToken['email']);
      if (!user) {
        throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);
      }
      await this.authRepo.remove(user.id);
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
      const modifiedToken = token.toString().split(' ');
      const userFromToken = jwtDecode(modifiedToken[1]);
      const userService = this.moduleRef.get(UsersService, { strict: false });
      const user = await userService.findOneByEmail(userFromToken['email']);
      if (!user) {
        throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);
      }
      const { password, ...userForBack } = user;
      return {
        status_code: HttpStatus.OK,
        detail: userForBack,
        result: 'auth me',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshTokens(
    token: string,
  ): Promise<generalResponse<Partial<ITokens>>> {
    try {
      const userService = this.moduleRef.get(UsersService, { strict: false });
      const userData = jwt.decode(token['token']);
      const user = await userService.findOneByEmail(userData['email']);
      if (!user) {
        throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);
      }
      const tokens = await this.generateTokens({ ...user });
      await this.updateTokens({ id: user['id'] }, tokens);

      return {
        status_code: HttpStatus.OK,
        detail: tokens,
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
