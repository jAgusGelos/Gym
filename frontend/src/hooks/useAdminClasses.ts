import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Class } from '../types/class.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateClassDto {
  nombre: string;
  descripcion: string;
  duracion: number;
  cupoMaximo: number;
  fechaHora: string;
  instructorId: string;
}

export interface UpdateClassDto {
  nombre?: string;
  descripcion?: string;
  duracion?: number;
  cupoMaximo?: number;
  fechaHora?: string;
  instructorId?: string;
  activo?: boolean;
}

export const useAdminClasses = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['admin-classes', page, limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Class>>('/classes', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClassDto) => {
      const response = await api.post<Class>('/classes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClassDto }) => {
      const response = await api.patch<Class>(`/classes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['class'] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/classes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};
