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

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(':id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner, CompanyRoles.simpleUser])
  @UseGuards(CompanyRolesGuard)
  @ApiOperation({ summary: 'Get all company quizzes' })
  async findAllUserCompanies(
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

  @Post(':id')
  @Roles([CompanyRoles.admin, CompanyRoles.owner])
  @UseGuards(CompanyRolesGuard)
  async createQuiz(
    @Body() quiz: CreateQuizDto,
    @Param() { id: companyId },
  ): Promise<generalResponse<Quiz>> {
    return this.quizzesService.create(quiz, companyId);
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
