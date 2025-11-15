import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MembershipPlan } from './membership-plan.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export enum SubscriptionFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => MembershipPlan)
  @JoinColumn({ name: 'planId' })
  plan: MembershipPlan;

  @Column()
  planId: string;

  // MercadoPago subscription ID
  @Column({ unique: true, nullable: true })
  mercadopagoSubscriptionId: string;

  // MercadoPago preapproval ID (plan ID in MP)
  @Column({ nullable: true })
  mercadopagoPreapprovalId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.PENDING,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: SubscriptionFrequency,
  })
  frequency: SubscriptionFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  nextBillingDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'date', nullable: true })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancelReason: string;

  // Contador de pagos exitosos
  @Column({ type: 'int', default: 0 })
  successfulPayments: number;

  // Contador de pagos fallidos
  @Column({ type: 'int', default: 0 })
  failedPayments: number;

  // Último pago procesado
  @Column({ type: 'timestamp', nullable: true })
  lastPaymentDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
