import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  icono: string; // emoji o nombre de icono

  @Column({ type: 'enum', enum: AchievementCategory })
  categoria: AchievementCategory;

  @Column({ type: 'enum', enum: AchievementCriterio, unique: true })
  criterio: AchievementCriterio;

  @Column({ type: 'int' })
  objetivo: number; // número requerido para completar

  @Column({ type: 'int', default: 10 })
  puntos: number; // puntos que otorga

  @Column({ type: 'int', default: 0 })
  orden: number; // para ordenar en la UI

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
