import { useEffect } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { Button, Card, CardContent } from '../components/ui';
import { CheckCircle, Home, CreditCard } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const PaymentSuccessPage = () => {
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/payment/success' }) as any;

  const paymentId = search?.payment_id;
  const preferenceId = search?.preference_id;
  const status = search?.status;

  useEffect(() => {
    // Invalidate relevant queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['my-payments'] });
    queryClient.invalidateQueries({ queryKey: ['user-memberships'] });
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Pago Exitoso!
            </h1>
            <p className="text-gray-600">
              Tu membresía ha sido activada correctamente
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">ID de Pago:</span>
                <span className="font-mono text-gray-900">{paymentId}</span>
              </div>
            )}
            {status && (
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-semibold text-green-600 capitalize">
                  {status === 'approved' ? 'Aprobado' : status}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-2 text-sm text-gray-600 text-left bg-blue-50 rounded-lg p-4">
            <p className="font-semibold text-blue-900 mb-2">Próximos pasos:</p>
            <p>✓ Revisá tu email para ver el comprobante de pago</p>
            <p>✓ Tu membresía ya está activa</p>
            <p>✓ Podés ver tu QR en tu perfil</p>
            <p>✓ Ya podés reservar clases</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Link to="/dashboard">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Ir al Inicio
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Ver mi Membresía
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
