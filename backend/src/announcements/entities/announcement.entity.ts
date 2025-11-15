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

export enum AnnouncementType {
  NOVEDAD = 'NOVEDAD',
  EVENTO = 'EVENTO',
  PROMOCION = 'PROMOCION',
  MANTENIMIENTO = 'MANTENIMIENTO',
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({
    type: 'enum',
    enum: AnnouncementType,
  })
  tipo: AnnouncementType;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({ type: 'timestamp' })
  fechaPublicacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaExpiracion: Date;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'autorId' })
  autor: User;

  @Column()
  autorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
