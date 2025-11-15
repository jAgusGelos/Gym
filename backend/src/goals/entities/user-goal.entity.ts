import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum GoalType {
  PERDER_PESO = 'PERDER_PESO',
  GANAR_PESO = 'GANAR_PESO',
  GANAR_MUSCULO = 'GANAR_MUSCULO',
  MEJORAR_RESISTENCIA = 'MEJORAR_RESISTENCIA',
  AUMENTAR_FUERZA = 'AUMENTAR_FUERZA',
  MEJORAR_FLEXIBILIDAD = 'MEJORAR_FLEXIBILIDAD',
  REDUCIR_GRASA = 'REDUCIR_GRASA',
  MANTENER_PESO = 'MANTENER_PESO',
  OTRO = 'OTRO',
}

export enum GoalStatus {
  ACTIVO = 'ACTIVO',
  COMPLETADO = 'COMPLETADO',
  ABANDONADO = 'ABANDONADO',
  PAUSADO = 'PAUSADO',
}

@Entity('user_goals')
export class UserGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: GoalType })
  tipo: GoalType;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Métricas objetivo
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pesoObjetivo: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grasaCorporalObjetivo: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  masaMuscularObjetivo: number;

  // Valores iniciales (para calcular progreso)
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pesoInicial: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grasaCorporalInicial: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  masaMuscularInicial: number;

  // Fechas
  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaObjetivo: Date;

  @Column({ type: 'date', nullable: true })
  fechaCompletado: Date;

  // Estado
  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ACTIVO })
  estado: GoalStatus;

  // Progreso calculado (0-100)
  @Column({ type: 'int', default: 0 })
  porcentajeProgreso: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
