import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {JwksClient} from 'jwks-rsa'
import { JwtService } from '@nestjs/jwt';
import { jwtDecode } from 'jwt-decode';
import { ModuleRef } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
const jwt = new JwtService();
@Injectable()
export class MyAuthGuard {
  constructor(
    private moduleRef: ModuleRef,
  ) {}
  async canActivate(context) {
    let token: string;
    const request = context.switchToHttp().getRequest();
    token = request.headers.authorization.split(' ')[1];
    try {
    } catch (error) {
      throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
    }
    try {
      return await this.mainAuthGuard(token);
    } catch (error) {
      try {
        return await this.mainAuth0Guard(token, request);
      } catch(error) {
        return null
      }
    }
  }
  async mainAuthGuard(token: string) {
    const validated = jwt.verify(token, {publicKey: process.env.JWT_ACCESS_SECRET})
    return validated
  }
  async mainAuth0Guard(token: string, request) {
    const client = new JwksClient({
      jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      requestHeaders: {},
      timeout: 1000 
    });
    let signingKey: string;
    try {
      const key = await client.getSigningKey(process.env.AUTH0_KID);
      signingKey = key.getPublicKey();
      const userFromToken = jwtDecode(token);
      const userService = this.moduleRef.get(UsersService, { strict: false });
      const authService = this.moduleRef.get(AuthService, { strict: false });
      let user: Partial<User> = await userService.findOneByEmail(userFromToken['email']);
      if (!user) {
        const res = await authService.register({
          email: userFromToken['email'],
          password: 'null',
          firstName: userFromToken['email'],
          lastName: 'null'
        });
        user = res.detail
      }
      request.user = user;
      return jwt.verify(token, {publicKey: signingKey});

    } catch (error) {
      throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
    }
  }
}