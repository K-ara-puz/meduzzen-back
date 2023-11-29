import {
  Body,
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiParam,ApiBody } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { MyAuthGuard } from '../auth/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @UseGuards(MyAuthGuard)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<User[]>> {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginate({ page, limit });
  }

  @Get(':id')
  @UseGuards(MyAuthGuard)
  async findOne(@Param('id') id: string): Promise<generalResponse<Partial<User>>> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(MyAuthGuard)
  @ApiParam({ name: "id", required: true, description: "user identifier" })
  @ApiBody({ type: [UpdateUserDto] })
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<generalResponse<Partial<User>>> {
    return this.usersService.update(id, user);
  }
  
  @Delete(':id')
  @UseGuards(MyAuthGuard)
  async delete(@Param('id') id: string): Promise<generalResponse<Partial<User>>> {
    return this.usersService.delete(id);
  }
}