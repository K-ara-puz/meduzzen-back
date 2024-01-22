import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
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

  async findLastQuizUserAttemptsForToday(
    quizId: string,
    userId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');

    const currentDay = new Date();
    return queryBuilder
      .orderBy('quiz_result.lastTryDate', 'DESC')
      .where({ quiz: { id: quizId } })
      .andWhere({ user: { id: userId } })
      .andWhere({
        lastTryDate: MoreThan(new Date(new Date().setUTCHours(0, 0, 0))),
      })
      .getMany();
  }

  async findAllUserQuizzesAttempts(userId: string): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .leftJoinAndSelect('quiz_result.quiz', 'quiz')
      .leftJoinAndSelect('quiz_result.user', 'user')
      .leftJoinAndSelect('quiz_result.companyMember', 'member')
      .select([
        'quiz_result.id',
        'quiz.id',
        'user.id',
        'user.firstName',
        'member.id',
        'quiz_result.allQuestionsCount',
        'quiz_result.rightQuestionsCount',
        'quiz_result.score',
        'quiz_result.lastTryDate',
      ])
      .where({ user: { id: userId } })
      .orderBy('quiz.id', 'DESC')
      .getMany();
  }

  async findAllCompanyMembersQuizzesAttempts(
    companyId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    const resultDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
    return queryBuilder
      .leftJoinAndSelect('quiz_result.quiz', 'quiz')
      .leftJoinAndSelect('quiz_result.user', 'user')
      .leftJoinAndSelect('quiz_result.companyMember', 'member')
      .select([
        'quiz_result.id',
        'quiz.id',
        'user.id',
        'user.firstName',
        'member.id',
        'quiz_result.allQuestionsCount',
        'quiz_result.rightQuestionsCount',
        'quiz_result.score',
        'quiz_result.lastTryDate',
      ])
      .where({ company: { id: companyId } })
      .andWhere({
        lastTryDate: MoreThan(
          `${resultDate.year}-${resultDate.month}-${
            resultDate.day - 7
          }  00:00:00`,
        ),
      })
      .andWhere({
        lastTryDate: LessThan(
          `${resultDate.year}-${resultDate.month}-${resultDate.day}  00:00:00`,
        ),
      })
      .orderBy('user.id', 'DESC')
      .getMany();
  }

  async findOneCompanyMemberQuizzesAttempts(
    companyId: string,
    memberId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .leftJoinAndSelect('quiz_result.quiz', 'quiz')
      .leftJoinAndSelect('quiz_result.user', 'user')
      .leftJoinAndSelect('quiz_result.companyMember', 'member')
      .select([
        'quiz_result.id',
        'quiz.id',
        'user.id',
        'member.id',
        'quiz_result.allQuestionsCount',
        'quiz_result.rightQuestionsCount',
        'quiz_result.score',
        'quiz_result.lastTryDate',
      ])
      .where({ company: { id: companyId } })
      .andWhere({ companyMember: { id: memberId } })
      .orderBy('quiz.id', 'DESC')
      .getMany();
  }

  async findAllCompanyMembersQuizzesListWithLastTryDate(
    companyId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .leftJoinAndSelect('quiz_result.company', 'company')
      .leftJoinAndSelect('quiz_result.companyMember', 'member')
      .select(['member.id'])
      .addSelect('MAX(quiz_result.lastTryDate)', 'lastTryDate')
      .where({ company: { id: companyId } })
      .groupBy('member.id')
      .getRawMany();
  }

  async findAllUserQuizzesListWithLastTryDate(
    userId: string,
  ): Promise<QuizResult[]> {
    const queryBuilder =
      this.quizResultRepository.createQueryBuilder('quiz_result');
    return queryBuilder
      .leftJoinAndSelect('quiz_result.quiz', 'quiz')
      .leftJoinAndSelect('quiz_result.company', 'company')
      .select(['quiz.id', 'quiz.name', 'quiz.attemptsPerDay', 'company.id'])
      .addSelect('MAX(quiz_result.lastTryDate)', 'lastTryDate')
      .where({ user: { id: userId } })
      .groupBy('quiz.id')
      .addGroupBy('company.id')
      .getRawMany();
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
