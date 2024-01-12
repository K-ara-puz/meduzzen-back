import { Module } from '@nestjs/common';
import { CompaniesRolesModule } from 'src/companies_roles/companies_roles.module';
import { QuizzesDataExportController } from './data-export.controller';
import { QuizzesDataExportService } from './data-export.service';
import { CompaniesMembersModule } from 'src/companies-members/companies-members.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizResult } from 'src/entities/quizResult.entity';
import QuizzesDataExportRepo from './data-export.repository';

@Module({
  imports: [
    CompaniesRolesModule,
    CompaniesMembersModule,
    TypeOrmModule.forFeature([QuizResult]),
  ],
  controllers: [QuizzesDataExportController],
  providers: [QuizzesDataExportService, QuizzesDataExportRepo],
})
export class QuizzesDataExportModule {}
