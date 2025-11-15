export enum GoalType {
  PERDER_PESO = 'PERDER_PESO',
  GANAR_PESO = 'GANAR_PESO',
  GANAR_MUSCULO = 'GANAR_MUSCULO',
  MEJORAR_RESISTENCIA = 'MEJORAR_RESISTENCIA',
  AUMENTAR_FUERZA = 'AUMENTAR_FUERZA',
  MEJORAR_FLEXIBILIDAD = 'MEJORAR_FLEXIBILIDAD',
  REDUCIR_GRASA = 'REDUCIR_GRASA',
  MANTENER_PESO = 'MANTENER_PESO',
  OTRO = 'OTRO',
}

export enum GoalStatus {
  ACTIVO = 'ACTIVO',
  COMPLETADO = 'COMPLETADO',
  ABANDONADO = 'ABANDONADO',
  PAUSADO = 'PAUSADO',
}

export interface UserGoal {
  id: string;
  userId: string;
  tipo: GoalType;
  titulo: string;
  descripcion?: string;
  pesoObjetivo?: number;
  grasaCorporalObjetivo?: number;
  masaMuscularObjetivo?: number;
  pesoInicial?: number;
  grasaCorporalInicial?: number;
  masaMuscularInicial?: number;
  fechaInicio: Date;
  fechaObjetivo?: Date;
  fechaCompletado?: Date;
  estado: GoalStatus;
  porcentajeProgreso: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalDto {
  tipo: GoalType;
  titulo: string;
  descripcion?: string;
  pesoObjetivo?: number;
  grasaCorporalObjetivo?: number;
  masaMuscularObjetivo?: number;
  pesoInicial?: number;
  grasaCorporalInicial?: number;
  masaMuscularInicial?: number;
  fechaInicio: string;
  fechaObjetivo?: string;
}

export interface UpdateGoalDto {
  tipo?: GoalType;
  titulo?: string;
  descripcion?: string;
  pesoObjetivo?: number;
  grasaCorporalObjetivo?: number;
  masaMuscularObjetivo?: number;
  fechaObjetivo?: string;
  estado?: GoalStatus;
}

export const goalTypeLabels: Record<GoalType, string> = {
  [GoalType.PERDER_PESO]: 'Perder Peso',
  [GoalType.GANAR_PESO]: 'Ganar Peso',
  [GoalType.GANAR_MUSCULO]: 'Ganar Músculo',
  [GoalType.MEJORAR_RESISTENCIA]: 'Mejorar Resistencia',
  [GoalType.AUMENTAR_FUERZA]: 'Aumentar Fuerza',
  [GoalType.MEJORAR_FLEXIBILIDAD]: 'Mejorar Flexibilidad',
  [GoalType.REDUCIR_GRASA]: 'Reducir Grasa Corporal',
  [GoalType.MANTENER_PESO]: 'Mantener Peso',
  [GoalType.OTRO]: 'Otro',
};

export const goalTypeIcons: Record<GoalType, string> = {
  [GoalType.PERDER_PESO]: '📉',
  [GoalType.GANAR_PESO]: '📈',
  [GoalType.GANAR_MUSCULO]: '💪',
  [GoalType.MEJORAR_RESISTENCIA]: '🏃',
  [GoalType.AUMENTAR_FUERZA]: '🏋️',
  [GoalType.MEJORAR_FLEXIBILIDAD]: '🤸',
  [GoalType.REDUCIR_GRASA]: '🔥',
  [GoalType.MANTENER_PESO]: '⚖️',
  [GoalType.OTRO]: '🎯',
};
