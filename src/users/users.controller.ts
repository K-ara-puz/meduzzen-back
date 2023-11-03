import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Post,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { ErrorHandler } from 'src/errorHandler/errorHandler.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MyLogger } from 'src/logger/logger.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private errorHandler: ErrorHandler,
  ) {}

  private logger = new MyLogger(UsersController.name);

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse> {
    limit = limit > 100 ? 100 : limit;
    const paginatedUsers = await this.usersService.paginate({ page, limit });
    return {
      status_code: HttpStatus.OK,
      detail: { users: paginatedUsers },
      result: 'working',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<generalResponse> {
    this.logger.toLog({ message: 'find one user controller' });
    const user = await this.usersService.findOne(id);
    if (!user) {
      this.errorHandler.notFoundException();
    } else {
      return {
        status_code: HttpStatus.OK,
        detail: { user: user },
        result: 'working',
      };
    }
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<generalResponse> {
    this.logger.toLog({ message: 'create user controller' });
    try {
      const createdUser = await this.usersService.create(user);
      return {
        status_code: HttpStatus.CREATED,
        detail: { user: createdUser },
        result: 'working',
      };
    } catch (e) {
      this.errorHandler.badRequest(e.message);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<generalResponse> {
    this.logger.toLog({ message: 'update user controller' });
    try {
      const updatedUser = await this.usersService.update(id, user);
      return {
        status_code: HttpStatus.OK,
        detail: { user: updatedUser },
        result: 'working',
      };
    } catch (e) {
      this.errorHandler.badRequest(e.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<any> {
    this.logger.toLog({ message: 'delete user controller' });
    const user = await this.usersService.findOne(id);
    if (!user) {
      this.errorHandler.notFoundException();
    }
    await this.usersService.delete(id);
    return {
      status_code: HttpStatus.OK,
      detail: { user: user },
      result: 'working',
    };
  }
}
