import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CompanyMembersRepo from '../../companies-members/company-members.repository';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../companies/decorators/companyRoles.decorator';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../entities/user.entity';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CompanyRolesGuard {
  constructor(
    private companyMembersRepo: CompanyMembersRepo,
    private reflector: Reflector,
    private userService: UsersService,
  ) {}
  async canActivate(context) {
    let companyId: string;
    let userId: string;
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return false;
    try {
      const request = context.switchToHttp().getRequest();
      const userFromToken = jwtDecode(
        request.headers.authorization.split(' ')[1],
      );
      let user: Partial<User> = await this.userService.findOneByEmail(
        userFromToken['email'],
      );
      if (!user) throw new HttpException('', 400);
      userId = user.id;
      companyId = request.body.companyId;
      if (!companyId) {
        companyId = request.params.id;
      }
      const companyMember =
        await this.companyMembersRepo.findOneByCompanyIdAndUserId(
          companyId,
          userId,
        );
      if (!roles.includes(companyMember.role)) {
        return false;
      }
      return true;
    } catch (error) {
      throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
    }
  }
}
