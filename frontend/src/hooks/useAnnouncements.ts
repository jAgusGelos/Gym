import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Announcement, CreateAnnouncementDto, UpdateAnnouncementDto } from '../types/announcement.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useAnnouncements = (page = 1, limit = 20, tipo?: string) => {
  return useQuery({
    queryKey: ['announcements', page, limit, tipo],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Announcement>>('/announcements', {
        params: { page, limit, tipo },
      });
      return response.data;
    },
  });
};

export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: async () => {
      const response = await api.get<Announcement>(`/announcements/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnnouncementDto) => {
      const response = await api.post<Announcement>('/announcements', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAnnouncementDto }) => {
      const response = await api.patch<Announcement>(`/announcements/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcement'] });
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
};
