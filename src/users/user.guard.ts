import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { jwtDecode } from "jwt-decode";
import { User } from "../entities/user.entity";

@Injectable()
export class UserGuard {
  constructor(
  ) {}

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const userFromToken : Partial<User> = jwtDecode(token);
    const tempVar = request.originalUrl.split('/');
    const userToEditId = tempVar[tempVar.length - 1];

    if (userFromToken.id != userToEditId) 
      throw new HttpException(
        "You can edit only your profile",
        HttpStatus.FORBIDDEN,
      );
    
    return true
  }
}