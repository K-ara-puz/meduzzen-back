import { InjectRepository } from '@nestjs/typeorm';
import { QuizResult } from 'src/entities/quizResult.entity';
import { Repository } from 'typeorm';

export default class QuizzesDataExportRepo {
  constructor(
    @InjectRepository(QuizResult)
    private quizzesDataExportRepository: Repository<QuizResult>,
  ) {}

  async getAllUserResults(userId: string): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizzesDataExportRepository.createQueryBuilder('result');
    return queryBuilder
      .leftJoin('result.user', 'user')
      .leftJoin('result.companyMember', 'companyMember')
      .leftJoin('result.company', 'company')
      .select([
        'result.answers',
        'result.id',
        'result.allQuestionsCount',
        'result.rightQuestionsCount',
        'user.id',
        'companyMember.id',
        'company.id',
      ])
      .where({ user: { id: userId } })
      .getMany();
  }

  async getMemberResults(
    memberId: string,
    companyId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizzesDataExportRepository.createQueryBuilder('result');
    return queryBuilder
      .leftJoin('result.user', 'user')
      .leftJoin('result.companyMember', 'companyMember')
      .leftJoin('result.company', 'company')
      .select([
        'result.answers',
        'result.id',
        'result.allQuestionsCount',
        'result.rightQuestionsCount',
        'user.id',
        'companyMember.id',
        'company.id',
      ])
      .where({ companyMember: { id: memberId } })
      .andWhere({ company: { id: companyId } })
      .getMany();
  }

  async getAllMembersResults(companyId: string): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizzesDataExportRepository.createQueryBuilder('result');
    return queryBuilder
      .leftJoin('result.user', 'user')
      .leftJoin('result.companyMember', 'companyMember')
      .leftJoin('result.company', 'company')
      .select([
        'result.answers',
        'result.id',
        'result.allQuestionsCount',
        'result.rightQuestionsCount',
        'user.id',
        'companyMember.id',
        'company.id',
      ])
      .where({ company: { id: companyId } })
      .getMany();
  }

  async getQuizResults(
    companyId: string,
    quizId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizzesDataExportRepository.createQueryBuilder('result');
    return queryBuilder
      .leftJoin('result.user', 'user')
      .leftJoin('result.companyMember', 'companyMember')
      .leftJoin('result.company', 'company')
      .select([
        'result.answers',
        'result.id',
        'result.allQuestionsCount',
        'result.rightQuestionsCount',
        'user.id',
        'companyMember.id',
        'company.id',
      ])
      .where({ company: { id: companyId } })
      .andWhere({ quiz: { id: quizId } })
      .getMany();
  }
}
