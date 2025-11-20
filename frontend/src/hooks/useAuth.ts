import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { useToast } from '../stores/toastStore';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types/auth.types';
import { AxiosErrorType, getErrorMessage } from '../types/error.types';

export const useAuth = () => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = () => {
    clearAuth();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  return {
    user,
    isAuthenticated,
    logout,
  };
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('¡Bienvenido!');
      navigate({ to: '/dashboard' });
    },
    onError: (error: AxiosErrorType) => {
      const message = error.response?.data?.message || 'Credenciales inválidas. Por favor, verificá tu email y contraseña.';
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('¡Cuenta creada exitosamente!');
      navigate({ to: '/dashboard' });
    },
    onError: (error: AxiosErrorType) => {
      const message = error.response?.data?.message || 'Error al crear la cuenta. Por favor, intentá nuevamente.';
      toast.error(message);
    },
  });
};
