import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {
  WorkoutRoutine,
  CreateWorkoutRoutineDto,
  WorkoutLog,
  CreateWorkoutLogDto,
} from '../types/workout.types';

const API_URL = 'http://localhost:3000/workout-routines';

export function useWorkoutRoutines(trainerId?: string, clientId?: string, activa?: boolean) {
  return useQuery({
    queryKey: ['workout-routines', trainerId, clientId, activa],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (trainerId) params.trainerId = trainerId;
      if (clientId) params.clientId = clientId;
      if (activa !== undefined) params.activa = activa.toString();

      const { data } = await axios.get<WorkoutRoutine[]>(API_URL, { params });
      return data;
    },
  });
}

export function useMyRoutines(activa?: boolean) {
  return useQuery({
    queryKey: ['my-routines', activa],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (activa !== undefined) params.activa = activa.toString();

      const { data } = await axios.get<WorkoutRoutine[]>(`${API_URL}/my-routines`, { params });
      return data;
    },
  });
}

export function useWorkoutRoutine(id: string) {
  return useQuery({
    queryKey: ['workout-routine', id],
    queryFn: async () => {
      const { data } = await axios.get<WorkoutRoutine>(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateWorkoutRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineData: CreateWorkoutRoutineDto) => {
      const { data } = await axios.post<WorkoutRoutine>(API_URL, routineData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-routines'] });
    },
  });
}

export function useUpdateWorkoutRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...routineData }: Partial<CreateWorkoutRoutineDto> & { id: string }) => {
      const { data } = await axios.patch<WorkoutRoutine>(`${API_URL}/${id}`, routineData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workout-routines'] });
      queryClient.invalidateQueries({ queryKey: ['workout-routine', data.id] });
      queryClient.invalidateQueries({ queryKey: ['my-routines'] });
    },
  });
}

export function useDeleteWorkoutRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-routines'] });
      queryClient.invalidateQueries({ queryKey: ['my-routines'] });
    },
  });
}

export function useActivateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.post<WorkoutRoutine>(`${API_URL}/${id}/activate`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-routines'] });
      queryClient.invalidateQueries({ queryKey: ['workout-routines'] });
    },
  });
}

// Workout Logs
export function useLogWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logData: CreateWorkoutLogDto) => {
      const { data } = await axios.post<WorkoutLog>(`${API_URL}/logs`, logData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-logs'] });
    },
  });
}

export function useWorkoutLogs(routineId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['workout-logs', routineId, startDate, endDate],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (routineId) params.routineId = routineId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const { data } = await axios.get<WorkoutLog[]>(`${API_URL}/logs/my-logs`, { params });
      return data;
    },
  });
}

export function useExerciseProgress(exerciseId: string) {
  return useQuery({
    queryKey: ['exercise-progress', exerciseId],
    queryFn: async () => {
      const { data } = await axios.get<WorkoutLog[]>(
        `${API_URL}/logs/exercise-progress/${exerciseId}`,
      );
      return data;
    },
    enabled: !!exerciseId,
  });
}
