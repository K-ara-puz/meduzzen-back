import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompaniesMemberDto } from './dto/create-companies-member.dto';
import CompanyMembersRepo from './company-members.repository';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CompanyMember } from '../entities/companyMember';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';
import { EditCompanyMemberDto } from './dto/edit-company-member-role.dto';

@Injectable()
export class CompaniesMembersService {
  constructor(
    @InjectRepository(CompanyMember)
    private companyMemberRepository: Repository<CompanyMember>,
    private companyMembersRepo: CompanyMembersRepo,
  ) {}

  async getCompanyMembers(
    options: IPaginationOptions,
    companyId: string,
  ): Promise<generalResponse<PaginatedItems<CompanyMember[]>>> {
    try {
      const queryBuilder =
        this.companyMemberRepository.createQueryBuilder('company_members');
      queryBuilder
        .leftJoinAndSelect('company_members.company', 'company')
        .leftJoinAndSelect('company_members.user', 'user')
        .where('company_members.company = :company', { company: companyId })
        .getMany();
      const companyMembers = await paginate<CompanyMember>(
        queryBuilder,
        options,
      );
      return {
        status_code: HttpStatus.OK,
        detail: {
          items: companyMembers.items,
          totalItemsCount: companyMembers.meta.totalItems,
        },
        result: 'company members',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    userId: string,
    companyId: string,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    try {
      const companyMember =
        await this.companyMembersRepo.findOneByCompanyIdAndUserId(
          companyId,
          userId,
        );
      return {
        status_code: HttpStatus.OK,
        detail: companyMember,
        result: 'company member',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editRole(data: EditCompanyMemberDto) {
    try {
      const updatedMember = await this.companyMembersRepo.update(data);
      return {
        status_code: HttpStatus.OK,
        detail: updatedMember,
        result: 'updated company member',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createCompaniesMemberDto: CreateCompaniesMemberDto,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    try {
      const companyMember = await this.companyMembersRepo.create(
        createCompaniesMemberDto,
      );
      return {
        status_code: HttpStatus.OK,
        detail: companyMember,
        result: 'company member created',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUserFromCompany(
    userId: string,
    companyId: string,
  ): Promise<generalResponse<string>> {
    try {
      await this.companyMembersRepo.delete(userId, companyId);
      return {
        status_code: HttpStatus.OK,
        detail: 'ok',
        result: 'company member was deleted',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
