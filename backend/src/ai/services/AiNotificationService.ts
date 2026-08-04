import { NotificationRepository } from '../../repositories/NotificationRepository';

export class AiNotificationService {
  private notificationRepository = new NotificationRepository();

  public async sendNotification(userId: string, title: string, message: string) {
    // Create an actionable, explainable notification
    await this.notificationRepository.create({
      recipientId: userId as any,
      title,
      message,
      type: 'system', // or we could add 'ai_alert' to the Notification model enum later
      isRead: false
    });
  }
}
