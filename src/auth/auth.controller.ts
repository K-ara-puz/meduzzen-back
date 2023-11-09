import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('/registration')
  async register(
    @Body() user: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<generalResponse<Partial<User>>> {
    try {
      let { detail: details } = await this.authService.register(user);
      response.cookie('refreshToken', details['refreshToken'], {
        expires: new Date(new Date().getTime() + 6048 * 100000),
        sameSite: 'strict',
        httpOnly: true,
      });
      delete details['refreshToken'];

      return {
        status_code: 200,
        detail: { ...details },
        result: 'user was created',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/login')
  async loginUser(@Body() userData: UpdateUserDto) {
    return await this.authService.login(userData)
  }
}
