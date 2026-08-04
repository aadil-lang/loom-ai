import { NotificationRepository } from '../../repositories/NotificationRepository';
import { INotification } from '../../models/Notification';
import { NotFoundError, ForbiddenError } from '../../errors/CustomErrors';

export class BuyerNotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async getNotifications(buyerId: string): Promise<INotification[]> {
    return await this.notificationRepository.findByUserId(buyerId);
  }

  async markAsRead(buyerId: string, notificationId: string): Promise<INotification> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) throw new NotFoundError('Notification not found');
    if (notification.recipientId.toString() !== buyerId) throw new ForbiddenError('Access denied');

    return await this.notificationRepository.update(notificationId, { isRead: true }) as INotification;
  }

  async markAllAsRead(buyerId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(buyerId);
  }

  async deleteNotification(buyerId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(notificationId);
    if (!notification) throw new NotFoundError('Notification not found');
    if (notification.recipientId.toString() !== buyerId) throw new ForbiddenError('Access denied');

    await this.notificationRepository.delete(notificationId);
  }
}
