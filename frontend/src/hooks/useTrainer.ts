import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/trainers';

export interface WorkoutClient {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  routineCount: number;
  activeRoutine: {
    id: string;
    nombre: string;
    objetivo: string;
  } | null;
  totalWorkouts: number;
  recentWorkouts: number;
}

export interface ClientProgress {
  client: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  routines: any[];
  recentLogs: any[];
  stats: {
    totalWorkoutsLast30Days: number;
    uniqueTrainingDaysLast30Days: number;
    totalRoutines: number;
    activeRoutineCount: number;
  };
}

export interface Member {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
}

export function useWorkoutClients() {
  return useQuery({
    queryKey: ['trainer', 'workout-clients'],
    queryFn: async () => {
      const { data } = await axios.get<WorkoutClient[]>(`${API_URL}/workout-clients`);
      return data;
    },
  });
}

export function useClientProgress(clientId: string) {
  return useQuery({
    queryKey: ['trainer', 'client-progress', clientId],
    queryFn: async () => {
      const { data } = await axios.get<ClientProgress>(
        `${API_URL}/workout-clients/${clientId}/progress`,
      );
      return data;
    },
    enabled: !!clientId,
  });
}

export function useAllMembers() {
  return useQuery({
    queryKey: ['trainer', 'all-members'],
    queryFn: async () => {
      const { data } = await axios.get<Member[]>(`${API_URL}/all-members`);
      return data;
    },
  });
}
