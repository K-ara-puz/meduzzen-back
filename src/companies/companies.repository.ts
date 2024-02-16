import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Company } from '../entities/company';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompanyMember } from '../entities/companyMember';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CompanyRoles } from '../utils/constants';

export default class CompanyRepo {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(CompanyMember)
    private companyMembersRepository: Repository<CompanyMember>,
  ) {}

  async findOne(id: string): Promise<Partial<Company>> {
    return this.companyRepository.findOne({ where: { id } });
  }
  
  async findOneByName(name: string): Promise<Partial<Company>> {
    return this.companyRepository.findOne({ where: { name } });
  }

  async findAllUserCompanies(id: string, options: IPaginationOptions) {
    const qB =
      this.companyMembersRepository.createQueryBuilder('company_member');
    qB.innerJoinAndSelect('company_member.user', 'user')
      .innerJoinAndSelect('company_member.company', 'company')
      .where('user.id = :id', { id })
      .andWhere('company_member.role = :role', {role: CompanyRoles.owner})
      .getMany();

    return paginate<CompanyMember>(qB, options);
  }

  async getCompaniesWhereIMember(id: string, options: IPaginationOptions) {
    const qB =
      this.companyMembersRepository.createQueryBuilder('company_member');
    qB.innerJoinAndSelect('company_member.user', 'user')
      .innerJoinAndSelect('company_member.company', 'company')
      .where('user.id = :id', { id })
      .andWhere('company_member.role IN (:...roles)', {roles: [CompanyRoles.simpleUser, CompanyRoles.admin]})
      .getMany();

    return paginate<CompanyMember>(qB, options);
  }

  async create(companyData: CreateCompanyDto): Promise<Partial<Company>> {
    return this.companyRepository.save(companyData);
  }

  async update(
    id: string,
    companyData: Partial<CreateCompanyDto>,
  ): Promise<Partial<Company>> {
    return this.companyRepository.save({ id: id, ...companyData });
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.companyRepository.delete(id);
  }
}
