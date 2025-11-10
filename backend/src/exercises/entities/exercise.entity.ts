import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExerciseCategory {
  FUERZA = 'FUERZA',
  CARDIO = 'CARDIO',
  FLEXIBILIDAD = 'FLEXIBILIDAD',
  MOVILIDAD = 'MOVILIDAD',
  FUNCIONAL = 'FUNCIONAL',
}

export enum DifficultyLevel {
  PRINCIPIANTE = 'PRINCIPIANTE',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
}

export enum MuscleGroup {
  PECHO = 'PECHO',
  ESPALDA = 'ESPALDA',
  HOMBROS = 'HOMBROS',
  BRAZOS = 'BRAZOS',
  PIERNAS = 'PIERNAS',
  ABDOMEN = 'ABDOMEN',
  GLUTEOS = 'GLUTEOS',
  CUERPO_COMPLETO = 'CUERPO_COMPLETO',
}

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  imagenUrl: string;

  @Column({
    type: 'enum',
    enum: ExerciseCategory,
  })
  categoria: ExerciseCategory;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
  })
  nivelDificultad: DifficultyLevel;

  @Column({
    type: 'enum',
    enum: MuscleGroup,
    array: true,
  })
  grupoMuscular: MuscleGroup[];

  @Column({ type: 'text', nullable: true })
  instrucciones: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
