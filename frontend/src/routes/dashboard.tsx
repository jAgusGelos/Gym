import { useAuth } from '../hooks/useAuth';
import { useMyBookings } from '../hooks/useClasses';
import { Card, CardHeader, CardTitle, CardContent, Loading } from '../components/ui';
import { Link } from '@tanstack/react-router';
import { Calendar, QrCode, Dumbbell, TrendingUp, Clock, ChevronRight } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useMyBookings();

  const activeBookings = bookings?.filter(b => b.estado === 'RESERVADO') || [];
  const upcomingBookings = activeBookings.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-1">
          Hola, {user?.nombre}! 👋
        </h1>
        <p className="text-primary-100">
          Bienvenido a tu gimnasio
        </p>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/qr">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Mi QR</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Check-in rápido
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/classes">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Clases</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Reservar ahora
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/routines">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3">
                  <Dumbbell className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Rutinas</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ver entrenamientos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/workouts">
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Entrenamientos</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Registrar progreso
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Próximas clases */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Próximas clases
              </CardTitle>
              <Link
                to="/classes"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loading size="sm" />
            ) : upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          Clase reservada
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(booking.createdAt).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                    {booking.enListaEspera && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                        Lista #{booking.posicionListaEspera}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No tenés clases reservadas
                </p>
                <Link to="/classes" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                  Reservar clase
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-primary-600">
                {activeBookings.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Reservas activas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Check-ins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Rutinas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
