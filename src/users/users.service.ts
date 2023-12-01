import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { MyLogger } from '../logger/logger.service';
import UserRepo from './users.repository';
import { generalResponse } from '../interfaces/generalResponse.interface';
import { AuthService } from '../auth/auth.service';
import { ModuleRef } from '@nestjs/core';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userRepo: UserRepo,
    private moduleRef: ModuleRef,
    private readonly uploadService: UploadService
  ) {}

  private logger = new MyLogger(UsersService.name);

  async paginate(options: IPaginationOptions): Promise<generalResponse<User[]>> {
    try {
      const paginatedUsers = await paginate<User>(this.userRepository, options);
      return {
        status_code: HttpStatus.OK,
        detail: paginatedUsers.items,
        result: 'get paginated users',
      };
    } catch (error) {
      throw new HttpException(error, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<generalResponse<User[]>> {
    this.logger.toLog({ message: 'find all users service' });
    try {
      const users = await this.userRepo.findAll();
      return {
        status_code: HttpStatus.OK,
        detail: users,
        result: 'users was founded',
      }
    } catch (error) {
      throw new HttpException(error, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string): Promise<generalResponse<Partial<User>>> {
    this.logger.toLog({ message: 'find one user service' });
    try {
      let user = await this.userRepo.findOne(id);
      if (!user) throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);
      let { password, ...res } = user;
      return {
        status_code: HttpStatus.OK,
        detail: res,
        result: 'user was founded',
      };
    } catch (error) {
      throw new HttpException(error, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepo.findOneByEmail(email);
  }
  
  async create(user: CreateUserDto): Promise<generalResponse<Partial<User>>> {
    this.logger.toLog({ message: 'create user service' });
    try {
      const savedUser: CreateUserDto = await this.userRepo.create(user);
      let { password, ...res } = savedUser;
      return {
        status_code: HttpStatus.OK,
        detail: res,
        result: 'user was created',
      };
    } catch(error) {
      throw new HttpException(error, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, user: UpdateUserDto): Promise<generalResponse<Partial<User>>> {
    this.logger.toLog({ message: 'update user service' });
    try {
      const authService = this.moduleRef.get(AuthService, { strict: false });

      let foundedUser = await this.userRepo.findOne(id);
      if (!foundedUser) throw new HttpException('user not exist', HttpStatus.NOT_FOUND);
      const {password, ...res} = await this.userRepo.update(id, user);
      return {
        status_code: HttpStatus.OK,
        detail: res,
        result: 'user was updated',
      };
    } catch (error) {
      throw new HttpException(error, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeUserAvatar(file: Express.Multer.File, userId: string) {
    await this.uploadService.upload(file.originalname, file.buffer);
    const {password, ...result} = await this.userRepo.update(userId, {avatar: file.originalname});
    return result
  }

  async delete(id: string): Promise<generalResponse<Partial<User>>> {
    this.logger.toLog({ message: 'delete user service' });
    try {
      const {password, ...user} = await this.userRepo.findOne(id);
      if (!user) throw new HttpException('user is not exist', HttpStatus.NOT_FOUND);
      await this.userRepo.delete(id);
      return {
        status_code: HttpStatus.OK,
        detail: user,
        result: 'user was deleted',
      };
    } catch (error) {
      throw new HttpException(error, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}