export enum NotificationType {
  CLASS_REMINDER = 'class_reminder',
  CLASS_CANCELLED = 'class_cancelled',
  MEMBERSHIP_EXPIRING = 'membership_expiring',
  MEMBERSHIP_EXPIRED = 'membership_expired',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  SUBSCRIPTION_PAUSED = 'subscription_paused',
  NEW_ROUTINE = 'new_routine',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  GOAL_COMPLETED = 'goal_completed',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  TRAINER_MESSAGE = 'trainer_message',
  BOOKING_CONFIRMED = 'booking_confirmed',
  WAITLIST_PROMOTED = 'waitlist_promoted',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data: any;
  actionUrl: string | null;
  actionLabel: string | null;
  read: boolean;
  readAt: string | null;
  emailSent: boolean;
  pushSent: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}
