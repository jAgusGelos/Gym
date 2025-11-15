import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Notification, NotificationType, NotificationPriority } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // Crear notificación
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createNotificationDto);
    return this.notificationRepository.save(notification);
  }

  // Crear notificación masiva (para múltiples usuarios)
  async createBulk(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      priority?: NotificationPriority;
      data?: any;
      actionUrl?: string;
      actionLabel?: string;
    },
  ): Promise<Notification[]> {
    const notifications = userIds.map((userId) =>
      this.notificationRepository.create({
        userId,
        type,
        title,
        message,
        priority: options?.priority || NotificationPriority.MEDIUM,
        data: options?.data,
        actionUrl: options?.actionUrl,
        actionLabel: options?.actionLabel,
      }),
    );

    return this.notificationRepository.save(notifications);
  }

  // Obtener notificaciones del usuario (paginadas)
  async findUserNotifications(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Notification>> {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.notificationRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Obtener notificaciones no leídas
  async findUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        userId,
        read: false,
      },
      order: { createdAt: 'DESC' },
      take: 50, // Limitar a 50 más recientes
    });
  }

  // Contar notificaciones no leídas
  async countUnread(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        userId,
        read: false,
      },
    });
  }

  // Marcar notificación como leída
  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    if (!notification.read) {
      notification.read = true;
      notification.readAt = new Date();
      await this.notificationRepository.save(notification);
    }

    return notification;
  }

  // Marcar todas como leídas
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      {
        userId,
        read: false,
      },
      {
        read: true,
        readAt: new Date(),
      },
    );
  }

  // Eliminar notificación
  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    await this.notificationRepository.remove(notification);
  }

  // Eliminar todas las notificaciones leídas
  async removeAllRead(userId: string): Promise<void> {
    await this.notificationRepository.delete({
      userId,
      read: true,
    });
  }

  // Limpiar notificaciones expiradas (cron job)
  async cleanExpiredNotifications(): Promise<void> {
    const now = new Date();
    await this.notificationRepository.delete({
      expiresAt: LessThan(now),
    });
  }

  // ==================== HELPERS PARA CREAR NOTIFICACIONES ESPECÍFICAS ====================

  async notifyClassReminder(userId: string, classData: any): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.CLASS_REMINDER,
      priority: NotificationPriority.MEDIUM,
      title: 'Recordatorio de Clase',
      message: `Tu clase "${classData.nombre}" comienza pronto`,
      data: { classId: classData.id },
      actionUrl: `/classes`,
      actionLabel: 'Ver Clase',
    });
  }

  async notifyMembershipExpiring(userId: string, daysRemaining: number): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.MEMBERSHIP_EXPIRING,
      priority: NotificationPriority.HIGH,
      title: 'Membresía por Vencer',
      message: `Tu membresía vence en ${daysRemaining} días. Renueva para seguir disfrutando.`,
      actionUrl: '/plans',
      actionLabel: 'Renovar Ahora',
    });
  }

  async notifyPaymentSuccess(
    userId: string,
    amount: number,
    planName: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.PAYMENT_SUCCESS,
      priority: NotificationPriority.MEDIUM,
      title: 'Pago Exitoso',
      message: `Tu pago de $${amount} para ${planName} fue procesado exitosamente.`,
      actionUrl: '/subscriptions',
      actionLabel: 'Ver Suscripciones',
    });
  }

  async notifySubscriptionRenewed(
    userId: string,
    planName: string,
    nextBillingDate: Date,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.SUBSCRIPTION_RENEWED,
      priority: NotificationPriority.LOW,
      title: 'Suscripción Renovada',
      message: `Tu suscripción ${planName} ha sido renovada. Próximo cargo: ${nextBillingDate.toLocaleDateString()}`,
      actionUrl: '/subscriptions',
      actionLabel: 'Ver Detalles',
    });
  }

  async notifyAchievementUnlocked(
    userId: string,
    achievementName: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.ACHIEVEMENT_UNLOCKED,
      priority: NotificationPriority.LOW,
      title: '🏆 ¡Logro Desbloqueado!',
      message: `Has desbloqueado el logro "${achievementName}"`,
      actionUrl: '/achievements',
      actionLabel: 'Ver Logros',
    });
  }

  async notifyNewRoutine(userId: string, routineName: string): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.NEW_ROUTINE,
      priority: NotificationPriority.MEDIUM,
      title: 'Nueva Rutina Asignada',
      message: `Tu entrenador te ha asignado una nueva rutina: "${routineName}"`,
      actionUrl: '/routines',
      actionLabel: 'Ver Rutina',
    });
  }

  async notifyWaitlistPromoted(userId: string, className: string): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.WAITLIST_PROMOTED,
      priority: NotificationPriority.HIGH,
      title: '¡Tienes Cupo!',
      message: `Te hemos confirmado un lugar en la clase "${className}"`,
      actionUrl: '/classes',
      actionLabel: 'Ver Mis Clases',
    });
  }
}
