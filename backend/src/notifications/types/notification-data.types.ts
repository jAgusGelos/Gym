/**
 * Tipos específicos para el campo 'data' de las notificaciones
 * Cada tipo de notificación tiene su propio tipo de datos
 */

// Datos para notificaciones de clases
export interface ClassNotificationData {
  classId: string;
  className?: string;
  startTime?: string;
}

// Datos para notificaciones de membresía
export interface MembershipNotificationData {
  membershipId?: string;
  daysRemaining?: number;
  expiryDate?: string;
}

// Datos para notificaciones de pago
export interface PaymentNotificationData {
  paymentId?: string;
  amount?: number;
  planName?: string;
  transactionId?: string;
}

// Datos para notificaciones de suscripción
export interface SubscriptionNotificationData {
  subscriptionId?: string;
  planName?: string;
  nextBillingDate?: string;
  amount?: number;
}

// Datos para notificaciones de logros
export interface AchievementNotificationData {
  achievementId?: string;
  achievementName?: string;
  points?: number;
}

// Datos para notificaciones de objetivos
export interface GoalNotificationData {
  goalId: string;
  goalName?: string;
  targetValue?: number;
  currentValue?: number;
}

// Datos para notificaciones de rutinas
export interface RoutineNotificationData {
  routineId: string;
  routineName?: string;
  trainerId?: string;
}

// Datos para mensajes del entrenador
export interface TrainerMessageNotificationData {
  trainerId: string;
  trainerName?: string;
  messageId?: string;
}

// Datos para reservas
export interface BookingNotificationData {
  bookingId: string;
  classId?: string;
  className?: string;
  startTime?: string;
}

// Union type para todos los tipos de datos de notificaciones
export type NotificationData =
  | ClassNotificationData
  | MembershipNotificationData
  | PaymentNotificationData
  | SubscriptionNotificationData
  | AchievementNotificationData
  | GoalNotificationData
  | RoutineNotificationData
  | TrainerMessageNotificationData
  | BookingNotificationData
  | Record<string, unknown>; // Fallback para datos genéricos
