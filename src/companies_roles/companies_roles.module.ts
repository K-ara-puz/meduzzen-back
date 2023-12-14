import { Module } from '@nestjs/common';
import { CompaniesRolesService } from './companies_roles.service';
import { CompaniesRolesController } from './companies_roles.controller';
import CompanyMembersRepo from '../companies-members/company-members.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyMember } from '../entities/companyMember';
import { CompaniesMembersService } from '../companies-members/companies-members.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyMember])],
  controllers: [CompaniesRolesController],
  providers: [
    CompaniesRolesService,
    CompaniesMembersService,
    CompanyMembersRepo,
  ],
})
export class CompaniesRolesModule {}
