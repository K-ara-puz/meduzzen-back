import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class UserGuard {
  constructor(
    private userService: UsersService
  ) {}

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const userEmail = request.user.email;
    const user = await this.userService.findOneByEmail(userEmail);
    const tempVar = request.originalUrl.split('/');
    const userToEditId = tempVar[tempVar.length - 1];

    if (!user || user.id != userToEditId) 
      throw new HttpException(
        "FORBIDDEN RESOURCE",
        HttpStatus.FORBIDDEN,
      );
    
    return true
  }
}