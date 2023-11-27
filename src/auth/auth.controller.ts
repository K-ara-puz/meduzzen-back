import { Body, Controller, Post, Get, Put, Req, Request, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../entities/user.entity';
import { LoginUser } from './dto/loginUser.dto';
import { ITokens } from '../interfaces/Tokens.interface';
import { MyAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(MyAuthGuard)
  @Get('/me')
  async authMe(@Req() req: Request): Promise<generalResponse<Partial<User>>> {
    return await this.authService.authMe(req.headers['authorization']);
  }

  @Post('/registration')
  async register(
    @Body() user: CreateUserDto,
  ): Promise<generalResponse<Partial<User>>> {
    return await this.authService.register(user);
  }

  @Put('/login')
  async login(
    @Body() userData: LoginUser,
  ): Promise<generalResponse<Partial<User>>> {
    return await this.authService.login(userData);
  }

  @Put('/logout')
  async logout(@Req() req: Request): Promise<generalResponse<string>> {
    return await this.authService.logout(req.headers['authorization']);
  }
  
  @Post('/refreshToken')
  async refreshToken(@Body() token: string): Promise<generalResponse<Partial<ITokens>>> {
    return await this.authService.refreshTokens(token);
  }
}