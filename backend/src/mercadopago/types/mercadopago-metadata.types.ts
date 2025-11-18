/**
 * Tipos para los campos metadata de MercadoPago
 * Estos campos almacenan información adicional de las transacciones
 */

// Metadata para suscripciones de MercadoPago
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

// Metadata para pagos online de MercadoPago
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

// Tipo genérico para metadata
export type MercadoPagoMetadata = SubscriptionMetadata | PaymentMetadata | Record<string, unknown>;
