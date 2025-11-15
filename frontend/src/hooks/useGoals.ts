import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { UserGoal, CreateGoalDto, UpdateGoalDto } from '../types/goal.types';

// Obtener todos los objetivos del usuario
export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await api.get<UserGoal[]>('/goals');
      return response.data;
    },
  });
};

// Obtener solo objetivos activos
export const useActiveGoals = () => {
  return useQuery({
    queryKey: ['goals', 'active'],
    queryFn: async () => {
      const response = await api.get<UserGoal[]>('/goals/active');
      return response.data;
    },
  });
};

// Obtener un objetivo específico
export const useGoal = (id: string) => {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: async () => {
      const response = await api.get<UserGoal>(`/goals/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Crear un nuevo objetivo
export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGoalDto) => {
      const response = await api.post<UserGoal>('/goals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

// Actualizar un objetivo
export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateGoalDto }) => {
      const response = await api.patch<UserGoal>(`/goals/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

// Eliminar un objetivo
export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/goals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};

// Recalcular progreso de objetivos
export const useRecalculateGoals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/goals/recalculate');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
