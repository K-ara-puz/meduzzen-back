import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ErrorHandler } from 'src/errorHandler/errorHandler.service';
import { ErrorHandlerModule } from 'src/errorHandler/errorHandler.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ErrorHandlerModule],
  controllers: [UsersController],
  providers: [UsersService, ErrorHandler],
})
export class UsersModule {}
