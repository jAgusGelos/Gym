export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface ClassSchedule {
  id?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  instructorId: string;
  instructor?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  cupoMaximo?: number;
  activo?: boolean;
}

export interface Class {
  id: string;
  nombre: string;
  descripcion: string;
  cupoMaximo: number;
  activo: boolean;
  imagenUrl?: string;
  schedules: ClassSchedule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  scheduleId: string;
  classDate: Date;
  class?: Class;
  schedule?: ClassSchedule;
  estado: BookingStatus;
  enListaEspera: boolean;
  posicionListaEspera?: number;
  fechaReserva: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  RESERVADO = 'RESERVADO',
  CANCELADO = 'CANCELADO',
  ASISTIDO = 'ASISTIDO',
  NO_ASISTIO = 'NO_ASISTIO',
}

export interface CreateBookingDto {
  scheduleId: string;
  classDate: string; // YYYY-MM-DD
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
