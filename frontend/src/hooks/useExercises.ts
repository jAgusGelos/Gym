import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Exercise, CreateExerciseDto, UpdateExerciseDto } from '../types/exercise.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useExercises = (page = 1, limit = 20, filters?: any) => {
  return useQuery({
    queryKey: ['exercises', page, limit, filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Exercise>>('/exercises', {
        params: { page, limit, ...filters },
      });
      return response.data;
    },
  });
};

export const useExercise = (id: string) => {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      const response = await api.get<Exercise>(`/exercises/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExerciseDto) => {
      const response = await api.post<Exercise>('/exercises', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExerciseDto }) => {
      const response = await api.patch<Exercise>(`/exercises/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercise'] });
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/exercises/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
};
