import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import QuizzesDataExportRepo from './data-export.repository';
import * as converter from 'json-2-csv';
import { DataExportFileTypes } from 'src/utils/constants';
import { QuizResult } from 'src/entities/quizResult.entity';

@Injectable()
export class QuizzesDataExportService {
  constructor(private quizzesDataExportRepo: QuizzesDataExportRepo) {}

  private json2csvOptions = {
    delimiter: {field: ";"}
  }

  private async parseResultsAnswers(
    results: QuizResult[],
  ): Promise<QuizResult[]> {
    let tempArr = [];
    results.forEach((el) => {
      el = { ...el, answers: JSON.parse(el.answers) };
      tempArr.push(el);
    });
    results = [...tempArr];
    return tempArr;
  }w

  async getAllUserResults(
    userId: string,
    dataType: string,
  ): Promise<string | QuizResult[]> {
    try {
      let results = await this.quizzesDataExportRepo.getAllUserResults(userId);
      results = await this.parseResultsAnswers(results);
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      if (dataType === DataExportFileTypes.csv)
        return converter.json2csv(results, this.json2csvOptions);
      return results;
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMemberResults(
    memberId: string,
    companyId: string,
    dataType: string,
  ): Promise<QuizResult[] | string> {
    try {
      let results = await this.quizzesDataExportRepo.getMemberResults(
        memberId,
        companyId,
      );
      results = await this.parseResultsAnswers(results);
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      if (dataType === DataExportFileTypes.csv)
        return converter.json2csv(results, this.json2csvOptions);
      return results;
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMembersResults(
    companyId: string,
    dataType: string,
  ): Promise<QuizResult[] | string> {
    try {
      let results =
        await this.quizzesDataExportRepo.getAllMembersResults(companyId);
      results = await this.parseResultsAnswers(results);
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      if (dataType === DataExportFileTypes.csv)
        return converter.json2csv(results, this.json2csvOptions);
      return results;
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuizResults(
    companyId: string,
    quizId: string,
    dataType: string,
  ): Promise<QuizResult[] | string> {
    try {
      let results = await this.quizzesDataExportRepo.getQuizResults(
        companyId,
        quizId,
      );
      results = await this.parseResultsAnswers(results);
      if (!results)
        throw new HttpException('results are not exist', HttpStatus.NOT_FOUND);
      if (dataType === DataExportFileTypes.csv)
        return converter.json2csv(results, this.json2csvOptions);
      return results;
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
