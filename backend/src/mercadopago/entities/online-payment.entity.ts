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
import { Membership } from '../../memberships/entities/membership.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROCESS = 'in_process',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

@Entity('online_payments')
export class OnlinePayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => MembershipPlan, { nullable: true })
  @JoinColumn({ name: 'planId' })
  plan: MembershipPlan;

  @Column({ nullable: true })
  planId: string;

  @ManyToOne(() => Membership, { nullable: true })
  @JoinColumn({ name: 'membershipId' })
  membership: Membership;

  @Column({ nullable: true })
  membershipId: string;

  // MercadoPago fields
  @Column({ unique: true })
  preferenceId: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  merchantOrderId: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentType: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
