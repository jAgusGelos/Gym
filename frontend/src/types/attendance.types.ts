export interface Attendance {
  id: string;
  userId: string;
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  tipoCheckIn: CheckInType;
  horaEntrada: Date;
  horaSalida?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum CheckInType {
  QR = 'QR',
  MANUAL = 'MANUAL',
}

export interface CheckInDto {
  qrCode: string;
}

export interface ManualCheckInDto {
  userId: string;
}
