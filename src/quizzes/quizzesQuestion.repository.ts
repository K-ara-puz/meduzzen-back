import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { IQuizQuestion } from './dto/create-companies-quiz.dto';
import { QuizQuestion } from '../entities/quizQuestion.entity';
import { IUpdateQuizQuestion } from './dto/update-company-quiz.dto';
import { QuizAnswer } from '../entities/quizAnswer.entity';
import { CompanyRoles } from 'src/utils/constants';

export default class QuizzesQuestionRepo {
  constructor(
    @InjectRepository(QuizQuestion)
    private quizQuestionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizAnswer)
    private quizAnswerRepository: Repository<QuizAnswer>,
  ) {}

  async getAllQuizQuestionsCount(quizId: string): Promise<number> {
    const queryBuilder =
      this.quizQuestionRepository.createQueryBuilder('question');
    return queryBuilder.where({ quiz: { id: quizId } }).getCount();
  }

  async getAllQuizQuestionsAndAnswers(quizId: string, role: string): Promise<QuizAnswer[]> {
    const queryBuilder = this.quizAnswerRepository.createQueryBuilder('answer');
    if (role === CompanyRoles.simpleUser) {
      return queryBuilder
        .leftJoin('answer.question', 'question')
        .leftJoin('question.quiz', 'quiz')
        .where('question.quiz = :quiz', { quiz: quizId })
        .select(['answer.id', 'answer.value', 'question'])
        .getMany();
    }
    return queryBuilder
      .leftJoinAndSelect('answer.question', 'question')
      .leftJoinAndSelect('question.quiz', 'quiz')
      .where('question.quiz = :quiz', { quiz: quizId })
      .getMany();
  }

  async getAllQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    const queryBuilder = this.quizQuestionRepository.createQueryBuilder('question');
    return queryBuilder
      .where('question.quiz = :quiz', { quiz: quizId })
      .getMany();
  }

  async create(
    question: IQuizQuestion | IUpdateQuizQuestion,
    quizId: string,
  ): Promise<QuizQuestion> {
    return this.quizQuestionRepository.save({
      ...question,
      quiz: { id: quizId },
    });
  }

  async delete(
    questionId: string,
  ): Promise<DeleteResult> {
    return this.quizQuestionRepository.delete({id: questionId})
  }
}
