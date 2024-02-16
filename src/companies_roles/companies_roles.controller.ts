import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CompaniesRolesService } from './companies_roles.service';
import { CreateCompanyRoleDto } from './dto/create-companies-roles.dto';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { Roles } from '../companies/decorators/companyRoles.decorator';
import { CompanyRolesGuard } from './guards/companyRoles.guard';
import { MyAuthGuard } from '../auth/auth.guard';
import { CompanyMember } from '../entities/companyMember';
import { CompanyRoles } from '../utils/constants';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';

@Controller('companies-roles')
@UseGuards(MyAuthGuard)
export class CompaniesRolesController {
  constructor(private readonly companiesRolesService: CompaniesRolesService) {}

  @Get('/admins/:id')
  @Roles([CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getCompanyAdmins(
    @Param() {id},
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<PaginatedItems<CompanyMember[]>>> {
    limit = limit > 100 ? 100 : limit;
    return await this.companiesRolesService.getCompanyAdmins(id, {page, limit});
  }

  @Post(':id')
  @Roles([CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async create(
    @Param() {id},
    @Body() data: CreateCompanyRoleDto,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    return await this.companiesRolesService.create(data, id);
  }

  @Patch(':id')
  @Roles([CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async delete(
    @Param() {id},
    @Body() data: CreateCompanyRoleDto,
  ): Promise<generalResponse<Partial<CompanyMember>>> {
    return await this.companiesRolesService.create(data, id);
  }
}
