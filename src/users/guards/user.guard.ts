import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { getUserFromToken } from "../../utils/getUserIdFromToken";

@Injectable()
export class UserGuard {
  constructor(
  ) {}

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const userFromToken = getUserFromToken(request.headers['authorization']);
    const tempVar = request.originalUrl.split('/');
    const userToEditId = tempVar[tempVar.length - 1];

    if (userFromToken.id != userToEditId) 
      throw new HttpException(
        "FORBIDDEN RESOURCE",
        HttpStatus.FORBIDDEN,
      );
    
    return true
  }
}