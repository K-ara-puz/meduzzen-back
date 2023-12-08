import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import CompanyRepo from './company.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../entities/company';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import CompanyMembersRepo from '../companies-members/company-members.repository';
import { CompanyMember } from '../entities/companyMember';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyMember])],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CompanyRepo,
    CompanyMembersRepo,
    CompaniesMembersService,
  ],
})
export class CompaniesModule {}
