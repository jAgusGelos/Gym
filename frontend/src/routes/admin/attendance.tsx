import { useState } from 'react';
import { useTodayAttendances, useCheckIn } from '../../hooks/useAttendance';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Loading } from '../../components/ui';
import { QrCode, UserCheck, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { AxiosErrorType } from '../../types/error.types';

export const AttendancePage = () => {
  const [qrCode, setQrCode] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const { data: attendancesData, isLoading } = useTodayAttendances();
  const checkIn = useCheckIn();

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!qrCode.trim()) {
      setCheckInStatus('error');
      setMessage('Por favor ingresá un código QR');
      return;
    }

    try {
      await checkIn.mutateAsync({ qrCode: qrCode.trim() });
      setCheckInStatus('success');
      setMessage('Check-in registrado exitosamente');
      setQrCode('');

      // Reset status after 3 seconds
      setTimeout(() => {
        setCheckInStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error: AxiosErrorType) {
      setCheckInStatus('error');
      setMessage(error.response?.data?.message || 'Error al registrar check-in');

      setTimeout(() => {
        setCheckInStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const todayTotal = attendancesData?.total || 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Control de Asistencia
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {todayTotal} asistencias registradas hoy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scanner QR */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Escanear QR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div className="flex flex-col items-center py-6">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                    <QrCode className="w-12 h-12 text-primary-600" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Escaneá el código QR del socio o ingresá manualmente
                  </p>
                </div>

                <Input
                  placeholder="Código QR del socio"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  autoFocus
                />

                {checkInStatus !== 'idle' && (
                  <div
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                      checkInStatus === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {checkInStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm">{message}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={checkIn.isPending}
                >
                  Registrar Check-in
                </Button>
              </form>

              {/* Estadísticas rápidas */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Hoy
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total asistencias</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {todayTotal}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial de hoy */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Asistencias de Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Loading className="py-12" />
              ) : attendancesData && attendancesData.data.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {attendancesData.data.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attendance.user?.nombre} {attendance.user?.apellido}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {attendance.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(attendance.horaEntrada).toLocaleTimeString('es-AR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {attendance.tipoCheckIn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No hay asistencias registradas hoy
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
