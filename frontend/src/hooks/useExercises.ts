import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type {
  Exercise,
  CreateExerciseDto,
  MuscleGroup,
  DifficultyLevel,
} from '../types/workout.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useExercises(
  page: number = 1,
  limit: number = 20,
  grupoMuscular?: MuscleGroup,
  nivelDificultad?: DifficultyLevel
) {
  return useQuery({
    queryKey: ['exercises', page, limit, grupoMuscular, nivelDificultad],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (grupoMuscular) params.grupoMuscular = grupoMuscular;
      if (nivelDificultad) params.nivelDificultad = nivelDificultad;

      const { data } = await api.get<PaginatedResult<Exercise>>('/exercises', { params });
      return data;
    },
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      const { data } = await api.get<Exercise>(`/exercises/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useSearchExercises(searchTerm: string) {
  return useQuery({
    queryKey: ['exercises', 'search', searchTerm],
    queryFn: async () => {
      const { data } = await api.get<Exercise[]>('/exercises/search', {
        params: { q: searchTerm },
      });
      return data;
    },
    enabled: searchTerm.length >= 2,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseData: CreateExerciseDto) => {
      const { data } = await api.post<Exercise>('/exercises', exerciseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...exerciseData }: Partial<CreateExerciseDto> & { id: string }) => {
      const { data } = await api.patch<Exercise>(`/exercises/${id}`, exerciseData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercise', data.id] });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/exercises/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
