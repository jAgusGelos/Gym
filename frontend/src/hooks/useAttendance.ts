import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Attendance, CheckInDto, ManualCheckInDto } from '../types/attendance.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useAttendances = (page = 1, limit = 50, date?: string) => {
  return useQuery({
    queryKey: ['attendances', page, limit, date],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Attendance>>('/attendance', {
        params: { page, limit, date },
      });
      return response.data;
    },
  });
};

export const useTodayAttendances = () => {
  const today = new Date().toISOString().split('T')[0];
  return useAttendances(1, 100, today);
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckInDto) => {
      const response = await api.post<Attendance>('/attendance/check-in', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useManualCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ManualCheckInDto) => {
      const response = await api.post<Attendance>('/attendance/manual', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};
