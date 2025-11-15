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

@Entity('progress_entries')
export class ProgressEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  fecha: Date;

  // Métricas de peso
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  peso: number; // kg

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grasaCorporal: number; // %

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  masaMuscular: number; // kg

  // Medidas corporales (en cm)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pecho: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cintura: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  caderas: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  brazoIzquierdo: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  brazoDerecho: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  piernaIzquierda: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  piernaDerecha: number;

  // Fotos
  @Column({ type: 'simple-array', nullable: true })
  fotos: string[]; // URLs de las fotos

  // Notas
  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
