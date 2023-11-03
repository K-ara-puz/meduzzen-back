import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { User } from '../entities/user.entity';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private logger = new MyLogger(UsersService.name);

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  async findAll(): Promise<User[]> {
    this.logger.toLog({ message: 'find all users service' });
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    this.logger.toLog({ message: 'find one user service' });
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: CreateUserDto): Promise<User> {
    this.logger.toLog({ message: 'create user service' });
    const hashPass = await bcrypt.hash(user.password, 10);
    let modifiedUser = {
      ...user,
      password: hashPass,
    };
    return this.userRepository.save(modifiedUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    this.logger.toLog({ message: 'update user service' });
    const hashPass = await bcrypt.hash(user.password, 10);
    let modifiedUser = {
      ...user,
      password: hashPass,
    };
    await this.userRepository.update(id, modifiedUser);
    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    this.logger.toLog({ message: 'delete user service' });
    await this.userRepository.delete(id);
  }
}
