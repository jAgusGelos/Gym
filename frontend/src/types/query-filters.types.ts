/**
 * Tipos reutilizables para filtros de queries
 */

// Filtro base para queries paginadas
export interface PaginationFilters {
  page?: number;
  limit?: number;
}

// Filtros por rango de fechas
export interface DateRangeFilters {
  startDate?: string;
  endDate?: string;
}

// Filtros para workout logs
export interface WorkoutLogFilters extends DateRangeFilters {
  exerciseId?: string;
  routineId?: string;
}

// Filtros para rutinas
export interface RoutineFilters extends PaginationFilters {
  nivel?: string;
  objetivo?: string;
  activo?: boolean;
  publico?: boolean;
  search?: string;
}

// Filtros para ejercicios
export interface ExerciseFilters extends PaginationFilters {
  categoria?: string;
  musculoPrincipal?: string;
  equipamiento?: string;
  search?: string;
}

// Filtros para miembros (admin)
export interface MemberFilters extends PaginationFilters {
  search?: string;
  status?: string;
  planId?: string;
}

// Filtros para pagos (admin)
export interface PaymentFilters extends PaginationFilters, DateRangeFilters {
  status?: string;
  userId?: string;
  planId?: string;
}

// Tipo genérico para filtros
export type QueryFilters = Record<string, string | number | boolean | undefined>;
