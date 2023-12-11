import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CompanyInviteRepo from './companies_invites.repository';

@Injectable()
export class CompaniesInvitesService {
  constructor(
    private inviteRepo: CompanyInviteRepo,
  ) {}

  async create(inviteData) {
    console.log('dddddddsss', inviteData);
    // check user role in company
    // if 
    try {
      const res = await this.inviteRepo.create(inviteData);
      console.log(res, "TTTT")
      return {
        status_code: HttpStatus.OK,
        detail: res,
        result: 'get company',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
