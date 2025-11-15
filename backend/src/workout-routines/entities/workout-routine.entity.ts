import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoutineExercise } from './routine-exercise.entity';

export enum WorkoutGoal {
  FUERZA = 'fuerza',
  HIPERTROFIA = 'hipertrofia',
  RESISTENCIA = 'resistencia',
  PERDIDA_PESO = 'perdida_peso',
  TONIFICACION = 'tonificacion',
  FUNCIONAL = 'funcional',
}

export enum RoutineType {
  PERSONAL = 'personal',
  TEMPLATE = 'template',
}

export enum DifficultyLevel {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

@Entity('workout_routines')
@Index(['trainerId'])
@Index(['clientId'])
@Index(['activa'])
@Index(['tipo'])
@Index(['nivel'])
export class WorkoutRoutine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'uuid' })
  trainerId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'trainerId' })
  trainer: User;

  @Column({ type: 'uuid', nullable: true })
  clientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({
    type: 'enum',
    enum: RoutineType,
    default: RoutineType.TEMPLATE,
  })
  tipo: RoutineType;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.INTERMEDIO,
  })
  nivel: DifficultyLevel;

  @Column({ type: 'int', default: 4 })
  duracionSemanas: number;

  @Column({ type: 'int', default: 3 })
  diasPorSemana: number;

  @Column({
    type: 'enum',
    enum: WorkoutGoal,
    default: WorkoutGoal.HIPERTROFIA,
  })
  objetivo: WorkoutGoal;

  @Column({ type: 'boolean', default: false })
  activa: boolean;

  @OneToMany(
    () => RoutineExercise,
    (routineExercise) => routineExercise.routine,
    {
      cascade: true,
    },
  )
  exercises: RoutineExercise[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
