/**
 * Tipos reutilizables para datos de formularios
 */

import { GoalType } from './goal.types';

// Tipo para datos enviados desde el formulario de objetivos (goals)
export interface GoalFormSubmitData {
  tipo: GoalType;
  titulo: string;
  descripcion?: string;
  pesoObjetivo?: number;
  grasaCorporalObjetivo?: number;
  masaMuscularObjetivo?: number;
  fechaInicio: string;
  fechaObjetivo?: string;
}

// Tipo para datos de formularios de mediciones corporales
export interface MeasurementFormData {
  weight?: number;
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  calves?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
}

// Tipo para datos del formulario de progreso
export interface ProgressEntryFormData {
  fecha: string;
  peso?: string | number;
  grasaCorporal?: string | number;
  pecho?: string | number;
  cintura?: string | number;
  caderas?: string | number;
  notas?: string;
}

// Tipo para cambios en campos de entrada (genérico)
export type InputChangeValue = string | number | boolean | null | undefined;

// Tipo para handlers de cambio de input
export type InputChangeHandler<T> = (field: keyof T, value: InputChangeValue) => void;
