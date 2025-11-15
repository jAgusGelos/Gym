export enum BookingStatus {
  RESERVADO = 'RESERVADO',
  CANCELADO = 'CANCELADO',
  ASISTIDO = 'ASISTIDO',
  NO_ASISTIO = 'NO_ASISTIO',
}

export interface Instructor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface Class {
  id: string;
  nombre: string;
  descripcion: string;
  instructor: Instructor;
  instructorId: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  cupoMaximo: number;
  cupoActual: number;
  activo: boolean;
  imagenUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  class?: Class;
  estado: BookingStatus;
  posicionListaEspera?: number;
  enListaEspera: boolean;
  fechaReserva: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  classId: string;
}

export interface PaginatedBookings {
  data: Booking[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AttendanceStats {
  totalBookings: number;
  totalAttended: number;
  totalMissed: number;
  totalCancelled: number;
  attendanceRate: number;
}

export interface MonthlyAttendance {
  month: string;
  attended: number;
  missed: number;
  cancelled: number;
}
