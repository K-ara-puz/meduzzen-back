import { Module } from '@nestjs/common';
import { CompaniesMembersService } from './companies-members.service';
import { CompaniesMembersController } from './companies-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyMember } from '../entities/companyMember';
import CompanyMembersRepo from './company-members.repository';
import { CompaniesRolesModule } from '../companies_roles/companies_roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyMember]), CompaniesRolesModule],
  controllers: [CompaniesMembersController],
  providers: [CompaniesMembersService, CompanyMembersRepo],
  exports: [CompaniesMembersService, CompanyMembersRepo]
})
export class CompaniesMembersModule {}
