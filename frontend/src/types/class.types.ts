export interface Class {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number;
  cupoMaximo: number;
  cupoActual: number;
  fechaHora: Date;
  instructorId: string;
  instructor?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  estado: BookingStatus;
  enListaEspera: boolean;
  posicionListaEspera?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  RESERVADO = 'RESERVADO',
  CANCELADO = 'CANCELADO',
  ASISTIDO = 'ASISTIDO',
  NO_ASISTIO = 'NO_ASISTIO',
}

export interface CreateBookingDto {
  classId: string;
}

export interface AttendanceStats {
  totalBookings: number;
  attendedClasses: number;
  canceledClasses: number;
  noShowClasses: number;
  attendanceRate: number;
  currentStreak: number;
  favoriteInstructor: {
    id: string;
    nombre: string;
    classCount: number;
  } | null;
}

export interface MonthlyAttendance {
  month: string;
  count: number;
}
