import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class ParseTokenMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.toString().split(' ');
      const user: Partial<User> = jwtDecode(token[1]);
      req['user'] = user
      if (!user) return
      if (!user.id) {
        const foundedUser = await this.usersService.findOneByEmail(user.email);
        req['user'] = foundedUser
      }
      next();
    } catch (error) {
      next()
    }
  }
}
