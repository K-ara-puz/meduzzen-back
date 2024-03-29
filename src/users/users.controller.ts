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
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { MyAuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserGuard } from './guards/user.guard';
import { PaginatedItems } from '../interfaces/PaginatedItems.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(MyAuthGuard)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<generalResponse<PaginatedItems<User[]>>> {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.paginate({ page, limit });
  }

  @Get(':id')
  @UseGuards(MyAuthGuard)
  async findOne(
    @Param('id') id: string,
  ): Promise<generalResponse<Partial<User>>> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', required: true, description: 'user identifier' })
  @ApiBody({ type: [UpdateUserDto] })
  @UseGuards(MyAuthGuard)
  @UseGuards(UserGuard)
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<generalResponse<Partial<User>>> {
    return this.usersService.update(id, user);
  }

  @Post('changeAvatar/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(MyAuthGuard)
  @UseGuards(UserGuard)
  async uploadFile(@Param('id') userId: string, 
  @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.changeUserAvatar(file, userId);
  }

  @Delete(':id')
  @UseGuards(MyAuthGuard)
  @UseGuards(UserGuard)
  async delete(
    @Param('id') id: string,
  ): Promise<generalResponse<Partial<User>>> {
    return this.usersService.delete(id);
  }
}
