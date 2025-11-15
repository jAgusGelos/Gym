import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum MuscleGroup {
  PECHO = 'pecho',
  ESPALDA = 'espalda',
  PIERNAS = 'piernas',
  HOMBROS = 'hombros',
  BRAZOS = 'brazos',
  CORE = 'core',
  CARDIO = 'cardio',
  CUERPO_COMPLETO = 'cuerpo_completo',
}

export enum DifficultyLevel {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

@Entity('exercises')
@Index(['grupoMuscular'])
@Index(['nivelDificultad'])
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: MuscleGroup,
  })
  grupoMuscular: MuscleGroup;

  @Column({ type: 'varchar', length: 255, nullable: true })
  equipamiento: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.INTERMEDIO,
  })
  nivelDificultad: DifficultyLevel;

  @Column({ type: 'varchar', length: 500, nullable: true })
  videoUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagenUrl: string;

  @Column({ type: 'boolean', default: true })
  trackeaPeso: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
