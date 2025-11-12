import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('body_measurements')
@Index(['userId', 'measurementDate'])
export class BodyMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  @Index()
  measurementDate: Date;

  // Medidas básicas
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number; // Peso en kg

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  height: number; // Altura en cm

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  bmi: number; // IMC (calculado automáticamente)

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  bodyFatPercentage: number; // % de grasa corporal

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  muscleMassPercentage: number; // % de masa muscular

  // Medidas corporales en cm
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  neck: number; // Cuello

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  shoulders: number; // Hombros

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  chest: number; // Pecho

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  waist: number; // Cintura

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  hips: number; // Cadera

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  leftBicep: number; // Bícep izquierdo

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rightBicep: number; // Bícep derecho

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  leftForearm: number; // Antebrazo izquierdo

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rightForearm: number; // Antebrazo derecho

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  leftThigh: number; // Muslo izquierdo

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rightThigh: number; // Muslo derecho

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  leftCalf: number; // Pantorrilla izquierda

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rightCalf: number; // Pantorrilla derecha

  // Fotos de progreso
  @Column({ type: 'text', nullable: true })
  frontPhoto: string; // URL foto frontal

  @Column({ type: 'text', nullable: true })
  sidePhoto: string; // URL foto lateral

  @Column({ type: 'text', nullable: true })
  backPhoto: string; // URL foto espalda

  // Notas y observaciones
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Quien tomó las medidas (puede ser el usuario mismo o un entrenador)
  @Column({ nullable: true })
  measuredBy: string; // userId del que tomó las medidas

  @CreateDateColumn()
  createdAt: Date;
}
