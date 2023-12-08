import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyMember } from '../entities/companyMember';
import { CreateCompaniesMemberDto } from './dto/create-companies-member.dto';

export default class CompanyMembersRepo {
  constructor(
    @InjectRepository(CompanyMember)
    private companyMembersRepository: Repository<CompanyMember>,
  ) {}

  async create(data: CreateCompaniesMemberDto): Promise<Partial<CompanyMember>>  {
    return this.companyMembersRepository.save(data);
  }

  async findOneByCompanyIdAndUserId(companyI: string, userI: string): Promise<Partial<CompanyMember>> {
    const query =
      this.companyMembersRepository.createQueryBuilder('company_member');

    return query
      .where({ userId: userI })
      .andWhere({ companyId: companyI })
      .getOne();
  }
}
