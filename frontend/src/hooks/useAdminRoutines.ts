import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Routine } from '../types/routine.types';
import type { RoutineFilters } from '../types/query-filters.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoutineExerciseDto {
  exerciseId: string;
  orden: number;
  series: number;
  repeticiones: string;
  descanso: number;
  notas?: string;
}

export interface CreateRoutineDto {
  nombre: string;
  descripcion: string;
  nivel: string;
  objetivo: string;
  duracionEstimada?: number;
  publico?: boolean;
  ejercicios: RoutineExerciseDto[];
}

export interface UpdateRoutineDto extends Partial<CreateRoutineDto> {
  activo?: boolean;
}

export const useAdminRoutines = (page = 1, limit = 20, filters?: RoutineFilters) => {
  return useQuery({
    queryKey: ['admin-routines', page, limit, filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Routine>>('/routines', {
        params: { page, limit, ...filters },
      });
      return response.data;
    },
  });
};

export const useRoutineDetail = (id: string) => {
  return useQuery({
    queryKey: ['routine', id],
    queryFn: async () => {
      const response = await api.get<Routine>(`/routines/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoutineDto) => {
      const response = await api.post<Routine>('/routines', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routines'] });
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
};

export const useUpdateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoutineDto }) => {
      const response = await api.patch<Routine>(`/routines/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routines'] });
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });
};

export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/routines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routines'] });
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
};
