import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoutineExercise } from './routine-exercise.entity';

@Entity('workout_logs')
@Index(['userId', 'fecha'])
@Index(['routineExerciseId'])
export class WorkoutLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  routineExerciseId: string;

  @ManyToOne(() => RoutineExercise, { eager: true })
  @JoinColumn({ name: 'routineExerciseId' })
  routineExercise: RoutineExercise;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'int' })
  seriesCompletadas: number;

  @Column({ type: 'varchar', length: 100 })
  repeticionesRealizadas: string; // Array como string: "12,10,10,8"

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  pesoUtilizado: number;

  @Column({ type: 'int', nullable: true })
  duracionMinutos: number;

  @Column({ type: 'int', nullable: true })
  rpe: number; // Rate of Perceived Exertion (1-10)

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;
}
