import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getUserFromToken } from '../utils/getUserIdFromToken';
import CompanyRepo from './company.repository';
import CompanyMembersRepo from '../companies-members/company-members.repository';

@Injectable()
export class CompanyOwnerGuard {
  constructor(
    private companyRepo: CompanyRepo,
    private companyMembersRepo: CompanyMembersRepo,
  ) {}
  async canActivate(context) {
    let companyId: string;
    let userId: string;
    try {
      const request = context.switchToHttp().getRequest();
      const userFromToken = getUserFromToken(request.headers.authorization);
      userId = userFromToken.id;
      companyId = request.params.id;

      await this.companyRepo.findOne(companyId);
      const companyMember =
        await this.companyMembersRepo.findOneByCompanyIdAndUserId(
          companyId,
          userId,
        );

      if (companyMember && companyMember.role.toLowerCase() === 'owner') {
        return true;
      }
    } catch (error) {
      throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
    }
  }
}
