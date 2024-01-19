import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import NotificationsRepo from './notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepo],
  exports: [NotificationsRepo]
})
export class NotificationsModule {}
