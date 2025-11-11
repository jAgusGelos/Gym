import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { ProgressEntry, CreateProgressEntryDto, ProgressStats } from '../types/progress.types';

export const useMyProgress = () => {
  return useQuery({
    queryKey: ['my-progress'],
    queryFn: async () => {
      const response = await api.get<ProgressEntry[]>('/progress/my-progress');
      return response.data;
    },
  });
};

export const useProgressStats = () => {
  return useQuery({
    queryKey: ['progress-stats'],
    queryFn: async () => {
      const response = await api.get<ProgressStats>('/progress/stats');
      return response.data;
    },
  });
};

export const useCreateProgressEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProgressEntryDto) => {
      const response = await api.post<ProgressEntry>('/progress', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-progress'] });
      queryClient.invalidateQueries({ queryKey: ['progress-stats'] });
    },
  });
};

export const useUpdateProgressEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProgressEntryDto> }) => {
      const response = await api.patch<ProgressEntry>(`/progress/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-progress'] });
      queryClient.invalidateQueries({ queryKey: ['progress-stats'] });
    },
  });
};

export const useDeleteProgressEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/progress/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-progress'] });
      queryClient.invalidateQueries({ queryKey: ['progress-stats'] });
    },
  });
};
