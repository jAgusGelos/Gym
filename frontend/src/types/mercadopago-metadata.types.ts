/**
 * Tipos para los campos metadata de MercadoPago
 */

export interface SubscriptionMetadata {
  originalPlanId?: string;
  customerId?: string;
  externalReference?: string;
  payerEmail?: string;
  payerId?: string;
  autoRecurring?: {
    frequency: number;
    frequencyType: string;
    transactionAmount: number;
    currencyId: string;
  };
  backUrl?: string;
  notificationUrl?: string;
  reason?: string;
  additionalInfo?: Record<string, unknown>;
}

export interface PaymentMetadata {
  externalReference?: string;
  preferenceDescription?: string;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      areaCode?: string;
      number?: string;
    };
    identification?: {
      type?: string;
      number?: string;
    };
  };
  paymentMethodId?: string;
  installments?: number;
  transactionDetails?: {
    netReceivedAmount?: number;
    totalPaidAmount?: number;
    overpaidAmount?: number;
    installmentAmount?: number;
  };
  additionalInfo?: Record<string, unknown>;
}

export type MercadoPagoMetadata = SubscriptionMetadata | PaymentMetadata | Record<string, unknown>;
