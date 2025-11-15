import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  useMySubscriptions,
  useActiveSubscription,
  useCancelSubscription,
  usePauseSubscription,
  useResumeSubscription,
} from '../hooks/useSubscriptions';
import { SubscriptionStatus, SubscriptionFrequency } from '../types/subscription.types';
import { useToastStore } from '../stores/toastStore';

export const Route = createFileRoute('/subscriptions/')({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  const showToast = useToastStore((state) => state.showToast);
  const { data: subscriptions, isLoading } = useMySubscriptions();
  const { data: activeSubscription } = useActiveSubscription();

  const cancelMutation = useCancelSubscription();
  const pauseMutation = usePauseSubscription();
  const resumeMutation = useResumeSubscription();

  const handleCancel = async () => {
    if (!showCancelModal) return;

    try {
      await cancelMutation.mutateAsync({ id: showCancelModal, cancelReason });
      showToast('Suscripción cancelada exitosamente', 'success');
      setShowCancelModal(null);
      setCancelReason('');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cancelar suscripción', 'error');
    }
  };

  const handlePause = async (id: string) => {
    if (!confirm('¿Estás seguro de pausar tu suscripción?')) return;

    try {
      await pauseMutation.mutateAsync(id);
      showToast('Suscripción pausada exitosamente', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al pausar suscripción', 'error');
    }
  };

  const handleResume = async (id: string) => {
    if (!confirm('¿Deseas reanudar tu suscripción?')) return;

    try {
      await resumeMutation.mutateAsync(id);
      showToast('Suscripción reanudada exitosamente', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al reanudar suscripción', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Suscripciones</h1>
            <p className="text-sm text-gray-600">Gestiona tus suscripciones de membresía</p>
          </div>
        </div>
        {!activeSubscription && (
          <Link
            to="/plans"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Ver Planes
          </Link>
        )}
      </div>

      {/* Active Subscription Card */}
      {activeSubscription && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Suscripción Activa</h2>
                <p className="text-indigo-100">{activeSubscription.plan.nombre}</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-semibold">
              ${activeSubscription.amount}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-indigo-100 text-sm mb-1">Frecuencia</p>
              <p className="font-semibold">{getFrequencyLabel(activeSubscription.frequency)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-indigo-100 text-sm mb-1">Próximo Cargo</p>
              <p className="font-semibold">
                {activeSubscription.nextBillingDate
                  ? format(new Date(activeSubscription.nextBillingDate), 'd MMM yyyy', {
                      locale: es,
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-indigo-100 text-sm mb-1">Pagos Exitosos</p>
              <p className="font-semibold">{activeSubscription.successfulPayments}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handlePause(activeSubscription.id)}
              disabled={pauseMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
              Pausar
            </button>
            <button
              onClick={() => setShowCancelModal(activeSubscription.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Subscriptions History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Suscripciones</h2>
        </div>

        {!subscriptions || subscriptions.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes suscripciones
            </h3>
            <p className="text-gray-600 mb-6">
              Suscríbete a un plan para disfrutar de renovación automática
            </p>
            <Link
              to="/plans"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ver Planes Disponibles
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subscription.plan.nombre}
                      </h3>
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{subscription.plan.descripcion}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${subscription.amount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {getFrequencyLabel(subscription.frequency)}
                      </div>
                      <div>
                        Inicio:{' '}
                        {format(new Date(subscription.startDate), 'd MMM yyyy', { locale: es })}
                      </div>
                      {subscription.successfulPayments > 0 && (
                        <div>
                          {subscription.successfulPayments} pago
                          {subscription.successfulPayments > 1 ? 's' : ''} exitoso
                          {subscription.successfulPayments > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {subscription.status === SubscriptionStatus.PAUSED && (
                      <button
                        onClick={() => handleResume(subscription.id)}
                        disabled={resumeMutation.isPending}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Reanudar
                      </button>
                    )}
                  </div>
                </div>

                {subscription.cancelReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Motivo de cancelación:</strong> {subscription.cancelReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancelar Suscripción</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas cancelar tu suscripción? Esta acción no se puede
              deshacer.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de cancelación (opcional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Cuéntanos por qué cancelas..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelMutation.isPending ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusBadge(status: SubscriptionStatus) {
  const badges: Record<SubscriptionStatus, { color: string; label: string }> = {
    [SubscriptionStatus.ACTIVE]: { color: 'bg-green-100 text-green-700', label: 'Activa' },
    [SubscriptionStatus.PAUSED]: { color: 'bg-yellow-100 text-yellow-700', label: 'Pausada' },
    [SubscriptionStatus.CANCELLED]: { color: 'bg-red-100 text-red-700', label: 'Cancelada' },
    [SubscriptionStatus.PENDING]: { color: 'bg-gray-100 text-gray-700', label: 'Pendiente' },
    [SubscriptionStatus.EXPIRED]: { color: 'bg-gray-100 text-gray-700', label: 'Expirada' },
  };

  const badge = badges[status];
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>{badge.label}</span>
  );
}

function getFrequencyLabel(frequency: SubscriptionFrequency): string {
  const labels: Record<SubscriptionFrequency, string> = {
    [SubscriptionFrequency.MONTHLY]: 'Mensual',
    [SubscriptionFrequency.QUARTERLY]: 'Trimestral',
    [SubscriptionFrequency.BIANNUAL]: 'Semestral',
    [SubscriptionFrequency.ANNUAL]: 'Anual',
  };

  return labels[frequency];
}
