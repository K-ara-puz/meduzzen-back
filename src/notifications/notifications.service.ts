import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { INotification } from './interfaces/notification.interface';
import NotificationsRepo from './notifications.repository';
import { NotificationsStatus } from 'src/utils/constants';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { Notification } from 'src/entities/notification';

@Injectable()
export class NotificationsService {
  constructor(private notificationsRepo: NotificationsRepo) {}

  async getAllUserNotifications(
    userId: string,
  ): Promise<generalResponse<Notification[]>> {
    try {
      const res = await this.notificationsRepo.findAllUserNotifications(userId);
      return {
        status_code: HttpStatus.OK,
        detail: res,
        result: 'user notifications list',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAddedCompanyQuizNotification(data: INotification): Promise<void> {
    try {
      await this.notificationsRepo.create(data);
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setViewedNotificationStatus(
    notificationId: string,
    userId: string,
  ): Promise<generalResponse<Notification>> {
    try {
      const notify =
        await this.notificationsRepo.findOneNotification(notificationId);
      if (notify.user.id != userId)
        throw new HttpException('FORBIDDEN RESOURCE', HttpStatus.FORBIDDEN);
      const createdNotify = await this.notificationsRepo.updateStatus(
        notificationId,
        NotificationsStatus.viewed,
      );
      return {
        status_code: HttpStatus.OK,
        detail: notify,
        result: 'user notification was updated',
      };
    } catch (error) {
      throw new HttpException(
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
