import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Routine, RoutineLevel, RoutineGoal } from '../types/routine.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface RoutineFilters {
  nivel?: RoutineLevel;
  objetivo?: RoutineGoal;
  publico?: boolean;
}

export const useRoutines = (page = 1, limit = 20, filters?: RoutineFilters) => {
  return useQuery({
    queryKey: ['routines', page, limit, filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Routine>>('/routines', {
        params: { page, limit, ...filters },
      });
      return response.data;
    },
  });
};

export const useRoutine = (id: string) => {
  return useQuery({
    queryKey: ['routine', id],
    queryFn: async () => {
      const response = await api.get<Routine>(`/routines/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useFavoriteRoutines = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['favorite-routines', page, limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Routine>>('/routines/favorites', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const response = await api.post<{ favorited: boolean; message: string }>(
        `/routines/${routineId}/favorite`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
      queryClient.invalidateQueries({ queryKey: ['favorite-routines'] });
      queryClient.invalidateQueries({ queryKey: ['routine'] });
    },
  });
};
