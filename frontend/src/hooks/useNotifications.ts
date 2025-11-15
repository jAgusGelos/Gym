import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Notification } from '../types/notification.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query keys
export const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (page?: number, limit?: number) => [...notificationsKeys.lists(), page, limit] as const,
  unread: () => [...notificationsKeys.all, 'unread'] as const,
  unreadCount: () => [...notificationsKeys.all, 'unread-count'] as const,
};

// Obtener notificaciones paginadas
export const useNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: notificationsKeys.list(page, limit),
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Notification>>('/notifications', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

// Obtener notificaciones no leídas
export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: notificationsKeys.unread(),
    queryFn: async () => {
      const response = await api.get<Notification[]>('/notifications/unread');
      return response.data;
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// Contar notificaciones no leídas
export const useUnreadCount = () => {
  return useQuery({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: async () => {
      const response = await api.get<{ count: number }>('/notifications/unread-count');
      return response.data.count;
    },
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// Marcar notificación como leída
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<Notification>(`/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
    },
  });
};

// Marcar todas como leídas
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
    },
  });
};

// Eliminar notificación
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
    },
  });
};

// Eliminar todas las leídas
export const useDeleteAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete('/notifications/read/all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
    },
  });
};
