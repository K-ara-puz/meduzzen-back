import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnaliticsService } from './analitics.service';
import { UserFromToken } from 'src/users/decorators/userFromToken.decorator';
import { User } from 'src/entities/user.entity';
import { MyAuthGuard } from 'src/auth/auth.guard';
import { Roles } from '../decorators/companyRoles.decorator';
import { CompanyRoles } from 'src/utils/constants';
import { CompanyRolesGuard } from 'src/companies_roles/guards/companyRoles.guard';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { QuizResult } from 'src/entities/quizResult.entity';

@Controller('analitics')
@UseGuards(MyAuthGuard)
export class AnaliticsController {
  constructor(private readonly analiticsService: AnaliticsService) {}
  @Get('all-user-results')
  async getAllUserQuizzesScoresList(
    @UserFromToken() user: User,
  ): Promise<generalResponse<QuizResult[]>> {
    return this.analiticsService.getAllUserQuizzesScoresList(user.id);
  }

  @Get('all-user-last-tries')
  async getAllUserQuizzesListWithLastTryDate(
    @UserFromToken() user: User,
  ): Promise<generalResponse<QuizResult[]>> {
    return this.analiticsService.getAllUserQuizzesListWithLastTryDate(user.id);
  }

  @Get('company-members-results/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getAllCompanyMembersQuizzesScoresList(
    @Param('id') companyId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    return this.analiticsService.getAllCompanyMembersQuizzesScoresList(
      companyId,
    );
  }

  @Get('company-member-results/:id/:memberId')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getOneCompanyMemberQuizzesScoresList(
    @Param('id') companyId: string,
    @Param('memberId') memberId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    return this.analiticsService.getOneCompanyMemberQuizzesScoresList(
      companyId,
      memberId,
    );
  }

  @Get('company-members-last-tries/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async getAllCompanyMembersQuizzesListWithLastTryDate(
    @Param('id') companyId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    return this.analiticsService.getAllCompanyMembersQuizzesListWithLastTryDate(
      companyId,
    );
  }
}
