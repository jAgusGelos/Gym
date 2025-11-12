import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../config/axios';
import {
  BodyMeasurement,
  CreateBodyMeasurementDto,
  EvolutionStats,
  MeasurementComparison,
  PaginatedMeasurements,
} from '../types/body-measurement.types';

const bodyMeasurementsKeys = {
  all: ['body-measurements'] as const,
  lists: () => [...bodyMeasurementsKeys.all, 'list'] as const,
  list: (page?: number, limit?: number) =>
    [...bodyMeasurementsKeys.lists(), { page, limit }] as const,
  details: () => [...bodyMeasurementsKeys.all, 'detail'] as const,
  detail: (id: string) => [...bodyMeasurementsKeys.details(), id] as const,
  latest: () => [...bodyMeasurementsKeys.all, 'latest'] as const,
  stats: () => [...bodyMeasurementsKeys.all, 'stats'] as const,
  progress: (months?: number) => [...bodyMeasurementsKeys.all, 'progress', months] as const,
  comparison: (id1: string, id2: string) =>
    [...bodyMeasurementsKeys.all, 'comparison', id1, id2] as const,
};

// Obtener todas las mediciones
export const useBodyMeasurements = () => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.lists(),
    queryFn: async () => {
      const response = await api.get<BodyMeasurement[]>('/body-measurements');
      return response.data;
    },
  });
};

// Obtener historial con paginación
export const useBodyMeasurementsHistory = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.list(page, limit),
    queryFn: async () => {
      const response = await api.get<PaginatedMeasurements>(
        `/body-measurements/history?page=${page}&limit=${limit}`,
      );
      return response.data;
    },
  });
};

// Obtener última medición
export const useLatestMeasurement = () => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.latest(),
    queryFn: async () => {
      const response = await api.get<BodyMeasurement | null>('/body-measurements/latest');
      return response.data;
    },
  });
};

// Obtener estadísticas de evolución
export const useEvolutionStats = () => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.stats(),
    queryFn: async () => {
      const response = await api.get<EvolutionStats>('/body-measurements/stats');
      return response.data;
    },
  });
};

// Obtener progreso de peso
export const useWeightProgress = (months: number = 6) => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.progress(months),
    queryFn: async () => {
      const response = await api.get<BodyMeasurement[]>(
        `/body-measurements/progress?months=${months}`,
      );
      return response.data;
    },
  });
};

// Obtener una medición específica
export const useBodyMeasurement = (id: string) => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<BodyMeasurement>(`/body-measurements/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Comparar dos mediciones
export const useMeasurementComparison = (id1?: string, id2?: string) => {
  return useQuery({
    queryKey: bodyMeasurementsKeys.comparison(id1 || '', id2 || ''),
    queryFn: async () => {
      const response = await api.get<MeasurementComparison>(
        `/body-measurements/compare/${id1}/${id2}`,
      );
      return response.data;
    },
    enabled: !!id1 && !!id2,
  });
};

// Crear medición
export const useCreateMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBodyMeasurementDto) => {
      const response = await api.post<BodyMeasurement>('/body-measurements', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.latest() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.all });
    },
  });
};

// Actualizar medición
export const useUpdateMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateBodyMeasurementDto> }) => {
      const response = await api.patch<BodyMeasurement>(`/body-measurements/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.latest() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.stats() });
    },
  });
};

// Eliminar medición
export const useDeleteMeasurement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/body-measurements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.latest() });
      queryClient.invalidateQueries({ queryKey: bodyMeasurementsKeys.stats() });
    },
  });
};
