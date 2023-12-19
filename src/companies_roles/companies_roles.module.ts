import { Module } from '@nestjs/common';
import { CompaniesRolesService } from './companies_roles.service';
import { CompaniesRolesController } from './companies_roles.controller';
import CompanyMembersRepo from '../companies-members/company-members.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyMember } from '../entities/companyMember';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyMember]), UsersModule],
  controllers: [CompaniesRolesController],
  providers: [
    CompaniesRolesService,
    CompaniesMembersService,
    CompanyMembersRepo,
    UsersService
  ],
  exports: [CompaniesRolesModule, UsersModule]
})
export class CompaniesRolesModule {}
