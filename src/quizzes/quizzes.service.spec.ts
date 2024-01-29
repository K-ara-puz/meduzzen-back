import { Test } from '@nestjs/testing';
import { QuizzesService } from './quizzes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quiz } from '../entities/quiz.entity';
import { Repository } from 'typeorm';
import QuizzesRepo from './quizzes.repository';
import QuizzesQuestionRepo from './quizzesQuestion.repository';
import QuizzesAnswerRepo from './quizzesAnswer.repository';
import QuizzesResultRepo from './quizzesResult.repository';
import { CompaniesMembersService } from '../companies-members/companies-members.service';
import { RedisService } from '../redis/redis.service';
import { SocketsGateway } from '../sockets/sockets.gateway';
import { NotificationsService } from '../notifications/notifications.service';
import { CompaniesService } from '../companies/companies.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('QuizzesService', () => {
  let quizzesService: QuizzesService;
  let quizzesRepo: QuizzesRepo;
  let quizzesResultRepo: QuizzesResultRepo;
  let quizQuestionsRepo: QuizzesQuestionRepo;
  let quizzesAnswersRepo: QuizzesAnswerRepo;
  let companyMembersService: CompaniesMembersService;
  let notifyService: NotificationsService;
  let socketsService: SocketsGateway;

  let quiz = {
    id: 'someid',
    company: { id: 'someid' },
    name: 'Math quiz',
    description: 'Easy math quiz',
    attemptsPerDay: 1,
    questions: [
      {
        name: '1 + 7 = ?',
        id: '',
        quiz: { id: '' },
        answers: [
          {
            value: '3',
            isRight: false,
            id: '',
          },
          {
            value: '8',
            isRight: true,
            id: '',
          },
          {
            value: '10',
            isRight: false,
            id: '',
          },
        ],
      },
      {
        name: '3 - 4 = ?',
        id: '',
        quiz: { id: '' },
        answers: [
          {
            value: '-1',
            isRight: true,
            id: '',
          },
          {
            value: '0',
            isRight: false,
            id: '',
          },
          {
            value: '10 - (1 * 11)',
            isRight: true,
            id: '',
          },
        ],
      },
    ],
  };
  let companyMember = {
    id: 'companyMemberId',
    user: {
      id: 'userId',
    },
  };
  let startQuizDto = {
    answers: [
      { questionId: 'question1', answersId: ['answer1', 'answer2'] },
      { questionId: 'question2', answersId: ['answer3'] },
    ],
  };
  let quizRating = {
    rightQuestionsCount: 1,
    allQuestionsCount: 2,
    answers: JSON.stringify([
      {
        questionId: 'question1',
        answerId: ['answer1', 'answer2'],
        answerScore: -2,
      },
      { questionId: 'question2', answerId: ['answer3'], answerScore: 1 },
    ]),
  };
  let quizResult = {
    id: 'quizId',
    name: 'quizName',
    desciption: '',
    attemptsPerDay: 2,
    company: { id: 'companyId' },
    lastTryDate: new Date(),
    allQuestionsCount: 1,
    rightQuestionsCount: 1,
    score: 1,
    user: {},
    companyMember: {},
    quiz: {},
    answers: quizRating.answers,
  };
  class mockedQuizzesRepo {
    findOneById = jest.fn(async () => Promise.resolve(quiz));
    findOneByName = jest.fn(() => {});
    create = jest.fn(async () => Promise.resolve(quiz));
    delete = jest.fn(() => {});
  }
  class mockedQuizQuestionsRepo {
    getAllQuizQuestions = jest.fn(async () => Promise.resolve(quiz.questions));
    getAllQuizQuestionsCount = jest.fn(async () => Promise.resolve(2));
    create = jest.fn(async () => Promise.resolve(quiz.questions[0]));
    delete = jest.fn(() => {});
  }
  class mockedQuizAnswersRepo {
    create = jest.fn(() => {});
    findAllByQuestionId = jest.fn(async () =>
      Promise.resolve(startQuizDto.answers),
    );
  }
  class mockedQuizResultsRepo {
    create = jest.fn(async () => Promise.resolve(quizResult));
    findLastQuizUserAttemptsForToday = jest.fn(async () => Promise.resolve([]));
  }
  class mockedCompanyService {
    findOne = jest.fn(async () =>
      Promise.resolve({
        detail: {
          ...quiz.company,
          name: 'companyName',
        },
      }),
    );
  }
  class mockedCompanyMembersService {
    getCompanyMembers = jest.fn(async () =>
      Promise.resolve({
        detail: {
          items: [companyMember, companyMember],
        },
      }),
    );
    findOne = jest.fn(async () =>
      Promise.resolve({
        detail: companyMember,
      }),
    );
  }
  class mockedNotifyService {
    createAddedCompanyQuizNotification = jest.fn(() => {});
  }
  class mockedSocketsService {
    handleAddQuizInCompany = jest.fn(() => {});
  }
  class mockedRedisService {
    setQuizResult = jest.fn(() => {});
  }

  const mockedPaginateFunc = (items) =>
    Promise.resolve({
      items,
      totalItemsCount: items.length,
      meta: {
        itemCount: 0,
        itemsPerPage: 0,
        currentPage: 0,
      },
    });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizzesService,
        {
          provide: getRepositoryToken(Quiz),
          useClass: Repository,
        },
        {
          provide: QuizzesRepo,
          useClass: mockedQuizzesRepo,
        },
        {
          provide: QuizzesQuestionRepo,
          useClass: mockedQuizQuestionsRepo,
        },
        {
          provide: QuizzesAnswerRepo,
          useClass: mockedQuizAnswersRepo,
        },
        {
          provide: QuizzesResultRepo,
          useClass: mockedQuizResultsRepo,
        },
        {
          provide: CompaniesService,
          useClass: mockedCompanyService,
        },
        {
          provide: CompaniesMembersService,
          useClass: mockedCompanyMembersService,
        },
        {
          provide: RedisService,
          useClass: mockedRedisService,
        },
        {
          provide: SocketsGateway,
          useClass: mockedSocketsService,
        },
        {
          provide: NotificationsService,
          useClass: mockedNotifyService,
        },
      ],
    }).compile();

    quizzesService = module.get(QuizzesService);
    quizzesRepo = module.get(QuizzesRepo);
    notifyService = module.get(NotificationsService);
    companyMembersService = module.get(CompaniesMembersService);
    socketsService = module.get(SocketsGateway);
    quizQuestionsRepo = module.get(QuizzesQuestionRepo);
    quizzesAnswersRepo = module.get(QuizzesAnswerRepo);
    quizzesResultRepo = module.get(QuizzesResultRepo);
  });
  it('it should return founded quizzes array', async () => {
    jest
      .spyOn(quizzesService, 'paginateQuizzes')
      .mockImplementation(() => mockedPaginateFunc([quiz]));
    const { detail: foundedQuizzes } =
      await quizzesService.findAllCompanyQuizzes(
        { page: 1, limit: 10 },
        quiz.company.id,
      );
    expect(foundedQuizzes.items[0]).toEqual(quiz);
  });
  it('it should return founded quiz', async () => {
    const { detail: foundedQuiz } = await quizzesService.findOneCompanyQuiz(
      quiz.company.id,
      quiz.id,
    );
    expect(foundedQuiz).toEqual(quiz);
  });
  it('it should return quiz questions', async () => {
    const { detail: foundedQuetions } = await quizzesService.findQuizQuestions(
      quiz.id,
    );
    expect(foundedQuetions).toEqual(quiz.questions);
  });
  it('it should return created quiz', async () => {
    jest
      .spyOn(quizzesService, 'notifyUsersAfterQuizAdded')
      .mockImplementation(async () => Promise.resolve());
    const { detail: createdQuiz } = await quizzesService.create(
      quiz,
      quiz.company.id,
      'someid',
    );
    expect(createdQuiz).toEqual(quiz);
  });
  it('it should notify user after quiz added', async () => {
    const companyMembers = [companyMember, companyMember];
    const paginatedCompanyMembers = await mockedPaginateFunc(companyMembers);
    jest
      .spyOn(companyMembersService, 'getCompanyMembers')
      .mockImplementation(async () =>
        Promise.resolve({
          status_code: 200,
          detail: paginatedCompanyMembers,
          result: '',
        }),
      );
    await quizzesService.notifyUsersAfterQuizAdded(
      quiz.company.id,
      'initiatorId',
      quiz.name,
    );
    expect(
      notifyService.createAddedCompanyQuizNotification,
    ).toHaveBeenCalledTimes(companyMembers.length);
    expect(socketsService.handleAddQuizInCompany).toHaveBeenCalled();
  });
  it('it should return updated quiz', async () => {
    const { detail: updatedQuiz } = await quizzesService.update(
      quiz,
      quiz.company.id,
    );
    expect(updatedQuiz).toEqual(quiz);
  });
  it('it should return "ok" after delete quiz', async () => {
    const { status_code } = await quizzesService.delete({
      quizId: quiz.id,
      companyId: quiz.company.id,
    });
    expect(status_code).toEqual(HttpStatus.OK);
  });
  it('it should return quiz result', async () => {
    jest
      .spyOn(quizzesService, 'findOneCompanyQuiz')
      .mockImplementation(async () =>
        Promise.resolve({
          status_code: HttpStatus.OK,
          detail: quiz,
          result: '',
        }),
      );
    jest
      .spyOn(quizzesService, 'getQuizRating')
      .mockImplementation(async () => Promise.resolve(quizRating));
    const { detail: quizRes } = await quizzesService.startQuiz(
      quiz.id,
      quiz.company.id,
      'userId',
      startQuizDto,
    );
    expect(quizRes).toEqual(quizResult);
  });
  it('it should return quiz rating', async () => {
    jest
      .spyOn(quizzesAnswersRepo, 'findAllByQuestionId')
      .mockImplementation(async () =>
        Promise.resolve([
          { id: 'answer3', value: '1v', isRight: true },
          { id: 'answer2', value: '2v', isRight: false },
        ]),
      );
    const rating = await quizzesService.getQuizRating(startQuizDto, quiz.id);
    expect(rating).toEqual(quizRating);
  });
  it('it should return an error about not existed quiz when find one', async () => {
    jest.spyOn(quizzesRepo, 'findOneById').mockReturnValue(null);
    expect(
      quizzesService.findOneCompanyQuiz(quiz.company.id, 'id'),
    ).rejects.toThrow('quiz is not exist');
  });
  it('it should return an error about not existed quiz when find quiz questions', async () => {
    jest.spyOn(quizQuestionsRepo, 'getAllQuizQuestions').mockReturnValue(null);
    expect(quizzesService.findQuizQuestions(quiz.id)).rejects.toThrow(
      'quiz is not exist',
    );
  });
  it('it should return an error about already existed quiz when create', async () => {
    jest
      .spyOn(quizzesRepo, 'findOneByName')
      .mockReturnValue(Promise.resolve({}));
    expect(
      quizzesService.create(quiz, quiz.company.id, 'someid'),
    ).rejects.toThrow('quiz with this name already exist');
  });
  it('it should return an error about not existed quiz when update', async () => {
    jest.spyOn(quizzesRepo, 'findOneById').mockReturnValue(null);
    expect(quizzesService.update(quiz, quiz.company.id)).rejects.toThrow(
      'quiz is not exist',
    );
  });
  it('it should return an error about limit of quiz attempts per day', async () => {
    jest
      .spyOn(quizzesResultRepo, 'findLastQuizUserAttemptsForToday')
      .mockImplementation(async () =>
        Promise.resolve([quizResult, quizResult]),
      );
    expect(
      quizzesService.startQuiz(
        quiz.id,
        quiz.company.id,
        'userId',
        startQuizDto,
      ),
    ).rejects.toThrow('You can pass quiz only 1 time per day');
  });
});
