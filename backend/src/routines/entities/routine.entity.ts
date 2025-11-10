import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoutineExercise } from './routine-exercise.entity';

export enum RoutineLevel {
  PRINCIPIANTE = 'PRINCIPIANTE',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
}

export enum RoutineGoal {
  FUERZA = 'FUERZA',
  HIPERTROFIA = 'HIPERTROFIA',
  DEFINICION = 'DEFINICION',
  RESISTENCIA = 'RESISTENCIA',
  MOVILIDAD = 'MOVILIDAD',
  PERDIDA_PESO = 'PERDIDA_PESO',
}

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: RoutineLevel,
  })
  nivel: RoutineLevel;

  @Column({
    type: 'enum',
    enum: RoutineGoal,
  })
  objetivo: RoutineGoal;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creadorId' })
  creador: User;

  @Column()
  creadorId: string;

  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.routine, {
    cascade: true,
  })
  ejercicios: RoutineExercise[];

  @Column({ type: 'int', nullable: true })
  duracionEstimada: number; // minutos

  @Column({ default: true })
  activo: boolean;

  @Column({ default: true })
  publico: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
