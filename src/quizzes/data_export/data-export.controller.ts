import { Controller, Get, Header, Param, UseGuards } from '@nestjs/common';
import { MyAuthGuard } from 'src/auth/auth.guard';
import { QuizzesDataExportService } from './data-export.service';
import { UserFromToken } from 'src/users/decorators/userFromToken.decorator';
import { User } from 'src/entities/user.entity';
import { CompanyRoles, DataExportFileTypes } from 'src/utils/constants';
import { Roles } from 'src/companies/decorators/companyRoles.decorator';
import { CompanyRolesGuard } from 'src/companies_roles/guards/companyRoles.guard';
import { QuizResult } from 'src/entities/quizResult.entity';

@Controller('quizzes-data-export')
@UseGuards(MyAuthGuard)
export class QuizzesDataExportController {
  constructor(
    private readonly quizzesDataExportService: QuizzesDataExportService,
  ) {}

  @Get('user-results/json')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.json"')
  async getUserResultsJSON(@UserFromToken() user: User): Promise<QuizResult[]> {
    return this.quizzesDataExportService.getAllUserResults(
      user.id,
      DataExportFileTypes.json,
    ) as Promise<QuizResult[]>
  }

  @Get('user-results/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.csv"')
  async getUserResultsCSV(@UserFromToken() user: User): Promise<string> {
    return this.quizzesDataExportService.getAllUserResults(
      user.id,
      DataExportFileTypes.csv,
    ) as Promise<string>
  }

  @Get('member-results/csv/:memberId/:id')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.csv"')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getCompanyMemberResultsCSV(@Param() { memberId, id }): Promise<string> {
    return this.quizzesDataExportService.getMemberResults(
      memberId,
      id,
      DataExportFileTypes.csv,
    ) as Promise<string>
  }

  @Get('member-results/json/:memberId/:id')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.json"')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getCompanyMemberResultsJSON(@Param() { memberId, id }): Promise<QuizResult[]> {
    return this.quizzesDataExportService.getMemberResults(
      memberId,
      id,
      DataExportFileTypes.json,
    ) as Promise<QuizResult[]>
  }

  @Get('members-results/csv/:id')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.csv"')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getCompanyMembersResultsCSV(@Param() {id}): Promise<string> {
    return this.quizzesDataExportService.getAllMembersResults(
      id,
      DataExportFileTypes.csv,
    ) as Promise<string>
  }

  @Get('members-results/json/:id')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.json"')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getCompanyMembersResultsJSON(@Param() {id}): Promise<QuizResult[]> {
    return this.quizzesDataExportService.getAllMembersResults(
      id,
      DataExportFileTypes.json,
    ) as Promise<QuizResult[]>
  }

  @Get('quiz-results/csv/:id/:quizId')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.csv"')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getQuizResultsCSV(@Param() {id, quizId}): Promise<string> {
    return this.quizzesDataExportService.getQuizResults(
      id,
      quizId,
      DataExportFileTypes.csv,
    ) as Promise<string>
  }

  @Get('quiz-results/json/:id/:quizId')
  @Header('Content-Disposition', 'attachment; filename="quizzesResults.json"')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getQuizResultsJSON(@Param() {id, quizId}): Promise<QuizResult[]> {
    return this.quizzesDataExportService.getQuizResults(
      id,
      quizId,
      DataExportFileTypes.json,
    ) as Promise<QuizResult[]>
  }
}
