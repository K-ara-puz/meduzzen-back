import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Post,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiParam,ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<object>> {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginate({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<generalResponse<object>> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<generalResponse<object>> {
    return this.usersService.create(user);
  }

  @Put(':id')
  @ApiParam({ name: "id", required: true, description: "user identifier" })
  @ApiBody({ type: [UpdateUserDto] })
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<generalResponse<object>> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<generalResponse<object>> {
    return this.usersService.delete(id);
  }
}
