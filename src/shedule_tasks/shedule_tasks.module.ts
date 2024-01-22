import { Module } from '@nestjs/common';
import { SheduleTasksService } from './shedule_tasks.service';
import { UsersModule } from 'src/users/users.module';
import QuizzesResultRepo from 'src/quizzes/quizzesResult.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizResult } from 'src/entities/quizResult.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([QuizResult])],
  providers: [SheduleTasksService, QuizzesResultRepo],
})
export class SheduleTasksModule {}
