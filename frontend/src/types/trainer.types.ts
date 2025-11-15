import { User } from './user.types';
import { Routine } from './routine.types';
import { Booking } from './class.types';

export interface TrainerClient extends User {
  routineCount: number;
  latestRoutine: {
    id: string;
    nombre: string;
    objetivo: string;
    createdAt: string;
  } | null;
}

export interface ClientDetails {
  client: User;
  routines: Routine[];
  recentClasses: Booking[];
}

export interface TrainerClass {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  cupoMaximo: number;
  cupoActual: number;
  fechaHoraInicio: string;
  instructorId: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  attendanceCount: number;
}

export interface TrainerStats {
  totalClients: number;
  totalRoutines: number;
  activeRoutines: number;
  totalClasses: number;
  totalAttendance: number;
  upcomingClasses: number;
}
