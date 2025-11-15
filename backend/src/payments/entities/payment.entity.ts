import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Membership } from '../../memberships/entities/membership.entity';
import { PaymentMethod } from '../../memberships/entities/membership.entity';

export enum PaymentStatus {
  PAGADO = 'PAGADO',
  PENDIENTE = 'PENDIENTE',
  RECHAZADO = 'RECHAZADO',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Membership, { nullable: true })
  @JoinColumn({ name: 'membershipId' })
  membership: Membership;

  @Column({ nullable: true })
  membershipId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  metodoPago: PaymentMethod;

  @Column({ nullable: true })
  comprobante: string; // URL o número

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDIENTE,
  })
  estado: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;
}
