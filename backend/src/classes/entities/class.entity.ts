import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column()
  instructorId: string;

  @Column({ type: 'timestamp' })
  fechaHoraInicio: Date;

  @Column({ type: 'timestamp' })
  fechaHoraFin: Date;

  @Column()
  cupoMaximo: number;

  @Column({ default: 0 })
  cupoActual: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  imagenUrl: string;

  @OneToMany(() => Booking, (booking) => booking.class)
  reservas: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
