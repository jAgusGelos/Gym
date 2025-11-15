import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { MembershipPlan, OnlinePayment, CreatePreferenceDto, PaymentPreference } from '../types/plan.types';

export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await api.get<MembershipPlan[]>('/mercadopago/plans');
      return response.data;
    },
  });
};

export const useCreatePreference = () => {
  return useMutation({
    mutationFn: async (data: CreatePreferenceDto) => {
      const response = await api.post<PaymentPreference>('/mercadopago/create-preference', data);
      return response.data;
    },
  });
};

export const useMyPayments = () => {
  return useQuery({
    queryKey: ['my-payments'],
    queryFn: async () => {
      const response = await api.get<OnlinePayment[]>('/mercadopago/my-payments');
      return response.data;
    },
  });
};

export const useAdminPayments = () => {
  return useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const response = await api.get<OnlinePayment[]>('/mercadopago/payments');
      return response.data;
    },
  });
};

// Admin Plan Management
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<MembershipPlan>) => {
      const response = await api.post<MembershipPlan>('/mercadopago/plans', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MembershipPlan> }) => {
      const response = await api.patch<MembershipPlan>(`/mercadopago/plans/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/mercadopago/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
};
