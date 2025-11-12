import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { QrCode as QrCodeIcon, Info } from 'lucide-react';

export const QRPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <QrCodeIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Mi Código QR</h1>
        </div>
        <p className="text-primary-100">
          Mostrá este código al ingresar al gimnasio
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* QR Code Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              {user.qrCode ? (
                <>
                  <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">
                    <QRCode
                      value={user.qrCode}
                      size={256}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {user.qrCode}
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <QrCodeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No tenés un código QR asignado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Información */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5" />
              Cómo usar tu QR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <span>Abrí esta pantalla cuando llegues al gimnasio</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold">
                  2
                </span>
                <span>Mostrá el código QR al personal de recepción</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold">
                  3
                </span>
                <span>Esperá a que escaneen tu código para registrar tu entrada</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Advertencia */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Importante:</strong> No compartas tu código QR con otras personas.
            Es único y personal.
          </p>
        </div>
      </div>
    </div>
  );
};
