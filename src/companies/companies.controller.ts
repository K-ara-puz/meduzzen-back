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
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { MyAuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CreateCompanyDto } from './dto/create-company.dto';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { Company } from '../entities/company';
import { CompanyOwnerGuard } from './isOwner.guard';

@Controller('companies')
@UseGuards(MyAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

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
