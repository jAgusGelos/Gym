import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { WorkoutRoutine } from './workout-routine.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('routine_exercises')
@Index(['routineId', 'dia', 'orden'])
export class RoutineExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  routineId: string;

  @ManyToOne(() => WorkoutRoutine, (routine) => routine.exercises, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routineId' })
  routine: WorkoutRoutine;

  @Column({ type: 'uuid' })
  exerciseId: string;

  @ManyToOne(() => Exercise, { eager: true })
  @JoinColumn({ name: 'exerciseId' })
  exercise: Exercise;

  @Column({ type: 'varchar', length: 50 })
  dia: string; // "Lunes", "Martes", "Día 1", etc.

  @Column({ type: 'int', default: 0 })
  orden: number; // Orden de ejecución en ese día

  @Column({ type: 'int', default: 3 })
  series: number;

  @Column({ type: 'varchar', length: 50, default: '10-12' })
  repeticiones: string; // Puede ser "10-12", "8-10", "hasta el fallo", etc.

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  pesoSugerido: number; // Peso en kg

  @Column({ type: 'int', default: 60 })
  descansoSegundos: number;

  @Column({ type: 'text', nullable: true })
  notas: string;
}
