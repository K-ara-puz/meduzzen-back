import { Module } from '@nestjs/common';
import { CompaniesInvitesService } from './companies_invites.service';
import { CompaniesInvitesController } from './companies_invites.controller';
import CompanyInviteRepo from './companies_invites.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInvite } from '../entities/companyInvite';
import { CompaniesMembersModule } from '../companies-members/companies-members.module';
import { CompaniesModule } from '../companies/companies.module';
import { CompaniesRolesModule } from '../companies_roles/companies_roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyInvite]),
    CompaniesMembersModule,
    CompaniesModule,
    CompaniesRolesModule
  ],
  controllers: [CompaniesInvitesController],
  providers: [CompaniesInvitesService, CompanyInviteRepo],
})
export class CompaniesInvitesModule {}
