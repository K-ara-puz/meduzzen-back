import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompaniesMemberDto } from './dto/create-companies-member.dto';
import CompanyMembersRepo from './company-members.repository';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CompanyMember } from '../entities/companyMember';

@Injectable()
export class CompaniesMembersService {
  constructor(
    private companyMembersRepo: CompanyMembersRepo,
  ) {}

  async create(createCompaniesMemberDto: CreateCompaniesMemberDto): Promise<generalResponse<Partial<CompanyMember>>> {
    try {
      const companyMember = await this.companyMembersRepo.create(createCompaniesMemberDto);
      return {
        status_code: HttpStatus.OK,
        detail: companyMember,
        result: 'company member created',
      }
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
