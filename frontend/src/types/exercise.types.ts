export interface Exercise {
  id: string;
  nombre: string;
  descripcion: string;
  videoUrl?: string;
  imagenUrl?: string;
  categoria: ExerciseCategory;
  nivelDificultad: DifficultyLevel;
  grupoMuscular: MuscleGroup[];
  instrucciones?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface CreateExerciseDto {
  nombre: string;
  descripcion: string;
  videoUrl?: string;
  imagenUrl?: string;
  categoria: ExerciseCategory;
  nivelDificultad: DifficultyLevel;
  grupoMuscular: MuscleGroup[];
  instrucciones?: string;
}

export interface UpdateExerciseDto extends Partial<CreateExerciseDto> {
  activo?: boolean;
}
