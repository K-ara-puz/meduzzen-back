import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let userService: UsersService;
  let userController: UsersController

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
      UsersService,
      {
        provide: getRepositoryToken(User),
        useValue: mockUserRepository,
      }],
      controllers: [UsersController]
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userController = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // let t = await userService.findAll();
      // console.log(t, "TTTTTT")
      const result =  {'status_code': HttpStatus.OK, 'detail': {}, 'result': 'working'};
      jest.spyOn(userService, 'findAll').mockImplementation(() => Promise.resolve([]));
      expect(await userController.findAll()).toBe(result)
    });
  });
  // it('findOne', () => {});
  // it('update', () => {});
  // it('delete', () => {});
});