import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/notifications.service';
import QuizzesResultRepo from 'src/quizzes/quizzesResult.repository';
import { SocketsGateway } from 'src/sockets/sockets.gateway';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SheduleTasksService {
  constructor(
    private usersService: UsersService,
    private quizzesResultsRepo: QuizzesResultRepo,
    private notificationsService: NotificationsService,
    private socket: SocketsGateway,
  ) {}
  @Cron('0 0 0 * * *')
  async handleCron(): Promise<void> {
    const { detail: users } = await this.usersService.findAll();
    users.forEach(async (user) => {
      const lastAttempts =
        await this.quizzesResultsRepo.findAllUserQuizzesListWithLastTryDate(
          user.id,
        );
      lastAttempts.forEach(async (attempt) => {
        const timeDifferenceInDays = Math.round(
          (new Date().getTime() - attempt.lastTryDate.getTime()) /
            (1000 * 3600 * 24),
        );
        if (timeDifferenceInDays > attempt['quiz_attemptsPerDay']) {
          const text = `You can already pass ${attempt['quiz_name']}`;
          await this.notificationsService.createUserCanPassQuizNotification({
            userId: user.id,
            text,
          });
          this.socket.handleUserCanPassQuizNotify(user.id, text);
        }
      });
    });
  }
}
