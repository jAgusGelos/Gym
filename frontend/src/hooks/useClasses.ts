import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  Class,
  Booking,
  CreateBookingDto,
  AttendanceStats,
  MonthlyAttendance,
} from '../types/class.types';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useClasses = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['classes', page, limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Class>>('/classes', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: ['class', id],
    queryFn: async () => {
      const response = await api.get<Class>(`/classes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useMyBookings = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await api.get<Booking[]>('/bookings/my-bookings');
      return response.data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingDto) => {
      const response = await api.post<Booking>('/bookings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

// Obtener historial de clases (asistidas, canceladas, no asistidas)
export const useBookingHistory = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['booking-history', page, limit],
    queryFn: async () => {
      const response = await api.get<PaginatedResult<Booking>>('/bookings/history', {
        params: { page, limit },
      });
      return response.data;
    },
  });
};

// Obtener estadísticas de asistencia
export const useAttendanceStats = () => {
  return useQuery({
    queryKey: ['attendance-stats'],
    queryFn: async () => {
      const response = await api.get<AttendanceStats>('/bookings/stats');
      return response.data;
    },
  });
};

// Obtener asistencia mensual para gráficos
export const useMonthlyAttendance = (months = 6) => {
  return useQuery({
    queryKey: ['monthly-attendance', months],
    queryFn: async () => {
      const response = await api.get<MonthlyAttendance[]>('/bookings/monthly-attendance', {
        params: { months },
      });
      return response.data;
    },
  });
};
