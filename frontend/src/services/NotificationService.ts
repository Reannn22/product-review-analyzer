/**
 * Notification service for frontend
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
  createdAt: Date;
}

export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: Array<(notifications: Notification[]) => void> = [];

  static addNotification(
    message: string,
    type: NotificationType = 'info',
    duration: number = 3000
  ): string {
    const id = `${Date.now()}-${Math.random()}`;
    const notification: Notification = {
      id,
      message,
      type,
      duration,
      createdAt: new Date(),
    };

    this.notifications.push(notification);
    this.emit();

    if (duration > 0) {
      setTimeout(() => this.removeNotification(id), duration);
    }

    return id;
  }

  static success(message: string, duration?: number): string {
    return this.addNotification(message, 'success', duration);
  }

  static error(message: string, duration?: number): string {
    return this.addNotification(message, 'error', duration || 5000);
  }

  static warning(message: string, duration?: number): string {
    return this.addNotification(message, 'warning', duration);
  }

  static info(message: string, duration?: number): string {
    return this.addNotification(message, 'info', duration);
  }

  static removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.emit();
  }

  static clear(): void {
    this.notifications = [];
    this.emit();
  }

  static subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static emit(): void {
    this.listeners.forEach((listener) => listener([...this.notifications]));
  }
}
