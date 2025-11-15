import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { ClassSchedule } from './class-schedule.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  cupoMaximo: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  imagenUrl: string;

  @OneToMany(() => ClassSchedule, (schedule) => schedule.class, {
    cascade: true,
  })
  schedules: ClassSchedule[];

  @OneToMany(() => Booking, (booking) => booking.class)
  reservas: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
