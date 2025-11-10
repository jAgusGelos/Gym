export enum UserRole {
  SOCIO = 'SOCIO',
  ADMIN = 'ADMIN',
  ENTRENADOR = 'ENTRENADOR',
  RECEPCIONISTA = 'RECEPCIONISTA',
}

export enum UserStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: UserRole;
  qrCode: string;
  estado: UserStatus;
  avatar?: string;
  fechaNacimiento?: string;
  fechaRegistro: string;
  updatedAt: string;
}
