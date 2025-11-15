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
import { Class } from '../../classes/entities/class.entity';
import { ClassSchedule } from '../../classes/entities/class-schedule.entity';

export enum BookingStatus {
  RESERVADO = 'RESERVADO',
  CANCELADO = 'CANCELADO',
  ASISTIDO = 'ASISTIDO',
  NO_ASISTIO = 'NO_ASISTIO',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Class, (cls) => cls.reservas)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @Column()
  classId: string;

  @ManyToOne(() => ClassSchedule)
  @JoinColumn({ name: 'scheduleId' })
  schedule: ClassSchedule;

  @Column()
  scheduleId: string;

  // Fecha específica de la clase (ej: 2025-11-18 para el próximo lunes)
  @Column({ type: 'date' })
  classDate: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.RESERVADO,
  })
  estado: BookingStatus;

  @Column({ nullable: true })
  posicionListaEspera: number;

  @Column({ type: 'boolean', default: false })
  enListaEspera: boolean;

  @Column({ type: 'boolean', default: false })
  reminder24hSent: boolean;

  @Column({ type: 'boolean', default: false })
  reminder2hSent: boolean;

  @CreateDateColumn()
  fechaReserva: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
