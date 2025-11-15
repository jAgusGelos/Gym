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
import { Achievement } from './achievement.entity';

@Entity('user_achievements')
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  achievementId: string;

  @ManyToOne(() => Achievement, { eager: true })
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  @Column({ type: 'int', default: 0 })
  progresoActual: number; // progreso del usuario hacia el objetivo

  @Column({ default: false })
  completado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fechaCompletado: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
