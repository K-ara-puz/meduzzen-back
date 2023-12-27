import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IQuizAnswer } from './dto/create-companies-quiz.dto';
import { QuizAnswer } from '../entities/quizAnswer.entity';
import { IUpdateQuizAnswer } from './dto/update-company-quiz.dto';

export default class QuizzesAnswerRepo {
  constructor(
    @InjectRepository(QuizAnswer)
    private quizAnswerRepository: Repository<QuizAnswer>,
  ) {}

  async create(
    answer: IQuizAnswer | IUpdateQuizAnswer,
    questionId: string,
  ): Promise<QuizAnswer> {
    return this.quizAnswerRepository.save({
      ...answer,
      question: { id: questionId },
    });
  }
}
