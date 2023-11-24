import { Injectable } from '@nestjs/common';
import {JwksClient} from 'jwks-rsa'
import { JwtService } from '@nestjs/jwt';
import { jwtDecode } from 'jwt-decode';
import { ModuleRef } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
const jwt = new JwtService();
@Injectable()
export class MyAuthGuard {
  constructor(
    private moduleRef: ModuleRef,
  ) {}
  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    try {
      return await this.mainAuthGuard(token);
    } catch (error) {
      try {
        return await this.mainAuth0Guard(token);
      } catch(error) {
        return null
      }
    }
  }
  async mainAuthGuard(token) {
    const validated = jwt.verify(token, {publicKey: process.env.JWT_ACCESS_SECRET})
    return validated
  }
  async mainAuth0Guard(token) {
    const client = new JwksClient({
      jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      requestHeaders: {}, // Optional
      timeout: 1000 
    });
    const key = await client.getSigningKey(process.env.AUTH0_KID);
    const signingKey = key.getPublicKey();
    const userFromToken = jwtDecode(token);
    const userService = this.moduleRef.get(UsersService, { strict: false });
    const authService = this.moduleRef.get(AuthService, { strict: false });

    const user = await userService.findOneByEmail(userFromToken['email']);
    if (!user) {
      await authService.register({
        email: userFromToken['email'],
        password: 'null',
        firstName: userFromToken['email'],
        lastName: 'null'
      });
    }

    return jwt.verify(token, {publicKey: signingKey})
  }
}