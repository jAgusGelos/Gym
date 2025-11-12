import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/axios';
import {
  Booking,
  CreateBookingDto,
  AttendanceStats,
  MonthlyAttendance,
} from '../types/class.types';

const bookingsKeys = {
  all: ['bookings'] as const,
  myBookings: (includeExpired?: boolean) =>
    [...bookingsKeys.all, 'my-bookings', includeExpired] as const,
  history: (page?: number) => [...bookingsKeys.all, 'history', page] as const,
  stats: () => [...bookingsKeys.all, 'stats'] as const,
  monthlyAttendance: (months?: number) =>
    [...bookingsKeys.all, 'monthly-attendance', months] as const,
  classBookings: (classId: string) => [...bookingsKeys.all, 'class', classId] as const,
};

// Obtener mis reservas
export const useMyBookings = (includeExpired: boolean = false) => {
  return useQuery({
    queryKey: bookingsKeys.myBookings(includeExpired),
    queryFn: async () => {
      const response = await api.get<Booking[]>(
        `/bookings/my-bookings?includeExpired=${includeExpired}`,
      );
      return response.data;
    },
  });
};

// Obtener historial de reservas
export const useBookingHistory = (page: number = 1) => {
  return useQuery({
    queryKey: bookingsKeys.history(page),
    queryFn: async () => {
      const response = await api.get<{ data: Booking[]; total: number; page: number; totalPages: number }>(
        `/bookings/history?page=${page}`,
      );
      return response.data;
    },
  });
};

// Obtener estadísticas de asistencia
export const useAttendanceStats = () => {
  return useQuery({
    queryKey: bookingsKeys.stats(),
    queryFn: async () => {
      const response = await api.get<AttendanceStats>('/bookings/stats');
      return response.data;
    },
  });
};

// Obtener asistencia mensual
export const useMonthlyAttendance = (months: number = 6) => {
  return useQuery({
    queryKey: bookingsKeys.monthlyAttendance(months),
    queryFn: async () => {
      const response = await api.get<MonthlyAttendance[]>(
        `/bookings/monthly-attendance?months=${months}`,
      );
      return response.data;
    },
  });
};

// Crear reserva
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingDto) => {
      const response = await api.post<Booking>('/bookings', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

// Cancelar reserva
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      await api.delete(`/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.myBookings() });
      queryClient.invalidateQueries({ queryKey: bookingsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};

// Check-in con QR (para admin/recepcionista)
export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classId, qrCode }: { classId: string; qrCode: string }) => {
      const response = await api.post(`/bookings/${classId}/check-in`, { qrCode });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingsKeys.all });
    },
  });
};
