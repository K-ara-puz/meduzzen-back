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
import { CompanyOwnerGuard } from './isOwner.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('companies')
@UseGuards(MyAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @UseGuards(MyAuthGuard)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<object>> {
    limit = limit > 100 ? 100 : limit;
    return this.companiesService.getAll({ page, limit });
  }
  
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<generalResponse<Partial<Company>>> {
    return this.companiesService.findOne(id);
  }

  @Post()
  async createCompany(
    @Req() req: Request,
    @Body() companyData: CreateCompanyDto,
  ): Promise<generalResponse<Partial<Company>>> {
    return this.companiesService.createCompany(
      req.headers['authorization'],
      companyData,
    );
  }

  @Put(':id')
  @UseGuards(CompanyOwnerGuard)
  async editCompany(
    @Body() companyData: Partial<CreateCompanyDto>,
    @Param('id') companyId: string,
  ): Promise<generalResponse<Partial<Company>>> {
    return this.companiesService.editCompany(companyId, companyData);
  }

  @Delete(':id')
  async deleteCompany(@Param('id') companyId: string): Promise<generalResponse<string>> {
    return this.companiesService.deleteCompany(companyId);
  }
}
