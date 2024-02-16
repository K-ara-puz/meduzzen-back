import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { Roles } from '../companies/decorators/companyRoles.decorator';
import { CompanyRolesGuard } from '../companies_roles/guards/companyRoles.guard';
import { CompanyRoles } from '../utils/constants';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateQuizDto } from './dto/create-companies-quiz.dto';
import { Quiz } from '../entities/quiz.entity';
import { ApiOperation } from '@nestjs/swagger';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';
import { DeleteQuizDto } from './dto/delete-quiz.dto';
import { UpdateQuizDto } from './dto/update-company-quiz.dto';
import { MyAuthGuard } from '../auth/auth.guard';
import { StartQuizDto } from './dto/start-quiz.dto';
import { UserFromToken } from '../users/decorators/userFromToken.decorator';
import { User } from '../entities/user.entity';
import { QuizResult } from '../entities/quizResult.entity';

@Controller('quizzes')
@UseGuards(MyAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('/all/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner, CompanyRoles.simpleUser])
  @UseGuards(CompanyRolesGuard)
  @ApiOperation({ summary: 'Get all company quizzes' })
  async findAllCompanyQuizzes(
    @Param() { id: companyId },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<PaginatedItems<Quiz[]>>> {
    limit = limit > 100 ? 100 : limit;
    return this.quizzesService.findAllCompanyQuizzes(
      { page, limit },
      companyId,
    );
  }

  @Get('one/:quizId/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner, CompanyRoles.simpleUser])
  @UseGuards(CompanyRolesGuard)
  @ApiOperation({ summary: 'Get one company quiz' })
  async findOneQuiz(
    @Param() { id: companyId, quizId },
  ): Promise<generalResponse<Partial<Quiz>>> {
    return this.quizzesService.findOneCompanyQuiz(companyId, quizId);
  }

  @Get('quiz-questions-and-answers/:quizId/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async findQuizQuestionsAndAnswers(
    @Param() { quizId },
  ) {
    return this.quizzesService.findQuizQuestionsAndAnswers(quizId, CompanyRoles.owner);
  }

  @Get('quiz-questions/:quizId/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner, CompanyRoles.simpleUser])
  @UseGuards(CompanyRolesGuard)
  async findQuizQuestions(
    @Param() { quizId },
  ) {
    return this.quizzesService.findQuizQuestionsAndAnswers(quizId, CompanyRoles.simpleUser);
  }

  @Get('/average-score-in-company/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner, CompanyRoles.simpleUser])
  @UseGuards(CompanyRolesGuard)
  async getAverageScoreInCompany(
    @Param() { id: companyId },
    @UserFromToken() user: User
  ): Promise<generalResponse<Partial<QuizResult>>> {
    return this.quizzesService.getUserAverageScoreInCompany(user.id, companyId);
  }

  @Get('/average-score-in-app/:userId')
  async getAverageScoreInApp(
    @Param('userId') userId: string
  ): Promise<generalResponse<Partial<QuizResult>>> {
    return this.quizzesService.getUserAverageScoreInApp(userId);
  }

  @Post(':id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async createQuiz(
    @Body() quiz: CreateQuizDto,
    @Param() { id: companyId },
    @UserFromToken() user: User
  ): Promise<generalResponse<Quiz>> {
    return this.quizzesService.create(quiz, companyId, user.id);
  }

  @Post('/start/:quizId/:id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner, CompanyRoles.simpleUser])
  @UseGuards(CompanyRolesGuard)
  async startQuiz(
    @Param() { quizId, id: companyId },
    @Body() quizData: StartQuizDto,
    @UserFromToken() user: User
  ): Promise<generalResponse<Partial<QuizResult>>> {
    return this.quizzesService.startQuiz(quizId, companyId, user.id, quizData);
  }

  @Patch(':id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async updateQuiz(
    @Body() quiz: UpdateQuizDto,
    @Param() { id: companyId },
  ): Promise<generalResponse<Quiz>> {
    return this.quizzesService.update(quiz, companyId);
  }

  @Delete()
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async deleteQuiz(
    @Body() { quizId, companyId }: DeleteQuizDto,
  ): Promise<generalResponse<string>> {
    return this.quizzesService.delete({ quizId, companyId });
  }
}
