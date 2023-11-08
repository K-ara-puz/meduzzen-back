import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import UserRepo from './users.repository';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let userService: UsersService;

  const existingUser = { firstName: '222', lastName: '222', email: 't@222.co' } as User;

  const mockedRepo = {
    findOne: jest.fn((id) => Promise.resolve(existingUser)),
    find: jest.fn(() => Promise.resolve(Array<User>)),
  };

  beforeAll( async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UserRepo,
        AuthService,
        Repository<User>,
        {
          provide: getRepositoryToken(User),
          useValue: mockedRepo,
        },
      ],
    }).compile();

    userService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('user CRUD', () => {
    it('should return user', async () => {
      let data = await userService.findOne(10);
      expect(data.detail).toEqual({...existingUser})
    });
    it('should return users[]', async () => {
      let data = await userService.findAll();
      expect(data.detail).toEqual(Array<User>)
    });
  });
});