import { UploadService } from '../upload/upload.service';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import UserRepo from './users.repository';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import AuthRepo from '../auth/auth.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepo: UserRepo;
  let uploadService: UploadService;
  let authRepo: AuthRepo;

  let mockUser = {
    id: 'someid',
    firstName: 'Clementine',
    lastName: 'Bauch',
    email: 'clementine@gmail.com',
    password: 'clementine',
    avatar: 'someavatar.jpg',
  };
  const mockedAuthRepo = jest.fn(() => ({
    remove: jest.fn(() => {}),
  }));

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: Repository,
        },
        {
          provide: AuthRepo,
          useFactory: mockedAuthRepo,
        },
        UserRepo,
        UploadService,
        ConfigService,
      ],
    }).compile();

    usersService = module.get(UsersService);
    userRepo = module.get(UserRepo);
    uploadService = module.get(UploadService);
    authRepo = module.get(AuthRepo);
  });
  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
  it('should return users array', async () => {
    jest
      .spyOn(userRepo, 'findAll')
      .mockImplementation(async () => Promise.resolve([mockUser]));
    const { detail: users } = await usersService.findAll();
    expect(users).toEqual([mockUser]);
  });
  it('should return one founded user', async () => {
    jest
      .spyOn(userRepo, 'findOne')
      .mockImplementation(async () => Promise.resolve(mockUser));
    const { detail: user } = await usersService.findOne(mockUser.id);
    const { password, ...mockedUserWithoutPassword } = mockUser;
    expect(user).toEqual(mockedUserWithoutPassword);
  });
  it('should return error of not existing user', async () => {
    jest
      .spyOn(userRepo, 'findOne')
      .mockImplementation(async () => Promise.resolve(null));

    await expect(usersService.findOne(mockUser.id)).rejects.toThrow(
      new HttpException('user is not exist', HttpStatus.NOT_FOUND),
    );
  });
  it('should return one created user', async () => {
    jest
      .spyOn(userRepo, 'create')
      .mockImplementation(async () => Promise.resolve(mockUser));
    const { detail: user } = await usersService.create(mockUser);
    const { password, ...mockedUserWithoutPassword } = mockUser;
    expect(user).toEqual(mockedUserWithoutPassword);
  });
  it('should return one updated user', async () => {
    jest
      .spyOn(userRepo, 'findOne')
      .mockImplementation(async () => Promise.resolve(mockUser));
    jest
      .spyOn(userRepo, 'update')
      .mockImplementation(async () => Promise.resolve(mockUser));
    const { detail: user } = await usersService.update(mockUser.id, mockUser);
    const { password, ...mockedUserWithoutPassword } = mockUser;
    expect(user).toEqual(mockedUserWithoutPassword);
  });
  it('should return "ok" when delete user', async () => {
    jest
      .spyOn(userRepo, 'findOne')
      .mockImplementation(async () => Promise.resolve(mockUser));
    jest
      .spyOn(userRepo, 'delete')
      .mockImplementation(async () => Promise.resolve({ raw: '' }));
    jest
      .spyOn(authRepo, 'remove')
      .mockImplementation(async () => Promise.resolve({ raw: '' }));

    const { detail: user } = await usersService.delete(mockUser.id);
    const { password, ...mockedUserWithoutPassword } = mockUser;
    expect(user).toEqual(mockedUserWithoutPassword);
  });
  it('should return an error of undefined user when delete user', async () => {
    jest
      .spyOn(userRepo, 'findOne')
      .mockImplementation(async () => Promise.resolve(null));

    await expect(usersService.delete(mockUser.id)).rejects.toThrow(
      new HttpException('user is not exist', HttpStatus.NOT_FOUND),
    );
  });
});
