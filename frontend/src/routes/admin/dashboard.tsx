import { useAdminStats } from '../../hooks/useAdmin';
import { Card, CardHeader, CardTitle, CardContent, Loading } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { QuickActionCard } from '../../components/ui/QuickActionCard';
import { Users, UserCheck, Calendar, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <Loading className="py-12" />;
  }

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
        <StatCard
          label="Total Socios"
          value={stats?.totalSocios || 0}
          icon={Users}
          iconColor="blue"
        />

        <StatCard
          label="Socios Activos"
          value={stats?.sociosActivos || 0}
          icon={UserCheck}
          iconColor="green"
        />

        <StatCard
          label="Clases Hoy"
          value={stats?.clasesHoy || 0}
          icon={Calendar}
          iconColor="purple"
        />

        <StatCard
          label="Asistencias Hoy"
          value={stats?.asistenciasHoy || 0}
          icon={TrendingUp}
          iconColor="orange"
        />

        <StatCard
          label="Ingresos del Mes"
          value={`$${stats?.ingresosMes?.toLocaleString('es-AR') || 0}`}
          icon={DollarSign}
          iconColor="emerald"
        />

        <StatCard
          label="Membresías por Vencer"
          value={stats?.membresiasVencen || 0}
          icon={AlertTriangle}
          iconColor="red"
        />
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
        <QuickActionCard
          title="Nuevo Socio"
          description="Registrar miembro"
          icon={Users}
          iconColor="primary"
        />

        <QuickActionCard
          title="Nueva Clase"
          description="Crear clase"
          icon={Calendar}
          iconColor="green"
        />

        <QuickActionCard
          title="Registrar Pago"
          description="Nuevo pago"
          icon={DollarSign}
          iconColor="emerald"
        />

        <QuickActionCard
          title="Ver Reportes"
          description="Estadísticas detalladas"
          icon={TrendingUp}
          iconColor="purple"
        />
      </div>
    </div>
  );
};
