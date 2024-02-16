import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyRoleDto } from './dto/create-companies-roles.dto';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CompanyMember } from '../entities/companyMember';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyRoles } from '../utils/constants';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';

@Injectable()
export class CompaniesRolesService {
  constructor(
    @InjectRepository(CompanyMember)
    private companyMemberRepository: Repository<CompanyMember>,
    private companyMembersService: CompaniesMembersService,
  ) {}

  async getCompanyAdmins(
    companyId: string,
    paginationOptions: IPaginationOptions,
  ): Promise<generalResponse<PaginatedItems<CompanyMember[]>>> {
    try {
      const queryBuilder =
        this.companyMemberRepository.createQueryBuilder('company_members');
      queryBuilder
        .leftJoinAndSelect('company_members.company', 'company')
        .leftJoinAndSelect('company_members.user', 'user')
        .select(['user.id', 'user.email', 'user.firstName', 'company_members.role'])
        .where('company_members.company = :company', { company: companyId })
        .andWhere({role: CompanyRoles.admin})
        .getMany();
      const companyMembers = await paginate<CompanyMember>(
        queryBuilder,
        paginationOptions,
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

  async create(
    data: CreateCompanyRoleDto,
    companyId: string,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    try {
      const { detail: companyMember } =
        await this.companyMembersService.findOne(data.userId, companyId);
      if (!companyMember) 
        throw new HttpException(
          'user is not a member',
          HttpStatus.BAD_REQUEST
        );
      const { detail: updatedMember } =
        await this.companyMembersService.editRole({
          ...data,
          id: companyMember.id,
          companyId,
        });
      return {
        status_code: HttpStatus.OK,
        detail: updatedMember,
        result: 'role was added',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
