import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import CompanyRepo from './companies.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from '../entities/company';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import CompanyMembersRepo from '../companies-members/company-members.repository';
import { CompanyMember } from '../entities/companyMember';
import { ParseTokenMiddleware } from '../utils/userFromToken.middleware';
import { CompaniesRolesModule } from '../companies_roles/companies_roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company, CompanyMember]), CompaniesRolesModule],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    CompanyRepo,
    CompanyMembersRepo,
    CompaniesMembersService,
  ],
  exports: [CompanyRepo, CompanyMembersRepo]
})
export class CompaniesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ParseTokenMiddleware)
      .forRoutes('*');
  }
}
