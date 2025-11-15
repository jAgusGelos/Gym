import { useState } from 'react';
import { usePlans, useCreatePreference } from '../hooks/usePlans';
import { Card, CardContent, Button, Loading } from '../components/ui';
import { useToast } from '../stores/toastStore';
import { Check, CreditCard, Calendar, Sparkles } from 'lucide-react';
import { MembershipPlan } from '../types/plan.types';

export const PlansPage = () => {
  const { data: plans, isLoading } = usePlans();
  const createPreference = useCreatePreference();
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);

    try {
      const preference = await createPreference.mutateAsync({ planId });

      // Redirect to MercadoPago checkout
      if (preference.initPoint) {
        window.location.href = preference.initPoint;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al procesar el pago');
      setSelectedPlan(null);
    }
  };

  const getPlanColor = (plan: MembershipPlan) => {
    if (plan.destacado) {
      return 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50';
    }
    return 'border-gray-200';
  };

  const getPlanDuration = (duracionDias: number) => {
    if (duracionDias === 30) return '1 mes';
    if (duracionDias === 90) return '3 meses';
    if (duracionDias === 180) return '6 meses';
    if (duracionDias === 365) return '12 meses';
    return `${duracionDias} días`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3">Elegí tu Plan</h1>
            <p className="text-xl text-blue-100 mb-2">
              Encontrá el plan perfecto para tus objetivos
            </p>
            <p className="text-blue-200 text-sm">
              Todos los planes incluyen acceso completo al gimnasio
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all hover:shadow-xl ${getPlanColor(plan)}`}
            >
              {plan.destacado && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 text-xs font-bold">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  MÁS POPULAR
                </div>
              )}

              <CardContent className="p-6 space-y-6">
                {/* Plan Header */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.descripcion}
                  </p>

                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.precio.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{getPlanDuration(plan.duracionDias)}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  {plan.beneficios?.map((beneficio, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{beneficio}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  isLoading={selectedPlan === plan.id && createPreference.isPending}
                  disabled={createPreference.isPending}
                  className={`w-full ${
                    plan.destacado
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : ''
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {selectedPlan === plan.id && createPreference.isPending
                    ? 'Procesando...'
                    : 'Comprar Ahora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {plans?.length === 0 && (
          <div className="text-center py-16">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay planes disponibles
            </h3>
            <p className="text-gray-600">
              Por el momento no hay planes para mostrar
            </p>
          </div>
        )}

        {/* Info */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información sobre Pagos
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Pagá con tarjeta de crédito/débito a través de MercadoPago</p>
            <p>✓ Procesamiento seguro y encriptado</p>
            <p>✓ Tu membresía se activa automáticamente al confirmar el pago</p>
            <p>✓ Recibís un email de confirmación con los detalles</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
