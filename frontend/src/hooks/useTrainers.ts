import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { TrainerClient, ClientDetails, TrainerClass, TrainerStats } from '../types/trainer.types';

// Query keys
export const trainersKeys = {
  all: ['trainers'] as const,
  clients: () => [...trainersKeys.all, 'clients'] as const,
  clientDetail: (clientId: string) => [...trainersKeys.all, 'client', clientId] as const,
  classes: () => [...trainersKeys.all, 'classes'] as const,
  stats: () => [...trainersKeys.all, 'stats'] as const,
};

// Obtener mis clientes
export const useMyClients = () => {
  return useQuery({
    queryKey: trainersKeys.clients(),
    queryFn: async () => {
      const response = await api.get<TrainerClient[]>('/trainers/my-clients');
      return response.data;
    },
  });
};

// Obtener detalle de un cliente
export const useClientDetails = (clientId: string) => {
  return useQuery({
    queryKey: trainersKeys.clientDetail(clientId),
    queryFn: async () => {
      const response = await api.get<ClientDetails>(`/trainers/clients/${clientId}`);
      return response.data;
    },
    enabled: !!clientId,
  });
};

// Obtener mis clases como entrenador
export const useMyTrainerClasses = () => {
  return useQuery({
    queryKey: trainersKeys.classes(),
    queryFn: async () => {
      const response = await api.get<TrainerClass[]>('/trainers/my-classes');
      return response.data;
    },
  });
};

// Obtener mis estadísticas como entrenador
export const useTrainerStats = () => {
  return useQuery({
    queryKey: trainersKeys.stats(),
    queryFn: async () => {
      const response = await api.get<TrainerStats>('/trainers/my-stats');
      return response.data;
    },
  });
};
