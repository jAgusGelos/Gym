import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type {
  WorkoutLog,
  CreateWorkoutLogDto,
  UpdateWorkoutLogDto,
  ExerciseHistorySession,
  ExerciseStats,
  ExerciseChartData,
  PersonalRecord,
  UserWorkoutStats,
} from '../types/workout-log.types';
import type { WorkoutLogFilters } from '../types/query-filters.types';

// Query keys
export const workoutLogsKeys = {
  all: ['workout-logs'] as const,
  lists: () => [...workoutLogsKeys.all, 'list'] as const,
  list: (filters?: WorkoutLogFilters) => [...workoutLogsKeys.lists(), filters] as const,
  details: () => [...workoutLogsKeys.all, 'detail'] as const,
  detail: (id: string) => [...workoutLogsKeys.details(), id] as const,
  exercise: (exerciseId: string) => [...workoutLogsKeys.all, 'exercise', exerciseId] as const,
  exerciseHistory: (exerciseId: string) =>
    [...workoutLogsKeys.exercise(exerciseId), 'history'] as const,
  exerciseStats: (exerciseId: string) => [...workoutLogsKeys.exercise(exerciseId), 'stats'] as const,
  exerciseChart: (exerciseId: string, limit?: number) =>
    [...workoutLogsKeys.exercise(exerciseId), 'chart', limit] as const,
  prs: () => [...workoutLogsKeys.all, 'prs'] as const,
  stats: () => [...workoutLogsKeys.all, 'stats'] as const,
};

// Obtener todos los workout logs del usuario
export const useWorkoutLogs = () => {
  return useQuery({
    queryKey: workoutLogsKeys.lists(),
    queryFn: async () => {
      const response = await api.get<WorkoutLog[]>('/workout-logs');
      return response.data;
    },
  });
};

// Obtener workout logs por rango de fechas
export const useWorkoutLogsByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: workoutLogsKeys.list({ startDate, endDate }),
    queryFn: async () => {
      const response = await api.get<WorkoutLog[]>('/workout-logs/date-range', {
        params: { startDate, endDate },
      });
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });
};

// Obtener un workout log específico
export const useWorkoutLog = (id: string) => {
  return useQuery({
    queryKey: workoutLogsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<WorkoutLog>(`/workout-logs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Obtener historial de un ejercicio
export const useExerciseHistory = (exerciseId: string) => {
  return useQuery({
    queryKey: workoutLogsKeys.exerciseHistory(exerciseId),
    queryFn: async () => {
      const response = await api.get<ExerciseHistorySession[]>(
        `/workout-logs/exercise/${exerciseId}/history`,
      );
      return response.data;
    },
    enabled: !!exerciseId,
  });
};

// Obtener estadísticas de un ejercicio
export const useExerciseStats = (exerciseId: string) => {
  return useQuery({
    queryKey: workoutLogsKeys.exerciseStats(exerciseId),
    queryFn: async () => {
      const response = await api.get<ExerciseStats>(`/workout-logs/exercise/${exerciseId}/stats`);
      return response.data;
    },
    enabled: !!exerciseId,
  });
};

// Obtener gráfico de evolución de un ejercicio
export const useExerciseChart = (exerciseId: string, limit: number = 10) => {
  return useQuery({
    queryKey: workoutLogsKeys.exerciseChart(exerciseId, limit),
    queryFn: async () => {
      const response = await api.get<ExerciseChartData[]>(
        `/workout-logs/exercise/${exerciseId}/chart`,
        {
          params: { limit },
        },
      );
      return response.data;
    },
    enabled: !!exerciseId,
  });
};

// Obtener todos los PRs del usuario
export const usePersonalRecords = () => {
  return useQuery({
    queryKey: workoutLogsKeys.prs(),
    queryFn: async () => {
      const response = await api.get<PersonalRecord[]>('/workout-logs/prs');
      return response.data;
    },
  });
};

// Obtener estadísticas generales del usuario
export const useUserWorkoutStats = () => {
  return useQuery({
    queryKey: workoutLogsKeys.stats(),
    queryFn: async () => {
      const response = await api.get<UserWorkoutStats>('/workout-logs/stats');
      return response.data;
    },
  });
};

// Crear un nuevo workout log
export const useCreateWorkoutLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkoutLogDto) => {
      const response = await api.post<WorkoutLog>('/workout-logs', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.prs() });
    },
  });
};

// Actualizar un workout log
export const useUpdateWorkoutLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWorkoutLogDto }) => {
      const response = await api.patch<WorkoutLog>(`/workout-logs/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.prs() });
    },
  });
};

// Eliminar un workout log
export const useDeleteWorkoutLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/workout-logs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: workoutLogsKeys.prs() });
    },
  });
};
