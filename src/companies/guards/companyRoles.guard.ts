import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getUserFromToken } from '../../utils/getUserIdFromToken';
import CompanyMembersRepo from '../../companies-members/company-members.repository';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/companyRoles.decorator';

@Injectable()
export class CompanyRolesGuard {
  constructor(
    private companyMembersRepo: CompanyMembersRepo,
    private reflector: Reflector,
  ) {}
  async canActivate(context) {
    let companyId: string;
    let userId: string;
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;
    try {
      const request = context.switchToHttp().getRequest();
      const userFromToken = getUserFromToken(request.headers.authorization);
      userId = userFromToken.id;
      companyId = request.body.companyId;
      if (!companyId) {
        companyId = request.params.id
      }
      const companyMember = await this.companyMembersRepo.findOneByCompanyIdAndUserId(companyId, userId);
      if (!roles.includes(companyMember.role.toLowerCase())) {
        return false;
      }
      return true;
    } catch (error) {
      throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
    }
  }
}
