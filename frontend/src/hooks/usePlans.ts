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
