import { useAdminStats } from '../../hooks/useAdmin';
import { Card, CardHeader, CardTitle, CardContent, Loading } from '../../components/ui';
import { Users, UserCheck, Calendar, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <Loading className="py-12" />;
  }

  const statCards = [
    {
      title: 'Total Socios',
      value: stats?.totalSocios || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Socios Activos',
      value: stats?.sociosActivos || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Clases Hoy',
      value: stats?.clasesHoy || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Asistencias Hoy',
      value: stats?.asistenciasHoy || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats?.ingresosMes?.toLocaleString('es-AR') || 0}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'Membresías por Vencer',
      value: stats?.membresiasVencen || 0,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Resumen general del gimnasio
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas */}
      {stats && stats.membresiasVencen > 0 && (
        <Card className="mb-6 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-500">
              <AlertTriangle className="w-5 h-5" />
              Atención requerida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Hay <strong>{stats.membresiasVencen}</strong> membresías que vencen en los próximos 7 días.
              Recordá contactar a estos socios para renovar.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Nuevo Socio</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Registrar miembro
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Nueva Clase</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Crear clase
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Registrar Pago</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nuevo pago
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Ver Reportes</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Estadísticas detalladas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
