import { Body, Controller, Post, Get, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../entities/user.entity';
import { LoginUser } from './dto/loginUser.dto';
import { ITokens } from '../interfaces/Tokens.interface';
import { MyAuthGuard } from './auth.guard';
import { UserFromToken } from '../users/decorators/userFromToken.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @UseGuards(MyAuthGuard)
  async authMe(
    @UserFromToken() user: User,
  ): Promise<generalResponse<Partial<User>>> {
    return await this.authService.authMe(user.email);
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
  async logout(@UserFromToken() user: User): Promise<generalResponse<string>> {
    return await this.authService.logout(user.email);
  }

  @Post('/refreshToken')
  async refreshToken(
    @Body() token: string,
  ): Promise<generalResponse<Partial<ITokens>>> {
    return await this.authService.refreshTokens(token);
  }
}
