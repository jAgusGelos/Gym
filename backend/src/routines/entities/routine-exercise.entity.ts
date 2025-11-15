import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Routine } from './routine.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('routine_exercises')
export class RoutineExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Routine, (routine) => routine.ejercicios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column()
  exerciseId: string;

  @Column()
  orden: number;

  @Column()
  series: number;

  @Column()
  repeticiones: string; // "10-12" o "30 seg" etc

  @Column()
  descanso: number; // segundos

  @Column({ type: 'text', nullable: true })
  notas: string;
}
