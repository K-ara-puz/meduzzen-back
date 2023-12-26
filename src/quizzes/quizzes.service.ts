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

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private quizRepo: QuizzesRepo,
    private quizQuestionRepo: QuizzesQuestionRepo,
    private quizAnswerRepo: QuizzesAnswerRepo,
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
}
