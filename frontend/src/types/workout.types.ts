// Enums
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

export enum WorkoutGoal {
  FUERZA = 'fuerza',
  HIPERTROFIA = 'hipertrofia',
  RESISTENCIA = 'resistencia',
  PERDIDA_PESO = 'perdida_peso',
  TONIFICACION = 'tonificacion',
  FUNCIONAL = 'funcional',
}

// Exercise
export interface Exercise {
  id: string;
  nombre: string;
  descripcion: string;
  grupoMuscular: MuscleGroup;
  equipamiento?: string;
  nivelDificultad: DifficultyLevel;
  videoUrl?: string;
  imagenUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseDto {
  nombre: string;
  descripcion: string;
  grupoMuscular: MuscleGroup;
  equipamiento?: string;
  nivelDificultad?: DifficultyLevel;
  videoUrl?: string;
  imagenUrl?: string;
}

// Routine Exercise
export interface RoutineExercise {
  id: string;
  routineId: string;
  exerciseId: string;
  exercise: Exercise;
  dia: string;
  orden: number;
  series: number;
  repeticiones: string;
  pesoSugerido?: number;
  descansoSegundos: number;
  notas?: string;
}

export interface CreateRoutineExerciseDto {
  exerciseId: string;
  dia: string;
  orden: number;
  series: number;
  repeticiones: string;
  pesoSugerido?: number;
  descansoSegundos: number;
  notas?: string;
}

// Workout Routine
export interface WorkoutRoutine {
  id: string;
  nombre: string;
  descripcion: string;
  trainerId: string;
  trainer?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  clientId?: string;
  client?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  duracionSemanas: number;
  diasPorSemana: number;
  objetivo: WorkoutGoal;
  activa: boolean;
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutRoutineDto {
  nombre: string;
  descripcion: string;
  clientId?: string;
  duracionSemanas: number;
  diasPorSemana: number;
  objetivo: WorkoutGoal;
  activa?: boolean;
  exercises: CreateRoutineExerciseDto[];
}

// Workout Log
export interface WorkoutLog {
  id: string;
  userId: string;
  routineExerciseId: string;
  routineExercise: RoutineExercise;
  fecha: string;
  seriesCompletadas: number;
  repeticionesRealizadas: string;
  pesoUtilizado?: number;
  duracionMinutos?: number;
  rpe?: number;
  notas?: string;
  createdAt: string;
}

export interface CreateWorkoutLogDto {
  routineExerciseId: string;
  fecha?: string;
  seriesCompletadas: number;
  repeticionesRealizadas: string;
  pesoUtilizado?: number;
  duracionMinutos?: number;
  rpe?: number;
  notas?: string;
}
