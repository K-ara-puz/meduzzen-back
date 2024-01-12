import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QuizResult } from 'src/entities/quizResult.entity';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import QuizzesResultRepo from 'src/quizzes/quizzesResult.repository';

@Injectable()
export class AnaliticsService {
  constructor(private quizResultRepo: QuizzesResultRepo) {}

  async getAllUserQuizzesScoresList(
    userId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    try {
      const results =
        await this.quizResultRepo.findAllUserQuizzesAttempts(userId);
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'your quizzes results',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCompanyMembersQuizzesScoresList(
    companyId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    try {
      const results =
        await this.quizResultRepo.findAllCompanyMembersQuizzesAttempts(
          companyId,
        );
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'members quizzes results',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOneCompanyMemberQuizzesScoresList(
    companyId: string,
    memberId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    try {
      const results =
        await this.quizResultRepo.findOneCompanyMemberQuizzesAttempts(
          companyId,
          memberId,
        );
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'member quizzes results',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllCompanyMembersQuizzesListWithLastTryDate(
    companyId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    try {
      const results =
        await this.quizResultRepo.findAllCompanyMembersQuizzesListWithLastTryDate(
          companyId,
        );
      if (!results)
        throw new HttpException(
          'you have not passed quizzes yet',
          HttpStatus.NOT_FOUND,
        );
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'company member quizzes results',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllUserQuizzesListWithLastTryDate(
    userId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    try {
      const results =
        await this.quizResultRepo.findAllUserQuizzesListWithLastTryDate(userId);
      if (!results)
        throw new HttpException(
          'you have not passed quizzes yet',
          HttpStatus.NOT_FOUND,
        );
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'your quizzes attempts',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
