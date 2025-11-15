export interface ExerciseSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  peso: number;
  repeticiones: number;
  rir: number | null;
  esPR: boolean;
  createdAt: string;
  workoutLogId: string;
  exercise?: {
    id: string;
    nombre: string;
    grupoMuscular: string;
  };
}

export interface WorkoutLog {
  id: string;
  userId: string;
  routineId: string | null;
  fecha: string;
  titulo: string | null;
  duracionMinutos: number | null;
  createdAt: string;
  updatedAt: string;
  sets: ExerciseSet[];
  routine?: {
    id: string;
    nombre: string;
  };
}

export interface CreateExerciseSetDto {
  exerciseId: string;
  setNumber: number;
  peso: number;
  repeticiones: number;
  rir?: number;
}

export interface CreateWorkoutLogDto {
  routineId?: string;
  fecha: string;
  titulo?: string;
  duracionMinutos?: number;
  sets: CreateExerciseSetDto[];
}

export interface UpdateWorkoutLogDto {
  routineId?: string;
  fecha?: string;
  titulo?: string;
  duracionMinutos?: number;
  sets?: CreateExerciseSetDto[];
}

export interface ExerciseHistorySession {
  fecha: string;
  sets: {
    setNumber: number;
    peso: number;
    repeticiones: number;
    rir: number | null;
    esPR: boolean;
  }[];
}

export interface ExerciseStats {
  totalSets: number;
  totalReps: number;
  volumeTotal: number;
  pr: {
    peso: number;
    repeticiones: number;
    fecha: string;
    estimado1RM: number;
  } | null;
  pesoPromedio: number;
  repsPromedio: number;
  ultimaSesion: string | null;
}

export interface ExerciseChartData {
  fecha: string;
  peso: number;
  repeticiones: number;
  estimado1RM: number;
  volumen: number;
}

export interface PersonalRecord {
  exercise: {
    id: string;
    nombre: string;
    grupoMuscular: string;
  };
  peso: number;
  repeticiones: number;
  fecha: string;
  estimado1RM: number;
}

export interface UserWorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
  currentStreak: number;
  avgSetsPerWorkout: number;
}
