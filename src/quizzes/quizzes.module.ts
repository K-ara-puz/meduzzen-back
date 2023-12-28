import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CompaniesRolesModule } from '../companies_roles/companies_roles.module';
import { CompaniesMembersModule } from '../companies-members/companies-members.module';
import QuizzesRepo from './quizzes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { QuizQuestion } from '../entities/quizQuestion.entity';
import QuizzesQuestionRepo from './quizzesQuestion.repository';
import { QuizAnswer } from '../entities/quizAnswer.entity';
import QuizzesAnswerRepo from './quizzesAnswer.repository';
import { QuizzesController } from './quizzes.controller';
import { QuizResult } from '../entities/quizResult.entity';
import QuizzesResultRepo from './quizzesResult.repository';

@Module({
  imports: [
    CompaniesRolesModule,
    CompaniesMembersModule,
    TypeOrmModule.forFeature([Quiz, QuizQuestion, QuizAnswer, QuizResult]),
  ],
  controllers: [QuizzesController],
  providers: [
    QuizzesService,
    QuizzesRepo,
    QuizzesQuestionRepo,
    QuizzesAnswerRepo,
    QuizzesResultRepo
  ],
})
export class QuizzesModule {}
