import { Module } from '@nestjs/common';
import { CompaniesMembersService } from './companies-members.service';
import { CompaniesMembersController } from './companies-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyMember } from '../entities/companyMember';
import CompanyMembersRepo from './company-members.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyMember])],
  controllers: [CompaniesMembersController],
  providers: [CompaniesMembersService, CompanyMembersRepo],
})
export class CompaniesMembersModule {}
