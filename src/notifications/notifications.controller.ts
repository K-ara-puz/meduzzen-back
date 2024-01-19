import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MyAuthGuard } from 'src/auth/auth.guard';
import { UserFromToken } from 'src/users/decorators/userFromToken.decorator';
import { User } from 'src/entities/user.entity';
import { generalResponse } from 'src/interfaces/generalResponse.interface';
import { Notification } from 'src/entities/notification';

@Controller('notifications')
@UseGuards(MyAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getAllUserNotifications(
    @UserFromToken() user: User,
  ): Promise<generalResponse<Notification[]>> {
    return this.notificationsService.getAllUserNotifications(user.id);
  }

  @Patch('/set-viewed-status/:id')
  async setViewedNotificationStatus(
    @Param('id') id: string,
    @UserFromToken() user: User,
  ): Promise<generalResponse<Notification>> {
    return this.notificationsService.setViewedNotificationStatus(id, user.id);
  }
}
