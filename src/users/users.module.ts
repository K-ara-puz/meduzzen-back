import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import UserRepo from './users.repository';
import { UploadService } from 'src/upload/upload.service';
import { ParseTokenMiddleware } from '../utils/userFromToken.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserRepo, UploadService],
  exports: [
    UsersService,
    UserRepo,
    UsersModule,
    UploadService,
    TypeOrmModule.forFeature([User]),
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseTokenMiddleware).forRoutes('*');
  }
}
