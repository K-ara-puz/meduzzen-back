import { Injectable } from '@nestjs/common';
import {JwksClient} from 'jwks-rsa'
import { JwtService } from '@nestjs/jwt';
const jwt = new JwtService();
@Injectable()
export class MyAuthGuard {
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
    const validated = jwt.verify(token, {publicKey: "QkGKXyq4Kntqtcmu7IBLB3C6rfCgB2uu"})
    return validated
  }
  async mainAuth0Guard(token) {
    const client = new JwksClient({
      jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      requestHeaders: {}, // Optional
      timeout: 1000 
    });
    const key = await client.getSigningKey('NxQRKIQHHVgV2KVqHE4vq');
    const signingKey = key.getPublicKey();
    return jwt.verify(token, {publicKey: signingKey})
  }
}