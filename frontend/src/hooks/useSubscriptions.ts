import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Subscription, CreateSubscriptionDto } from '../types/subscription.types';

// Query keys
export const subscriptionsKeys = {
  all: ['subscriptions'] as const,
  lists: () => [...subscriptionsKeys.all, 'list'] as const,
  list: () => [...subscriptionsKeys.lists()] as const,
  details: () => [...subscriptionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...subscriptionsKeys.details(), id] as const,
  active: () => [...subscriptionsKeys.all, 'active'] as const,
};

// Obtener mis suscripciones
export const useMySubscriptions = () => {
  return useQuery({
    queryKey: subscriptionsKeys.list(),
    queryFn: async () => {
      const response = await api.get<Subscription[]>('/subscriptions/my-subscriptions');
      return response.data;
    },
  });
};

// Obtener suscripción activa
export const useActiveSubscription = () => {
  return useQuery({
    queryKey: subscriptionsKeys.active(),
    queryFn: async () => {
      const response = await api.get<Subscription>('/subscriptions/active');
      return response.data;
    },
  });
};

// Obtener detalle de suscripción
export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: subscriptionsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<Subscription>(`/subscriptions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Crear suscripción
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSubscriptionDto) => {
      const response = await api.post<Subscription>('/subscriptions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.active() });
    },
  });
};

// Cancelar suscripción
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, cancelReason }: { id: string; cancelReason?: string }) => {
      const response = await api.patch<Subscription>(`/subscriptions/${id}/cancel`, {
        cancelReason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.active() });
    },
  });
};

// Pausar suscripción
export const usePauseSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<Subscription>(`/subscriptions/${id}/pause`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.active() });
    },
  });
};

// Reanudar suscripción
export const useResumeSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch<Subscription>(`/subscriptions/${id}/resume`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.active() });
    },
  });
};
