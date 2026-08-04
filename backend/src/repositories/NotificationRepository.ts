import { Notification, INotification } from '../models/Notification';
import { BaseRepository } from './BaseRepository';

export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification);
  }

  async findByUserId(recipientId: string): Promise<INotification[]> {
    return await this.model.find({ recipientId }).sort({ createdAt: -1 }).exec();
  }

  async markAllAsRead(recipientId: string): Promise<void> {
    await this.model.updateMany({ recipientId, isRead: false }, { $set: { isRead: true } }).exec();
  }
}
