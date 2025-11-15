import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { WorkoutLog } from './workout-log.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('exercise_sets')
export class ExerciseSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workoutLogId: string;

  @ManyToOne(() => WorkoutLog, (log) => log.sets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workoutLogId' })
  workoutLog: WorkoutLog;

  @Column()
  exerciseId: string;

  @ManyToOne(() => Exercise, { eager: true })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column({ type: 'int' })
  setNumber: number; // Número de serie (1, 2, 3, etc.)

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  peso: number; // Peso en kg

  @Column({ type: 'int' })
  repeticiones: number;

  @Column({ type: 'int', nullable: true })
  rir: number; // Reps in Reserve (0-10)

  @Column({ type: 'int', nullable: true })
  tiempoDescansoSegundos: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'boolean', default: false })
  esPR: boolean; // Personal Record flag

  @CreateDateColumn()
  createdAt: Date;
}
