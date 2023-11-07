import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { HttpStatus } from '@nestjs/common';
import UserRepo from './users.repository';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { TestBed } from '@automock/jest';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

describe('UsersService', () => {
  let userService: UsersService;
  let userController: UsersController;
  let userRepository: Repository<User>;
  // let userRepo: UserRepo;
  // let authService: AuthService;

  // const mockUserRepository = {
  //   save: jest.fn(),
  //   find: jest.fn(),
  //   findOne: jest.fn(),
  //   delete: jest.fn(),
  // };

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //     UsersService,
  //     UserRepo,
  //     AuthService,
  //     {
  //       provide: getRepositoryToken(User),
  //       useClass: Repository
  //     }],
  //     controllers: [UsersController]
  //   }).compile();

  //   userService = await module.resolve<UsersService>(UsersService);
  //   userController = await module.resolve<UsersController>(UsersController);
  //   userRepository = await module.resolve<Repository<User>>(getRepositoryToken(User))
  // });

  let userRepositoryToken: string | Function = getRepositoryToken(User);

  beforeAll( async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
          AppModule,
          TypeOrmModule.forFeature([User])
      ],
      providers: [
          UsersService,
          UserRepo,
          AuthService,
          {
              provide: userRepositoryToken,
              useValue: userRepository,
          },
          ConfigService,
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  describe('findAOne', () => {
    it('should return an array of users', async () => {
      // const resultT =  {'status_code': HttpStatus.OK, 'detail': {}, 'result': 'working'};
      const existingUser = { firstName: '222', lastName: '222', email: 't@222.co' } as User;
      // jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(existingUser);
      // const result = await userService.findOne(15);
      // expect(result).toHaveBeenCalled(1);
      // expect(userRepository.findOne).toBeCalledTimes(1);

      // userRepo.findOne.mockResolvedValue(() => existingUser);
      // const userRepoFindOneSpy = jest.spyOn(userRepository, 'find');
      // const userRepositoryFindOneSpy = jest.spyOn(userRepository, 'findOne');
      // let t = await userService.findAll();

      // expect(userRepoFindOneSpy).toBeCalledTimes(1);
      // expect(t).toBeCalledTimes(1);
    });
  });
  // it('findOne', () => {});
  // it('update', () => {});
  // it('delete', () => {});
});