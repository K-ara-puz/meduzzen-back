import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Req,
  UseGuards,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CreateCompanyDto } from './dto/create-company.dto';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { Company } from '../entities/company';
import { ApiOperation } from '@nestjs/swagger';
import { CompanyRolesGuard } from '../companies_roles/guards/companyRoles.guard';
import { Roles } from './decorators/companyRoles.decorator';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';
import { CompanyRoles } from '../utils/constants';
import { UserFromToken } from '../users/decorators/userFromToken.decorator';
import { CompanyMember } from '../entities/companyMember';
import { User } from '../entities/user.entity';

@Controller('companies')
@UseGuards(MyAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<PaginatedItems<Company[]>>> {
    limit = limit > 100 ? 100 : limit;
    return this.companiesService.getAll({ page, limit });
  }

  @Get('/user-companies')
  @ApiOperation({ summary: 'Get all user companies' })
  async findAllUserCompanies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @UserFromToken() user: User,
  ): Promise<generalResponse<PaginatedItems<CompanyMember[]>>> {
    limit = limit > 100 ? 100 : limit;
    return this.companiesService.findAllUserCompanies({ page, limit }, user.id);
  }

  @Get('/user-companies/i-member')
  @ApiOperation({ summary: 'Get all user companies' })
  async getCompaniesWhereIMember(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @UserFromToken() user: User,
  ): Promise<generalResponse<PaginatedItems<CompanyMember[]>>> {
    limit = limit > 100 ? 100 : limit;
    return this.companiesService.getCompaniesWhereIMember({ page, limit }, user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<generalResponse<Partial<Company>>> {
    return this.companiesService.findOne(id);
  }

  @Post()
  async createCompany(
    @Body() companyData: CreateCompanyDto,
    @UserFromToken() user: User,
  ): Promise<generalResponse<Partial<Company>>> {
    return this.companiesService.createCompany(
      companyData,
      user.id
    );
  }

  @Put(':id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async editCompany(
    @Body() companyData: Partial<CreateCompanyDto>,
    @Param('id') companyId: string,
  ): Promise<generalResponse<Partial<Company>>> {
    return this.companiesService.editCompany(companyId, companyData);
  }

  @Delete(':id')
  @Roles([CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async deleteCompany(
    @Param('id') companyId: string,
  ): Promise<generalResponse<string>> {
    return this.companiesService.deleteCompany(companyId);
  }
}
