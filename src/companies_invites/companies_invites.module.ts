import { Module } from '@nestjs/common';
import { CompaniesInvitesService } from './companies_invites.service';
import { CompaniesInvitesController } from './companies_invites.controller';
import CompanyInviteRepo from './companies_invites.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyInvite } from '../entities/companyInvite';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyInvite])],
  controllers: [CompaniesInvitesController],
  providers: [CompaniesInvitesService, CompanyInviteRepo],
})
export class CompaniesInvitesModule {}
