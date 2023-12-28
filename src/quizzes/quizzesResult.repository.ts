import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizResult } from '../entities/quizResult.entity';

interface IQuizResult {
  companyMember: {
    id: string;
  };
  user: {
    id: string;
  };
  quiz: {
    id: string;
  };
  company: {
    id: string;
  };
  allQuestionsCount: number;
  rightQuestionsCount: number;
}

export default class QuizzesResultRepo {
  constructor(
    @InjectRepository(QuizResult)
    private quizResultRepository: Repository<QuizResult>,
  ) {}

  async findLastUserAttemptInCompany(
    quizId: string,
    memberId: string,
  ): Promise<QuizResult> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .orderBy('quiz_result.lastTryDate', 'DESC')
      .where({ quiz: { id: quizId } })
      .andWhere({ companyMember: { id: memberId } })
      .getOne();
  }

  async getAverageInCompany(memberId: string, companyId: string) {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .select('SUM(quiz_result.allQuestionsCount)', 'allQuestionsCount')
      .addSelect('SUM(quiz_result.rightQuestionsCount)', 'rightQuestionsCount')
      .where({ companyMember: { id: memberId } })
      .andWhere({ company: { id: companyId } })
      .getRawOne();
  }

  async getAverageInApp(userId: string) {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .select('SUM(quiz_result.allQuestionsCount)', 'allQuestionsCount')
      .addSelect('SUM(quiz_result.rightQuestionsCount)', 'rightQuestionsCount')
      .where({ user: { id: userId } })
      .getRawOne();
  }

  async create(quizResult: IQuizResult): Promise<QuizResult> {
    return this.quizResultRepository.save(quizResult);
  }
}
