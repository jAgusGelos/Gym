import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type {
  Exercise,
  CreateExerciseDto,
  MuscleGroup,
  DifficultyLevel,
} from '../types/workout.types';

const API_URL = 'http://localhost:3000/exercises';

export function useExercises(grupoMuscular?: MuscleGroup, nivelDificultad?: DifficultyLevel) {
  return useQuery({
    queryKey: ['exercises', grupoMuscular, nivelDificultad],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (grupoMuscular) params.grupoMuscular = grupoMuscular;
      if (nivelDificultad) params.nivelDificultad = nivelDificultad;

      const { data } = await axios.get<Exercise[]>(API_URL, { params });
      return data;
    },
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: async () => {
      const { data } = await axios.get<Exercise>(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useSearchExercises(searchTerm: string) {
  return useQuery({
    queryKey: ['exercises', 'search', searchTerm],
    queryFn: async () => {
      const { data } = await axios.get<Exercise[]>(`${API_URL}/search`, {
        params: { q: searchTerm },
      });
      return data;
    },
    enabled: searchTerm.length >= 2,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exerciseData: CreateExerciseDto) => {
      const { data } = await axios.post<Exercise>(API_URL, exerciseData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...exerciseData }: Partial<CreateExerciseDto> & { id: string }) => {
      const { data } = await axios.patch<Exercise>(`${API_URL}/${id}`, exerciseData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercise', data.id] });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
