export interface Payment {
  id: string;
  userId: string;
  user?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  monto: number;
  metodoPago: PaymentMethod;
  concepto: string;
  estado: PaymentStatus;
  fechaPago: Date;
  comprobante?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  MERCADOPAGO = 'MERCADOPAGO',
}

export enum PaymentStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO',
}

export interface CreatePaymentDto {
  userId: string;
  monto: number;
  metodoPago: PaymentMethod;
  concepto: string;
  fechaPago?: string;
}

export interface UpdatePaymentDto {
  monto?: number;
  metodoPago?: PaymentMethod;
  concepto?: string;
  estado?: PaymentStatus;
  fechaPago?: string;
  comprobante?: string;
}
