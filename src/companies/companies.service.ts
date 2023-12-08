import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getUserFromToken } from '../utils/getUserIdFromToken';
import CompanyRepo from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private companyRepo: CompanyRepo,
    private companyMembersService: CompaniesMembersService,
  ) {}

  async getAll(options: IPaginationOptions): Promise<generalResponse<object>> {
    try {
      const paginatedCompanies = await paginate<Company>(
        this.companyRepository,
        options,
      );
      return {
        status_code: HttpStatus.OK,
        detail: {
          companies: paginatedCompanies.items,
          totalItemsCount: paginatedCompanies.meta.totalItems,
        },
        result: 'get paginated companies',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<generalResponse<Partial<Company>>> {
    try {
      const company = await this.companyRepo.findOne(id);
      if (!company) throw new Error('company is not exist');
      return {
        status_code: HttpStatus.OK,
        detail: company,
        result: 'get company',
      };
    } catch (error) {
      throw new HttpException('company is not exist', HttpStatus.NOT_FOUND);
    }
  }

  async createCompany(
    rawToken: string,
    companyData: CreateCompanyDto,
  ): Promise<generalResponse<Partial<Company>>> {
    try {
      const { id } = getUserFromToken(rawToken);
      const company = await this.companyRepo.create(companyData);
      const companyOwner = {
        role: 'Owner',
        userId: id,
        companyId: company.id,
      };
      await this.companyMembersService.create(companyOwner);

      return {
        status_code: HttpStatus.OK,
        detail: company,
        result: 'company was registered',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async editCompany(
    id: string,
    data: Partial<CreateCompanyDto>,
  ): Promise<generalResponse<Partial<Company>>> {
    try {
      await this.findOne(id);
      const updatedCompany = await this.companyRepo.update(id, data);
      return {
        status_code: HttpStatus.OK,
        detail: updatedCompany,
        result: 'company was updated',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCompany(id: string): Promise<generalResponse<Partial<string>>> {
    try {
      await this.findOne(id);
      await this.companyRepo.delete(id);
      return {
        status_code: HttpStatus.OK,
        detail: 'ok',
        result: 'company was deleted',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
