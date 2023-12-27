import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { CreateQuizDto, IQuizQuestion } from './dto/create-companies-quiz.dto';
import { DeleteQuizDto } from './dto/delete-quiz.dto';
import { UpdateQuizDto } from './dto/update-company-quiz.dto';

interface IFindOneByName {
  name: string;
  companyId: string;
}

export default class QuizzesRepo {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async create(
    quiz: CreateQuizDto | UpdateQuizDto,
    companyId: string,
  ): Promise<Quiz> {
    return this.quizRepository.save({ ...quiz, company: { id: companyId } });
  }

  async findOneByName({
    name,
    companyId,
  }: IFindOneByName): Promise<Partial<Quiz>> {
    const queryBuilder = this.quizRepository.createQueryBuilder('quiz');
    return queryBuilder
      .leftJoinAndSelect('quiz.company', 'company')
      .where({ name })
      .andWhere({ company: { id: companyId } })
      .getOne();
  }

  async findOneById(quizId: string, companyId: string): Promise<Partial<Quiz>> {
    const queryBuilder = this.quizRepository.createQueryBuilder('quiz');
    return queryBuilder
      .leftJoinAndSelect('quiz.company', 'company')
      .where({ id: quizId })
      .andWhere({ company: { id: companyId } })
      .getOne();
  }

  async delete({ quizId, companyId }: DeleteQuizDto): Promise<DeleteResult> {
    const queryBuilder = this.quizRepository.createQueryBuilder('quiz');
    return queryBuilder
      .leftJoinAndSelect('quiz.company', 'company')
      .delete()
      .where({ id: quizId })
      .andWhere({ company: { id: companyId } })
      .execute();
  }
}
