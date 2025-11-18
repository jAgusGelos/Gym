import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationData } from '../types/notification-data.types';

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

@Entity('notifications')
@Index(['userId', 'read'])
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: NotificationData | null; // Datos adicionales (IDs, enlaces, etc.)

  @Column({ nullable: true })
  actionUrl: string; // URL para navegar al hacer clic

  @Column({ nullable: true })
  actionLabel: string; // Texto del botón de acción

  @Column({ default: false })
  @Index()
  read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ default: false })
  emailSent: boolean;

  @Column({ default: false })
  pushSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Fecha de expiración (opcional)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
