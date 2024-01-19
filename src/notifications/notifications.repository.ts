import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification';
import { Repository } from 'typeorm';
import { INotification } from './interfaces/notification.interface';
import { NotificationsStatus } from 'src/utils/constants';

export default class NotificationsRepo {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async findAllUserNotifications(userId: string): Promise<Notification[]> {
    const queryBuilder =
      this.notificationsRepository.createQueryBuilder('notify');
    return queryBuilder.where({ user: { id: userId } }).orderBy('notify.created_at', 'DESC').getMany();
  }

  async findOneNotification(notificationId: string): Promise<Notification> {
    const queryBuilder =
      this.notificationsRepository.createQueryBuilder('notify');
    return queryBuilder
      .innerJoin('notify.user', 'user')
      .select([
        'notify.id',
        'notify.status',
        'notify.text',
        'notify.created_at',
        'user.id',
      ])
      .where('notify.id = :id', { id: notificationId })
      .getOne();
  }

  async create(data: INotification): Promise<Notification> {
    return this.notificationsRepository.save({
      ...data,
      status: NotificationsStatus.received,
      user: { id: data.userId },
    });
  }

  async updateStatus(notificationId: string, status: string): Promise<Notification> {
    return this.notificationsRepository.save({
      id: notificationId,
      status,
    });
  }
}
