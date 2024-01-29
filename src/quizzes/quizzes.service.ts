import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateQuizDto } from './dto/create-companies-quiz.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Repository } from 'typeorm';
import QuizzesRepo from './quizzes.repository';
import QuizzesQuestionRepo from './quizzesQuestion.repository';
import QuizzesAnswerRepo from './quizzesAnswer.repository';
import { IPaginationMeta, IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';
import { DeleteQuizDto } from './dto/delete-quiz.dto';
import { UpdateQuizDto } from './dto/update-company-quiz.dto';
import { StartQuizDto } from './dto/start-quiz.dto';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import QuizzesResultRepo from './quizzesResult.repository';
import { QuizResult } from '../entities/quizResult.entity';
import { RedisService } from '../redis/redis.service';
import { QuizQuestion } from '../entities/quizQuestion.entity';
import { QuizAnswer } from '../entities/quizAnswer.entity';
import { SocketsGateway } from '../sockets/sockets.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { CompaniesService } from '../companies/companies.service';
import { ModuleRef } from '@nestjs/core';
import { CompanyMember } from 'src/entities/companyMember';

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
    private redis: RedisService,
    private socket: SocketsGateway,
    private notificationsService: NotificationsService,
    private moduleRef: ModuleRef,
  ) {}

  async paginateQuizzes(
    options: IPaginationOptions,
    companyId: string,
  ): Promise<Pagination<Quiz, IPaginationMeta>> {
    const queryBuilder = this.quizRepository.createQueryBuilder('quiz');
    queryBuilder
      .leftJoinAndSelect('quiz.company', 'company')
      .where('quiz.company = :company', { company: companyId })
      .getMany();
    return paginate<Quiz>(queryBuilder, options);
  }

  async findAllCompanyQuizzes(
    options: IPaginationOptions,
    companyId: string,
  ): Promise<generalResponse<PaginatedItems<Quiz[]>>> {
    try {
      const companyMembers = await this.paginateQuizzes(options, companyId)
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

  async findQuizQuestions(
    quizId: string,
  ): Promise<generalResponse<QuizQuestion[]>> {
    try {
      const quizQuestions =
        await this.quizQuestionRepo.getAllQuizQuestions(quizId);
      if (!quizQuestions)
        throw new HttpException('quiz is not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: quizQuestions,
        result: 'ok',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findQuizQuestionsAndAnswers(
    quizId: string,
    role: string,
  ): Promise<generalResponse<QuizAnswer[]>> {
    try {
      const quizQuestions =
        await this.quizQuestionRepo.getAllQuizQuestionsAndAnswers(quizId, role);
      if (!quizQuestions)
        throw new HttpException('quiz is not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: quizQuestions,
        result: 'quiz questions',
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
    initiatorUserId: string,
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
      this.notifyUsersAfterQuizAdded(
        companyId,
        initiatorUserId,
        createdQuiz.name,
      );
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

  async notifyUsersAfterQuizAdded(
    companyId: string,
    initiatorUserId: string,
    createdQuizName: string,
  ): Promise<void> {
    const companiesService = this.moduleRef.get(CompaniesService, {
      strict: false,
    });
    const { detail: company } = await companiesService.findOne(companyId);
    const { detail: members } =
      await this.companyMembersService.getCompanyMembers(
        { page: 1, limit: 100 },
        companyId,
      );
    members.items.forEach(async (member) => {
      if (member.user.id === initiatorUserId) return;
      await this.notificationsService.createAddedCompanyQuizNotification({
        userId: member.user.id,
        text: `Try a new quiz: ${createdQuizName}. In ${company.name}.`,
      });
    });
    this.socket.handleAddQuizInCompany(
      initiatorUserId,
      companyId,
      company.name,
      createdQuizName,
    );
  }

  async update(
    quiz: UpdateQuizDto,
    companyId: string,
  ): Promise<generalResponse<Quiz>> {
    try {
      const foundedQuiz = await this.quizRepo.findOneById(quiz.id, companyId);
      if (!foundedQuiz)
        throw new HttpException('quiz is not exist', HttpStatus.NOT_FOUND);
      const quizQuestions = await this.findQuizQuestions(companyId);
      const updatedQuiz = await this.quizRepo.create(
        { id: foundedQuiz.id, ...quiz },
        companyId,
      );
      for (const question of updatedQuiz['questions']) {
        const createdQuestion = await this.quizQuestionRepo.create(
          question,
          updatedQuiz.id,
        );
        const questionIndex = quizQuestions.detail.findIndex(
          (el) => el.id === question.id,
        );
        quizQuestions.detail.splice(questionIndex, 1);
        if (question.answers) {
          for (const answer of question.answers) {
            await this.quizAnswerRepo.create(answer, createdQuestion.id);
          }
        }
      }
      quizQuestions.detail.forEach(async (question) => {
        await this.quizQuestionRepo.delete(question.id);
      });

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
      const { detail: quiz } = await this.findOneCompanyQuiz(companyId, quizId);
      const { detail: companyMember } =
        await this.companyMembersService.findOne(userId, companyId);
      const lastTriesForToday =
        await this.quizResultRepo.findLastQuizUserAttemptsForToday(
          quizId,
          userId,
        );

      if (lastTriesForToday.length >= quiz.attemptsPerDay) {
        throw new HttpException(
          `You can pass quiz only ${quiz.attemptsPerDay} time${
            quiz.attemptsPerDay > 1 ? 's' : ''
          } per day`,
          HttpStatus.FORBIDDEN,
        );
      }
      const rating = await this.getQuizRating(quizData, quizId);
      let quizResult = {
        companyMember: { id: companyMember.id },
        user: { id: userId },
        quiz: { id: quizId },
        company: { id: companyId },
        allQuestionsCount: rating.allQuestionsCount,
        rightQuestionsCount: rating.rightQuestionsCount,
        score: +(rating.rightQuestionsCount / rating.allQuestionsCount).toFixed(
          2,
        ),
        answers: rating.answers,
      };

      const createdResult = await this.quizResultRepo.create(quizResult);
      quizResult = { ...quizResult, answers: JSON.parse(quizResult.answers) };
      await this.redis.setQuizResult(quizResult, createdResult.id);

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
    let analizedAnswers = [];
    const questionsCount =
      await this.quizQuestionRepo.getAllQuizQuestionsCount(quizId);
    for (const userAnswer of quizData.answers) {
      let analizedAnswer = {
        questionId: userAnswer.questionId,
        answerId: userAnswer.answersId,
        answerScore: 0,
      };
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
      userRightAnswersPerQuestionCount -= wrongAnswersPerQuestionCount;

      rating += userRightAnswersPerQuestionCount / reallyRightAnswers.length;
      if (rating < 0) rating = 0;
      analizedAnswer.answerScore = await this.getAnswerScore(
        reallyRightAnswers.length,
        userRightAnswersPerQuestionCount,
      );
      analizedAnswers.push(analizedAnswer);
    }
    return {
      rightQuestionsCount: rating,
      allQuestionsCount: questionsCount,
      answers: JSON.stringify(analizedAnswers),
    };
  }

  private async getAnswerScore(
    rightAnswersCountMustBe: number,
    userRightAnswerCount: number,
  ): Promise<number> {
    if (userRightAnswerCount === 0) {
      return 0;
    }
    return userRightAnswerCount / rightAnswersCountMustBe;
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
