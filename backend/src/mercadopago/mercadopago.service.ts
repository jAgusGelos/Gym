import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { MembershipPlan } from './entities/membership-plan.entity';
import { OnlinePayment, PaymentStatus } from './entities/online-payment.entity';
import { Membership, MembershipStatus, PaymentMethod } from '../memberships/entities/membership.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class MercadopagoService {
  private mercadoPagoClient: MercadoPagoConfig;
  private preferenceClient: Preference;

  constructor(
    @InjectRepository(MembershipPlan)
    private planRepository: Repository<MembershipPlan>,
    @InjectRepository(OnlinePayment)
    private paymentRepository: Repository<OnlinePayment>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    private configService: ConfigService,
  ) {
    // Initialize MercadoPago SDK
    const accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');

    if (!accessToken) {
      console.warn('MERCADOPAGO_ACCESS_TOKEN not configured. Payment features will be disabled.');
    } else {
      this.mercadoPagoClient = new MercadoPagoConfig({
        accessToken,
      });
      this.preferenceClient = new Preference(this.mercadoPagoClient);
    }
  }

  // ==================== PLANS ====================

  async createPlan(createPlanDto: CreatePlanDto): Promise<MembershipPlan> {
    const plan = this.planRepository.create(createPlanDto);
    return this.planRepository.save(plan);
  }

  async getAllPlans(): Promise<MembershipPlan[]> {
    return this.planRepository.find({
      where: { activo: true },
      order: { orden: 'ASC', precio: 'ASC' },
    });
  }

  async getPlanById(id: string): Promise<MembershipPlan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }
    return plan;
  }

  async updatePlan(id: string, updatePlanDto: UpdatePlanDto): Promise<MembershipPlan> {
    const plan = await this.getPlanById(id);
    Object.assign(plan, updatePlanDto);
    return this.planRepository.save(plan);
  }

  async deletePlan(id: string): Promise<void> {
    const plan = await this.getPlanById(id);
    plan.activo = false;
    await this.planRepository.save(plan);
  }

  // ==================== PAYMENTS ====================

  async createPreference(userId: string, planId: string) {
    if (!this.preferenceClient) {
      throw new BadRequestException('MercadoPago no está configurado');
    }

    const plan = await this.getPlanById(planId);
    const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

    // Create payment record
    const payment = this.paymentRepository.create({
      userId,
      planId,
      amount: plan.precio,
      status: PaymentStatus.PENDING,
    });

    try {
      // Create MercadoPago preference
      const preference = await this.preferenceClient.create({
        body: {
          items: [
            {
              id: plan.id,
              title: plan.nombre,
              description: plan.descripcion,
              quantity: 1,
              unit_price: Number(plan.precio),
              currency_id: 'ARS',
            },
          ],
          back_urls: {
            success: `${baseUrl}/payment/success`,
            failure: `${baseUrl}/payment/failure`,
            pending: `${baseUrl}/payment/pending`,
          },
          auto_return: 'approved',
          external_reference: userId,
          notification_url: `${this.configService.get<string>('BACKEND_URL')}/api/mercadopago/webhook`,
          metadata: {
            user_id: userId,
            plan_id: planId,
          },
        },
      });

      if (preference.id) {
        payment.preferenceId = preference.id;
      }
      payment.metadata = preference;
      await this.paymentRepository.save(payment);

      return {
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
      };
    } catch (error) {
      console.error('Error creating MercadoPago preference:', error);
      throw new BadRequestException('Error al crear la preferencia de pago');
    }
  }

  async handleWebhook(data: any) {
    try {
      const { type, data: paymentData } = data;

      if (type === 'payment') {
        const paymentId = paymentData.id;

        // Fetch payment details from MercadoPago
        // Note: You'll need to implement this using MercadoPago Payment API
        await this.processPayment(paymentId);
      }

      return { received: true };
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  private async processPayment(paymentId: string) {
    // This would fetch the payment from MercadoPago API
    // For now, we'll leave this as a placeholder
    // You'll need to implement the Payment API client from MercadoPago SDK
    console.log('Processing payment:', paymentId);
  }

  async approvePayment(preferenceId: string, paymentId: string, paymentData: any) {
    const payment = await this.paymentRepository.findOne({
      where: { preferenceId },
      relations: ['plan', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    // Update payment
    payment.paymentId = paymentId;
    payment.status = PaymentStatus.APPROVED;
    payment.approvedAt = new Date();
    payment.paymentType = paymentData.payment_type;
    payment.paymentMethod = paymentData.payment_method_id;
    payment.metadata = { ...payment.metadata, paymentData };

    await this.paymentRepository.save(payment);

    // Create or extend membership
    await this.createOrExtendMembership(payment);

    return payment;
  }

  private async createOrExtendMembership(payment: OnlinePayment) {
    const { userId, plan } = payment;

    // Check if user has an active membership
    const existingMembership = await this.membershipRepository.findOne({
      where: { userId },
      order: { fechaVencimiento: 'DESC' },
    });

    const now = new Date();
    const startDate = existingMembership && existingMembership.fechaVencimiento > now
      ? existingMembership.fechaVencimiento
      : now;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.duracionDias);

    // Create new membership
    const membership = this.membershipRepository.create({
      userId,
      tipo: plan.tipo,
      fechaInicio: startDate,
      fechaVencimiento: endDate,
      estado: MembershipStatus.ACTIVA,
      precio: plan.precio,
      metodoPago: PaymentMethod.MERCADOPAGO,
      notas: `Pago online - Preference ID: ${payment.preferenceId}`,
    });

    const savedMembership = await this.membershipRepository.save(membership);

    // Link payment to membership
    payment.membershipId = savedMembership.id;
    await this.paymentRepository.save(payment);

    return savedMembership;
  }

  async getUserPayments(userId: string): Promise<OnlinePayment[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['plan', 'membership'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllPayments(): Promise<OnlinePayment[]> {
    return this.paymentRepository.find({
      relations: ['user', 'plan', 'membership'],
      order: { createdAt: 'DESC' },
    });
  }
}
