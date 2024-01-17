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
      let results =
        await this.quizResultRepo.findAllUserQuizzesAttempts(userId);
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      results = await this.makeDataWithTime(results);
      return {
        status_code: HttpStatus.OK,
        detail: results,
        result: 'your quizzes results',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  private makeDataWithTime = async (
    data: QuizResult[],
  ): Promise<QuizResult[]> => {
    let parsedData = [];

    data.forEach((el) => {
      let existedMember = parsedData.find((elem) => elem.userId === el.user.id);
      let memberResult = {
        quizId: el.quiz.id,
        score: el.score,
        date: el.lastTryDate,
        userName: el.user.firstName,
      };
      if (existedMember) {
        parsedData[parsedData.indexOf(existedMember)].results.push(
          memberResult,
        );
        return;
      }
      let startPoint = {
        userId: el.user.id,
        userName: el.user.firstName,
        memberId: el.companyMember.id,
        results: [],
      };
      startPoint.results.push(memberResult);
      parsedData.push(startPoint);
    });

    return parsedData;
  };

  async getAllCompanyMembersQuizzesScoresList(
    companyId: string,
  ): Promise<generalResponse<QuizResult[]>> {
    try {
      let results =
        await this.quizResultRepo.findAllCompanyMembersQuizzesAttempts(
          companyId,
        );
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      results = await this.makeDataWithTime(results);
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
