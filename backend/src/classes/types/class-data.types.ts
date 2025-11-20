/**
 * Tipos para datos de clases
 * Usado en notificaciones y otros servicios
 */

export interface ClassData {
  id: string;
  nombre: string;
  descripcion?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  capacity?: number;
  currentCapacity?: number;
  trainerId?: string;
  trainerName?: string;
}

export interface MinimalClassData {
  id: string;
  nombre: string;
}
