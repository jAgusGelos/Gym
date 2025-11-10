export interface Membership {
  id: string;
  userId: string;
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  tipo: MembershipType;
  fechaInicio: Date;
  fechaExpiracion: Date;
  precio: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum MembershipType {
  MENSUAL = 'MENSUAL',
  TRIMESTRAL = 'TRIMESTRAL',
  SEMESTRAL = 'SEMESTRAL',
  ANUAL = 'ANUAL',
}

export interface CreateMembershipDto {
  userId: string;
  tipo: MembershipType;
  fechaInicio: string;
  precio: number;
}

export interface UpdateMembershipDto {
  tipo?: MembershipType;
  fechaInicio?: string;
  precio?: number;
  activo?: boolean;
}
