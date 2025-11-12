import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/api';
import { Achievement, UserAchievement, UserAchievementStats } from '../types/achievement.types';

// Obtener todos los logros disponibles
export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await api.get<Achievement[]>('/achievements');
      return response.data;
    },
  });
};

// Obtener logros del usuario con progreso
export const useMyAchievements = () => {
  return useQuery({
    queryKey: ['my-achievements'],
    queryFn: async () => {
      const response = await api.get<UserAchievement[]>('/achievements/my-achievements');
      return response.data;
    },
  });
};

// Obtener estadísticas del usuario
export const useAchievementStats = () => {
  return useQuery({
    queryKey: ['achievement-stats'],
    queryFn: async () => {
      const response = await api.get<UserAchievementStats>('/achievements/stats');
      return response.data;
    },
  });
};

// Verificar y actualizar logros (trigger manual)
export const useCheckAchievements = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<Achievement[]>('/achievements/check');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['achievement-stats'] });
    },
  });
};
