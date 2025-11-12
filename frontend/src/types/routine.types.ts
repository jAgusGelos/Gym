export interface Routine {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: RoutineLevel;
  objetivo: RoutineGoal;
  duracionEstimada: number;
  publico: boolean;
  activo: boolean;
  creadorId: string;
  creador?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  ejercicios?: RoutineExercise[];
  cantidadEjercicios?: number;
  isFavorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineExercise {
  id: string;
  routineId: string;
  exerciseId: string;
  exercise?: Exercise;
  series: number;
  repeticiones: string;
  descanso: number;
  notas?: string;
  orden: number;
}

export interface Exercise {
  id: string;
  nombre: string;
  descripcion: string;
  grupoMuscular: MuscleGroup;
  equipamiento?: string;
  dificultad: Difficulty;
  instrucciones?: string;
  videoUrl?: string;
  imagenUrl?: string;
  activo: boolean;
}

export enum RoutineLevel {
  PRINCIPIANTE = 'PRINCIPIANTE',
  INTERMEDIO = 'INTERMEDIO',
  AVANZADO = 'AVANZADO',
}

export enum RoutineGoal {
  FUERZA = 'FUERZA',
  HIPERTROFIA = 'HIPERTROFIA',
  RESISTENCIA = 'RESISTENCIA',
  PERDIDA_PESO = 'PERDIDA_PESO',
  DEFINICION = 'DEFINICION',
  MOVILIDAD = 'MOVILIDAD',
}

export enum MuscleGroup {
  PECHO = 'PECHO',
  ESPALDA = 'ESPALDA',
  PIERNAS = 'PIERNAS',
  HOMBROS = 'HOMBROS',
  BRAZOS = 'BRAZOS',
  ABDOMEN = 'ABDOMEN',
  GLUTEOS = 'GLUTEOS',
  CARDIO = 'CARDIO',
}

export enum Difficulty {
  FACIL = 'FACIL',
  INTERMEDIO = 'INTERMEDIO',
  DIFICIL = 'DIFICIL',
}
