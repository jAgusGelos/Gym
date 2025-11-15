export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

export enum SubscriptionFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual',
  ANNUAL = 'annual',
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
  };
  mercadopagoSubscriptionId: string | null;
  mercadopagoPreapprovalId: string | null;
  status: SubscriptionStatus;
  frequency: SubscriptionFrequency;
  amount: number;
  startDate: string;
  nextBillingDate: string | null;
  endDate: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  successfulPayments: number;
  failedPayments: number;
  lastPaymentDate: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionDto {
  planId: string;
  frequency: SubscriptionFrequency;
  startDate?: string;
}

export interface UpdateSubscriptionDto {
  status?: SubscriptionStatus;
  cancelReason?: string;
}
