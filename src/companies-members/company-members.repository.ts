import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CompanyMember } from '../entities/companyMember';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateCompaniesMemberDto } from './dto/create-companies-member.dto';

export default class CompanyMembersRepo {
  constructor(
    @InjectRepository(CompanyMember)
    private companyMembersRepository: Repository<CompanyMember>,
  ) {}

  async create(
    data: CreateCompaniesMemberDto,
  ): Promise<Partial<CompanyMember>> {
    try {
      return this.companyMembersRepository.save({
        company: { id: data.companyId },
        user: { id: data.userId },
        role: data.role,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async findAll(
    companyI: string,
  ): Promise<Partial<CompanyMember>[]> {
    const query =
      this.companyMembersRepository.createQueryBuilder('company_member');
    return await query
      .leftJoinAndSelect('company_member.company', 'company')
      .where('company_member.company = :company', { company: companyI })
      .getMany();
  }

  async findOneByCompanyIdAndUserId(
    companyI: string,
    userI: string,
  ): Promise<Partial<CompanyMember>> {
    const query =
      this.companyMembersRepository.createQueryBuilder('company_member');
    return await query
      .leftJoinAndSelect('company_member.company', 'company')
      .where('company_member.company = :company', { company: companyI })
      .andWhere('company_member.user = :user', { user: userI })
      .getOne();
  }

  async getCompanyOwner(companyI: string): Promise<string> {
    try {
      const queryBuilder =
        this.companyMembersRepository.createQueryBuilder('company_member');

      const { user: companyOwner } = await queryBuilder
        .leftJoinAndSelect('company_member.user', 'user')
        .where('company_member.company = :company', { company: companyI })
        .andWhere([{ role: 'Owner' }, { role: 'owner' }])
        .getOne();
      return companyOwner.id;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async delete(userId: string, companyId: string): Promise<DeleteResult> {
    try {
      const queryBuilder =
        this.companyMembersRepository.createQueryBuilder('company_member');
      return await queryBuilder
        .leftJoinAndSelect('company_member.user', 'user')
        .leftJoinAndSelect('company_member.company', 'company')
        .delete()
        .where({ user: { id: userId } })
        .andWhere({ company: { id: companyId } })
        .execute();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
