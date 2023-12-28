import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateQuizDto } from './dto/create-companies-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Repository } from 'typeorm';
import QuizzesRepo from './quizzes.repository';
import QuizzesQuestionRepo from './quizzesQuestion.repository';
import QuizzesAnswerRepo from './quizzesAnswer.repository';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';
import { DeleteQuizDto } from './dto/delete-quiz.dto';
import {
  IUpdateQuizAnswer,
  IUpdateQuizQuestion,
  UpdateQuizDto,
} from './dto/update-company-quiz.dto';
import { StartQuizDto } from './dto/start-quiz.dto';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import QuizzesResultRepo from './quizzesResult.repository';
import { QuizResult } from '../entities/quizResult.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private quizRepo: QuizzesRepo,
    private quizQuestionRepo: QuizzesQuestionRepo,
    private quizAnswerRepo: QuizzesAnswerRepo,
    private quizResultRepo: QuizzesResultRepo,
    private companyMembersService: CompaniesMembersService,
  ) {}

  async findAllCompanyQuizzes(
    options: IPaginationOptions,
    companyId: string,
  ): Promise<generalResponse<PaginatedItems<Quiz[]>>> {
    try {
      const queryBuilder = this.quizRepository.createQueryBuilder('quiz');
      queryBuilder
        .leftJoinAndSelect('quiz.company', 'company')
        .where('quiz.company = :company', { company: companyId })
        .getMany();
      const companyMembers = await paginate<Quiz>(queryBuilder, options);
      return {
        status_code: HttpStatus.OK,
        detail: {
          items: companyMembers.items,
          totalItemsCount: companyMembers.meta.totalItems,
        },
        result: 'company quizzes',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneCompanyQuiz(
    companyId: string,
    quizId: string,
  ): Promise<generalResponse<Partial<Quiz>>> {
    try {
      const foundedQuiz = await this.quizRepo.findOneById(quizId, companyId);
      if (!foundedQuiz)
        throw new HttpException('quiz is not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: foundedQuiz,
        result: 'ok',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    quiz: CreateQuizDto,
    companyId: string,
  ): Promise<generalResponse<Quiz>> {
    try {
      const foundedQuiz = await this.quizRepo.findOneByName({
        name: quiz.name,
        companyId,
      });
      if (foundedQuiz)
        throw new HttpException(
          'quiz with this name already exist',
          HttpStatus.BAD_REQUEST,
        );
      const createdQuiz = await this.quizRepo.create(quiz, companyId);
      quiz.questions.forEach(async (question) => {
        const createdQuestion = await this.quizQuestionRepo.create(
          question,
          createdQuiz.id,
        );
        question.answers.forEach(async (answer) => {
          await this.quizAnswerRepo.create(answer, createdQuestion.id);
        });
      });
      return {
        status_code: HttpStatus.OK,
        detail: createdQuiz,
        result: 'quiz was created',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    quiz: UpdateQuizDto,
    companyId: string,
  ): Promise<generalResponse<Quiz>> {
    try {
      const foundedQuiz = await this.quizRepo.findOneById(quiz.id, companyId);
      if (!foundedQuiz)
        throw new HttpException('quiz is not exist', HttpStatus.NOT_FOUND);
      const updatedQuiz = await this.quizRepo.create(
        { id: foundedQuiz.id, ...quiz },
        companyId,
      );
      updatedQuiz['questions'].forEach(
        async (question: IUpdateQuizQuestion) => {
          const createdQuestion = await this.quizQuestionRepo.create(
            question,
            updatedQuiz.id,
          );
          if (question.answers) {
            question.answers.forEach(async (answer: IUpdateQuizAnswer) => {
              await this.quizAnswerRepo.create(answer, createdQuestion.id);
            });
          }
        },
      );
      return {
        status_code: HttpStatus.OK,
        detail: updatedQuiz,
        result: 'quiz was updated',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete({
    quizId,
    companyId,
  }: DeleteQuizDto): Promise<generalResponse<string>> {
    try {
      const foundedQuiz = await this.quizRepo.findOneById(quizId, companyId);
      if (!foundedQuiz)
        throw new HttpException('quiz is not exist', HttpStatus.NOT_FOUND);
      await this.quizRepo.delete({ quizId, companyId });
      return {
        status_code: HttpStatus.OK,
        detail: 'quiz was deleted',
        result: 'quiz was created',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startQuiz(
    quizId: string,
    companyId: string,
    userId: string,
    quizData: StartQuizDto,
  ): Promise<generalResponse<Partial<QuizResult>>> {
    try {
      const { detail: companyMember } =
        await this.companyMembersService.findOne(userId, companyId);
      const { lastTryDate } =
        await this.quizResultRepo.findLastUserAttemptInCompany(
          quizId,
          companyMember.id,
        );
      if (lastTryDate) {
        var currentDate = new Date();

        if (currentDate.getDay() - lastTryDate.getDay() < 1) {
          throw new HttpException(
            'You can pass quiz only 1 time per day',
            HttpStatus.FORBIDDEN,
          );
        }
      }
      const rating = await this.getQuizRating(quizData, quizId);
      const quizResult = {
        companyMember: { id: companyMember.id },
        user: { id: userId },
        quiz: { id: quizId },
        company: { id: companyId },
        allQuestionsCount: rating.allQuestionsCount,
        rightQuestionsCount: rating.rightQuestionsCount,
      };

      const createdResult = await this.quizResultRepo.create(quizResult);

      return {
        status_code: HttpStatus.OK,
        detail: createdResult,
        result: `Your rating for this quiz: ${rating.rightQuestionsCount} from ${rating.rightQuestionsCount}`,
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuizRating(
    quizData: StartQuizDto,
    quizId: string,
  ): Promise<Partial<QuizResult>> {
    let rating = 0;
    const questionsCount =
      await this.quizQuestionRepo.getAllQuizQuestionsCount(quizId);
    for (const userAnswer of quizData.answers) {
      let reallyRightAnswers = [];
      let userRightAnswersPerQuestionCount = 0;
      const answers = await this.quizAnswerRepo.findAllByQuestionId(
        userAnswer.questionId,
      );
      for (const answer of answers) {
        if (answer.isRight) {
          reallyRightAnswers.push(answer['id']);
          if (userAnswer.answersId.includes(answer['id'])) {
            userRightAnswersPerQuestionCount += 1;
          }
        }
      }
      let wrongAnswersPerQuestionCount =
        userAnswer.answersId.length - userRightAnswersPerQuestionCount;

      rating +=
        (userRightAnswersPerQuestionCount - wrongAnswersPerQuestionCount) /
        reallyRightAnswers.length;
      if (rating < 0) rating = 0;
    }
    return { rightQuestionsCount: rating, allQuestionsCount: questionsCount };
  }

  async getUserAverageScoreInCompany(
    userId: string,
    companyId: string,
  ): Promise<generalResponse<Partial<QuizResult>>> {
    try {
      const { detail: companyMember } =
        await this.companyMembersService.findOne(userId, companyId);

      const { allQuestionsCount, rightQuestionsCount } =
        await this.quizResultRepo.getAverageInCompany(
          companyMember.id,
          companyId,
        );
      return {
        status_code: HttpStatus.OK,
        detail: { allQuestionsCount, rightQuestionsCount },
        result: `user average score in company`,
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserAverageScoreInApp(
    userId: string,
  ): Promise<generalResponse<Partial<QuizResult>>> {
    try {
      const { allQuestionsCount, rightQuestionsCount } =
        await this.quizResultRepo.getAverageInApp(userId);
      return {
        status_code: HttpStatus.OK,
        detail: { allQuestionsCount, rightQuestionsCount },
        result: `user average score in app`,
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
