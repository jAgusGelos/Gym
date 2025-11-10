import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { User } from '../types/user.types';
import { Membership, CreateMembershipDto } from '../types/membership.types';
import { Payment, CreatePaymentDto } from '../types/payment.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AdminStats {
  totalSocios: number;
  sociosActivos: number;
  totalClases: number;
  clasesHoy: number;
  asistenciasHoy: number;
  ingresosMes: number;
  membresiasVencen: number;
}

// Estadísticas
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const response = await api.get<AdminStats>('/users/stats');
      return response.data;
    },
  });
};

// Usuarios/Socios
export const useUsers = (page = 1, limit = 20, filters?: { activo?: boolean; rol?: string }) => {
  return useQuery({
    queryKey: ['users', page, limit, filters],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<User>>('/users', {
        params: { page, limit, ...filters },
      });
      return response.data;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await api.patch<User>(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Membresías
export const useMemberships = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['memberships', page, limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Membership>>('/memberships', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

export const useCreateMembership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMembershipDto) => {
      const response = await api.post<Membership>('/memberships', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Pagos
export const usePayments = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['payments', page, limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Payment>>('/payments', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentDto) => {
      const response = await api.post<Payment>('/payments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};
