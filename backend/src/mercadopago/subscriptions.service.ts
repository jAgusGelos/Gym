import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Subscription, SubscriptionStatus, SubscriptionFrequency } from './entities/subscription.entity';
import { Membership, MembershipStatus, MembershipType, PaymentMethod } from '../memberships/entities/membership.entity';
import { MembershipPlan } from './entities/membership-plan.entity';
import { OnlinePayment, PaymentStatus } from './entities/online-payment.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(MembershipPlan)
    private planRepository: Repository<MembershipPlan>,
    @InjectRepository(OnlinePayment)
    private paymentRepository: Repository<OnlinePayment>,
    private configService: ConfigService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  // Crear suscripción
  async createSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const { planId, frequency, startDate } = createSubscriptionDto;

    // Verificar que el plan existe
    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }

    // Verificar si el usuario ya tiene una suscripción activa
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('Ya tienes una suscripción activa');
    }

    // Calcular precio según frecuencia
    const amount = this.calculateSubscriptionPrice(plan.precio, frequency);

    // Crear suscripción
    const subscription = this.subscriptionRepository.create({
      userId,
      planId,
      frequency,
      amount,
      status: SubscriptionStatus.PENDING,
      startDate: startDate ? new Date(startDate) : new Date(),
      nextBillingDate: this.calculateNextBillingDate(
        startDate ? new Date(startDate) : new Date(),
        frequency,
      ),
    });

    return this.subscriptionRepository.save(subscription);
  }

  // Obtener suscripciones del usuario
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener suscripción activa del usuario
  async getActiveSubscription(userId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
    });
  }

  // Obtener suscripción por ID
  async getSubscriptionById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['plan', 'user'],
    });

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada');
    }

    return subscription;
  }

  // Activar suscripción (después de confirmar pago)
  async activateSubscription(id: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (subscription.status === SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('La suscripción ya está activa');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.startDate = new Date();
    subscription.nextBillingDate = this.calculateNextBillingDate(
      subscription.startDate,
      subscription.frequency,
    );

    return this.subscriptionRepository.save(subscription);
  }

  // Procesar pago recurrente exitoso
  async processRecurringPayment(
    subscriptionId: string,
    paymentId: string,
    amount: number,
  ): Promise<{ subscription: Subscription; membership: Membership }> {
    const subscription = await this.getSubscriptionById(subscriptionId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('La suscripción no está activa');
    }

    // Incrementar contador de pagos exitosos
    subscription.successfulPayments++;
    subscription.lastPaymentDate = new Date();
    subscription.nextBillingDate = this.calculateNextBillingDate(new Date(), subscription.frequency);
    subscription.failedPayments = 0; // Resetear contador de fallos

    await this.subscriptionRepository.save(subscription);

    // Crear o renovar membresía
    const membership = await this.createOrRenewMembership(
      subscription.userId,
      subscription.planId,
      subscription.frequency,
    );

    // Crear registro de pago
    await this.paymentRepository.save({
      userId: subscription.userId,
      planId: subscription.planId,
      membershipId: membership.id,
      paymentId,
      status: PaymentStatus.APPROVED,
      amount,
      approvedAt: new Date(),
      metadata: { subscriptionId, recurring: true },
    } as any);

    // Enviar notificaciones
    try {
      await this.notificationsService.notifyPaymentSuccess(
        subscription.userId,
        amount,
        subscription.plan.nombre,
      );

      await this.notificationsService.notifySubscriptionRenewed(
        subscription.userId,
        subscription.plan.nombre,
        subscription.nextBillingDate,
      );
    } catch (error) {
      console.error('Error sending notifications:', error);
      // No fallar el proceso de pago por errores de notificación
    }

    return { subscription, membership };
  }

  // Procesar pago recurrente fallido
  async processFailedPayment(subscriptionId: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(subscriptionId);

    subscription.failedPayments++;

    // Si hay más de 3 pagos fallidos, pausar la suscripción
    if (subscription.failedPayments >= 3) {
      subscription.status = SubscriptionStatus.PAUSED;
    }

    return this.subscriptionRepository.save(subscription);
  }

  // Cancelar suscripción
  async cancelSubscription(
    id: string,
    userId: string,
    cancelReason?: string,
  ): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (subscription.userId !== userId) {
      throw new BadRequestException('No tienes permiso para cancelar esta suscripción');
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('La suscripción ya está cancelada');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    subscription.endDate = new Date();
    subscription.cancelReason = cancelReason || null;

    return this.subscriptionRepository.save(subscription);
  }

  // Pausar suscripción
  async pauseSubscription(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (subscription.userId !== userId) {
      throw new BadRequestException('No tienes permiso para pausar esta suscripción');
    }

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Solo se pueden pausar suscripciones activas');
    }

    subscription.status = SubscriptionStatus.PAUSED;

    return this.subscriptionRepository.save(subscription);
  }

  // Reanudar suscripción
  async resumeSubscription(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (subscription.userId !== userId) {
      throw new BadRequestException('No tienes permiso para reanudar esta suscripción');
    }

    if (subscription.status !== SubscriptionStatus.PAUSED) {
      throw new BadRequestException('Solo se pueden reanudar suscripciones pausadas');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.nextBillingDate = this.calculateNextBillingDate(new Date(), subscription.frequency);

    return this.subscriptionRepository.save(subscription);
  }

  // ==================== HELPERS ====================

  private calculateSubscriptionPrice(basePrice: number, frequency: SubscriptionFrequency): number {
    switch (frequency) {
      case SubscriptionFrequency.MONTHLY:
        return basePrice;
      case SubscriptionFrequency.QUARTERLY:
        return basePrice * 3 * 0.95; // 5% descuento
      case SubscriptionFrequency.BIANNUAL:
        return basePrice * 6 * 0.9; // 10% descuento
      case SubscriptionFrequency.ANNUAL:
        return basePrice * 12 * 0.85; // 15% descuento
      default:
        return basePrice;
    }
  }

  private calculateNextBillingDate(
    currentDate: Date,
    frequency: SubscriptionFrequency,
  ): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case SubscriptionFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case SubscriptionFrequency.QUARTERLY:
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case SubscriptionFrequency.BIANNUAL:
        nextDate.setMonth(nextDate.getMonth() + 6);
        break;
      case SubscriptionFrequency.ANNUAL:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  private async createOrRenewMembership(
    userId: string,
    planId: string,
    frequency: SubscriptionFrequency,
  ): Promise<Membership> {
    const plan = await this.planRepository.findOne({ where: { id: planId } });

    // Buscar membresía activa del usuario
    const existingMembership = await this.membershipRepository.findOne({
      where: {
        userId,
        estado: MembershipStatus.ACTIVA,
      },
      order: { fechaVencimiento: 'DESC' },
    });

    const now = new Date();
    let fechaInicio: Date;
    let fechaVencimiento: Date;

    if (existingMembership && new Date(existingMembership.fechaVencimiento) > now) {
      // Extender desde la fecha de vencimiento actual
      fechaInicio = new Date(existingMembership.fechaVencimiento);
      fechaVencimiento = this.calculateNextBillingDate(fechaInicio, frequency);
    } else {
      // Nueva membresía desde hoy
      fechaInicio = now;
      fechaVencimiento = this.calculateNextBillingDate(now, frequency);
    }

    // Determinar tipo de membresía según frecuencia
    let tipo: MembershipType;
    switch (frequency) {
      case SubscriptionFrequency.MONTHLY:
        tipo = MembershipType.MENSUAL;
        break;
      case SubscriptionFrequency.QUARTERLY:
        tipo = MembershipType.TRIMESTRAL;
        break;
      case SubscriptionFrequency.BIANNUAL:
        tipo = MembershipType.SEMESTRAL;
        break;
      case SubscriptionFrequency.ANNUAL:
        tipo = MembershipType.ANUAL;
        break;
      default:
        tipo = MembershipType.MENSUAL;
    }

    // Crear nueva membresía
    const membership = this.membershipRepository.create({
      userId,
      tipo,
      fechaInicio,
      fechaVencimiento,
      estado: MembershipStatus.ACTIVA,
      precio: this.calculateSubscriptionPrice(plan.precio, frequency),
      metodoPago: PaymentMethod.MERCADOPAGO,
      notas: `Renovación automática - Suscripción ${frequency}`,
    });

    return this.membershipRepository.save(membership);
  }

  // Obtener suscripciones que deben renovarse (para cron job)
  async getSubscriptionsForRenewal(): Promise<Subscription[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.status = :status', { status: SubscriptionStatus.ACTIVE })
      .andWhere('subscription.nextBillingDate <= :today', { today })
      .getMany();
  }
}
