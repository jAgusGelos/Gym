/**
 * Tipos reutilizables para el manejo de errores
 */

// Tipo base para errores de API
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
  details?: Record<string, unknown>;
}

// Tipo de error de Axios
export interface AxiosErrorType {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    statusText?: string;
  };
  request?: unknown;
  message: string;
  code?: string;
  config?: unknown;
}

// Tipo genérico para errores con mensaje
export interface ErrorWithMessage {
  message: string;
}

// Type guard para verificar si un error tiene un mensaje
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

// Type guard para verificar si es un error de Axios
export function isAxiosError(error: unknown): error is AxiosErrorType {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

// Función helper para extraer el mensaje de error de forma segura
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Error desconocido';
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Error desconocido';
}
