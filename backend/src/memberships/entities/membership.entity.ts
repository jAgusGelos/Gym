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

export enum MembershipType {
  MENSUAL = 'MENSUAL',
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
}

export enum MembershipStatus {
  ACTIVA = 'ACTIVA',
  VENCIDA = 'VENCIDA',
  PENDIENTE = 'PENDIENTE',
  CANCELADA = 'CANCELADA',
}

export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  MERCADOPAGO = 'MERCADOPAGO',
}

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: MembershipType,
  })
  tipo: MembershipType;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaVencimiento: Date;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.PENDIENTE,
  })
  estado: MembershipStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  metodoPago: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
