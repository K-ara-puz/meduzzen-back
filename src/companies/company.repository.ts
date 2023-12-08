import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Company } from '../entities/company';
import { CreateCompanyDto } from './dto/create-company.dto';

export default class CompanyRepo {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async findOne(id: string): Promise<Partial<Company>> {
    return this.companyRepository.findOne({ where: { id } });
  }

  async create(companyData: CreateCompanyDto): Promise<Partial<Company>> {
    return this.companyRepository.save(companyData);
  }

  async update(id: string, companyData: Partial<CreateCompanyDto>): Promise<Partial<Company>> {
    return this.companyRepository.save({id: id, ...companyData});
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.companyRepository.delete(id);
  }
}