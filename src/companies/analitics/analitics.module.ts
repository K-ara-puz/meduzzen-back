import { Module } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { AnaliticsController } from './analitics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { CompaniesRolesModule } from 'src/companies_roles/companies_roles.module';
import CompanyMembersRepo from 'src/companies-members/company-members.repository';
import { CompanyMember } from 'src/entities/companyMember';

@Module({
  imports: [
    QuizzesModule,
    CompaniesRolesModule,
    TypeOrmModule.forFeature([CompanyMember]),
  ],
  controllers: [AnaliticsController],
  providers: [AnaliticsService, CompanyMembersRepo],
})
export class AnaliticsModule {}
