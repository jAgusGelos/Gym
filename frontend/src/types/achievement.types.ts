export enum AchievementCategory {
  ASISTENCIA = 'ASISTENCIA',
  ENTRENAMIENTO = 'ENTRENAMIENTO',
  PROGRESO = 'PROGRESO',
  SOCIAL = 'SOCIAL',
}

export enum AchievementCriterio {
  // Asistencia
  ASISTIR_7_DIAS = 'ASISTIR_7_DIAS',
  ASISTIR_30_DIAS = 'ASISTIR_30_DIAS',
  ASISTIR_100_DIAS = 'ASISTIR_100_DIAS',
  ASISTIR_365_DIAS = 'ASISTIR_365_DIAS',
  RACHA_7_DIAS = 'RACHA_7_DIAS',
  RACHA_30_DIAS = 'RACHA_30_DIAS',

  // Entrenamientos
  COMPLETAR_10_ENTRENAMIENTOS = 'COMPLETAR_10_ENTRENAMIENTOS',
  COMPLETAR_50_ENTRENAMIENTOS = 'COMPLETAR_50_ENTRENAMIENTOS',
  COMPLETAR_100_ENTRENAMIENTOS = 'COMPLETAR_100_ENTRENAMIENTOS',
  COMPLETAR_500_ENTRENAMIENTOS = 'COMPLETAR_500_ENTRENAMIENTOS',

  // Progreso
  REGISTRAR_PRIMER_PROGRESO = 'REGISTRAR_PRIMER_PROGRESO',
  REGISTRAR_10_PROGRESOS = 'REGISTRAR_10_PROGRESOS',
  REGISTRAR_50_PROGRESOS = 'REGISTRAR_50_PROGRESOS',
  PERDER_5KG = 'PERDER_5KG',
  PERDER_10KG = 'PERDER_10KG',
  GANAR_5KG = 'GANAR_5KG',
  GANAR_10KG = 'GANAR_10KG',

  // Social
  RESERVAR_PRIMERA_CLASE = 'RESERVAR_PRIMERA_CLASE',
  RESERVAR_10_CLASES = 'RESERVAR_10_CLASES',
  RESERVAR_50_CLASES = 'RESERVAR_50_CLASES',
  ASISTIR_10_CLASES = 'ASISTIR_10_CLASES',
  ASISTIR_50_CLASES = 'ASISTIR_50_CLASES',
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  categoria: AchievementCategory;
  criterio: AchievementCriterio;
  objetivo: number;
  puntos: number;
  orden: number;
  activo: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  achievement: Achievement;
  progresoActual: number;
  completado: boolean;
  fechaCompletado: Date | null;
}

export interface UserAchievementStats {
  totalLogros: number;
  logrosCompletados: number;
  puntosTotal: number;
  porcentajeCompletado: number;
  ultimosLogros: {
    nombre: string;
    icono: string;
    puntos: number;
    fecha: Date;
  }[];
}
