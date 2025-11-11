import { Link, useSearch } from '@tanstack/react-router';
import { Button, Card, CardContent } from '../components/ui';
import { XCircle, Home, RefreshCw } from 'lucide-react';

export const PaymentFailurePage = () => {
  const search = useSearch({ from: '/payment/failure' }) as any;

  const paymentId = search?.payment_id;
  const status = search?.status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Pago Rechazado
            </h1>
            <p className="text-gray-600">
              No pudimos procesar tu pago
            </p>
          </div>

          {/* Payment Details */}
          {(paymentId || status) && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de Transacción:</span>
                  <span className="font-mono text-gray-900">{paymentId}</span>
                </div>
              )}
              {status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-semibold text-red-600 capitalize">
                    {status === 'rejected' ? 'Rechazado' : status}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="space-y-2 text-sm text-gray-700 text-left bg-yellow-50 rounded-lg p-4">
            <p className="font-semibold text-yellow-900 mb-2">
              Posibles causas:
            </p>
            <p>• Fondos insuficientes</p>
            <p>• Datos incorrectos de la tarjeta</p>
            <p>• Límite de compra superado</p>
            <p>• Pago cancelado por el usuario</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Link to="/plans">
              <Button className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar Nuevamente
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>

          {/* Help */}
          <p className="text-xs text-gray-500 pt-4 border-t">
            Si el problema persiste, contactá con el gimnasio para asistencia
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailurePage;
