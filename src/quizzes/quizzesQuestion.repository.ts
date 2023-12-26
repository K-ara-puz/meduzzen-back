import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQuizQuestion } from './dto/create-companies-quiz.dto';
import { QuizQuestion } from '../entities/quizQuestion.entity';
import { IUpdateQuizQuestion } from './dto/update-company-quiz.dto';

export default class QuizzesQuestionRepo {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizQuestionRepository: Repository<QuizQuestion>,
  ) {}

  async create(
    question: IQuizQuestion | IUpdateQuizQuestion,
    quizId: string,
  ): Promise<QuizQuestion> {
    return this.quizQuestionRepository.save({
      ...question,
      quiz: { id: quizId },
    });
  }
}
