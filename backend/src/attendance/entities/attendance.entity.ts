import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum CheckInType {
  QR = 'QR',
  MANUAL = 'MANUAL',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'timestamp' })
  horaEntrada: Date;

  @Column({ type: 'timestamp', nullable: true })
  horaSalida: Date;

  @Column({
    type: 'enum',
    enum: CheckInType,
    default: CheckInType.QR,
  })
  tipoCheckIn: CheckInType;

  @CreateDateColumn()
  createdAt: Date;
}
