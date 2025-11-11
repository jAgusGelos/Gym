import { MembershipType } from './membership.types';

export interface MembershipPlan {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: MembershipType;
  precio: number;
  duracionDias: number;
  beneficios: string[];
  activo: boolean;
  destacado: boolean;
  orden: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROCESS = 'in_process',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OnlinePayment {
  id: string;
  userId: string;
  planId: string;
  plan?: MembershipPlan;
  membershipId?: string;
  preferenceId: string;
  paymentId?: string;
  merchantOrderId?: string;
  status: PaymentStatus;
  amount: number;
  paymentType?: string;
  paymentMethod?: string;
  metadata?: any;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePreferenceDto {
  planId: string;
}

export interface PaymentPreference {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}
