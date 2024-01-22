import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import NotificationsRepo from './notifications.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepo],
  exports: [NotificationsRepo, NotificationsService]
})
export class NotificationsModule {}
