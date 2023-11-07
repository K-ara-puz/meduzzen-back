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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userRepo: UserRepo,
    private authService: AuthService,
  ) {}

  private logger = new MyLogger(UsersService.name);

  async paginate(options: IPaginationOptions): Promise<generalResponse> {
    const paginatedUsers = await paginate<User>(this.userRepository, options);
    return {
      status_code: HttpStatus.OK,
      detail: { users: paginatedUsers },
      result: 'get paginated users',
    };
  }

  async findAll(): Promise<User[]> {
    this.logger.toLog({ message: 'find all users service' });
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<generalResponse> {
    this.logger.toLog({ message: 'find one user service' });
    // let user: UpdateUserDto = await this.userRepo.findOne(id);
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else {
      return {
        status_code: HttpStatus.OK,
        detail: { foundedUser: user },
        result: 'user was founded',
      };
    }
  }

  async create(user: CreateUserDto) {
    this.logger.toLog({ message: 'create user service' });
    try {
    
      // console.log(123);
    
      const hashPass = await this.authService.getHashPass(user.password);
      let modifiedUser = {
        ...user,
        password: hashPass,
      };
      const savedUser: CreateUserDto = await this.userRepo.create(modifiedUser);
      let { password, ...res } = savedUser;
      // throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
      return {
        status_code: HttpStatus.OK,
        detail: { 'savedUser': res },
        result: 'user was created',
      };
    } catch(exception) {
        console.log(exception.message)
    }
    console.log('after try')

    // if (!savedUser) {
    //   throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    // } else {
    //   let { password, ...res } = savedUser;
    //   return {
    //     status_code: HttpStatus.OK,
    //     detail: { 'savedUser': res },
    //     result: 'user was created',
    //   };
    // }
  }

  async update(id: number, user: UpdateUserDto): Promise<generalResponse> {
    this.logger.toLog({ message: 'update user service' });
    const hashPass = await this.authService.getHashPass(user.password);
    let modifiedUser = {
      ...user,
      password: hashPass,
    };
    const updatedUser = await this.userRepo.update(id, modifiedUser);
    // console.log(updatedUser)
    if (!updatedUser) {
      throw new HttpException('bad request', HttpStatus.BAD_REQUEST);
    } else {
      return {
        status_code: HttpStatus.OK,
        detail: { 'updatedUser': updatedUser },
        result: 'user was updated',
      };
    }
  }

  async delete(id: number): Promise<generalResponse> {
    this.logger.toLog({ message: 'delete user service' });

    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepo.delete(id);
    return {
      status_code: HttpStatus.OK,
      detail: { deletedUser: user },
      result: 'user was deleted',
    };
  }
}
