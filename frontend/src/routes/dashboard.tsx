import { useAuth } from "../hooks/useAuth";
import { useMyBookings } from "../hooks/useClasses";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Loading,
} from "../components/ui";
import { StatCard } from "../components/ui/StatCard";
import { QuickActionCard } from "../components/ui/QuickActionCard";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  QrCode,
  Dumbbell,
  TrendingUp,
  ChevronRight,
  Settings,
  Clock,
  BookCheck,
} from "lucide-react";
import { UserRole } from "../types/user.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: bookingsData, isLoading } = useMyBookings();

  const bookings = Array.isArray(bookingsData) ? bookingsData : bookingsData?.data || [];
  const activeBookings = bookings.filter((b) => b.estado === "RESERVADO");
  const upcomingBookings = activeBookings.slice(0, 3);

  // Helper para parsear fecha del backend en zona horaria local
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const isStaff = user && [UserRole.ADMIN, UserRole.RECEPCIONISTA, UserRole.ENTRENADOR].includes(user.rol as UserRole);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-primary-600 text-white p-6 pb-8">
        <h1 className="text-2xl font-bold mb-1">Hola, {user?.nombre}! 👋</h1>
        <p className="text-primary-100">Bienvenido a tu gimnasio</p>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {/* Admin Access Banner */}
        {isStaff && (
          <Link to="/admin">
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="w-5 h-5" />
                      <h3 className="font-semibold">Panel de Administración</h3>
                    </div>
                    <p className="text-sm text-indigo-100">
                      Acceso rápido a gestión del gimnasio
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/qr">
            <QuickActionCard
              title="Mi QR"
              description="Check-in rápido"
              icon={QrCode}
              iconColor="primary"
            />
          </Link>

          <Link to="/classes">
            <QuickActionCard
              title="Clases"
              description="Reservar ahora"
              icon={Calendar}
              iconColor="green"
            />
          </Link>

          <Link to="/routines">
            <QuickActionCard
              title="Rutinas"
              description="Ver entrenamientos"
              icon={Dumbbell}
              iconColor="purple"
            />
          </Link>

          <Link to="/workouts">
            <QuickActionCard
              title="Entrenamientos"
              description="Registrar progreso"
              icon={TrendingUp}
              iconColor="orange"
            />
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
                    className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {booking.class?.nombre || 'Clase'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {format(parseLocalDate(booking.classDate), "EEE d 'de' MMM", { locale: es })}
                          </p>
                          {booking.schedule && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock className="w-3 h-3" />
                                {booking.schedule.startTime.substring(0, 5)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {booking.enListaEspera && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded flex-shrink-0">
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
                <Link
                  to="/classes"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                >
                  Reservar clase
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Reservas activas"
            value={activeBookings.length}
            icon={BookCheck}
            iconColor="blue"
            size="sm"
          />

          <StatCard
            label="Check-ins"
            value={0}
            icon={Calendar}
            iconColor="green"
            size="sm"
          />

          <StatCard
            label="Rutinas"
            value={0}
            icon={Dumbbell}
            iconColor="purple"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
