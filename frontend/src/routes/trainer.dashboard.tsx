import { createFileRoute, Link } from '@tanstack/react-router';
import { Users, Calendar, TrendingUp, Award, BookOpen, ChevronRight } from 'lucide-react';
import { useMyClients, useTrainerStats, useMyTrainerClasses } from '../hooks/useTrainers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Route = createFileRoute('/trainer/dashboard')({
  component: TrainerDashboardPage,
});

function TrainerDashboardPage() {
  const { data: clients, isLoading: loadingClients } = useMyClients();
  const { data: stats, isLoading: loadingStats } = useTrainerStats();
  const { data: classes, isLoading: loadingClasses } = useMyTrainerClasses();

  const upcomingClasses = classes
    ?.filter((c) => new Date(c.fechaHoraInicio) > new Date())
    .sort((a, b) => new Date(a.fechaHoraInicio).getTime() - new Date(b.fechaHoraInicio).getTime())
    .slice(0, 5);

  if (loadingClients || loadingStats || loadingClasses) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Entrenador</h1>
        <p className="text-sm text-gray-600">Gestiona tus clientes y clases</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mis Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rutinas Activas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeRoutines}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mis Clientes
            </h2>
            <Link
              to="/trainer/clients"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {!clients || clients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay clientes</h3>
              <p className="text-gray-600">
                Aún no tienes clientes asignados con rutinas
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {clients.slice(0, 5).map((client) => (
                <Link
                  key={client.id}
                  to="/trainer/clients/$clientId"
                  params={{ clientId: client.id }}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {client.nombre[0]}
                          {client.apellido[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {client.nombre} {client.apellido}
                        </p>
                        <p className="text-sm text-gray-600">
                          {client.routineCount} {client.routineCount === 1 ? 'rutina' : 'rutinas'}
                        </p>
                      </div>
                    </div>
                    {client.latestRoutine && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {client.latestRoutine.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          {client.latestRoutine.objetivo}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Próximas Clases */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximas Clases
            </h2>
          </div>

          {!upcomingClasses || upcomingClasses.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay clases próximas
              </h3>
              <p className="text-gray-600">No tienes clases programadas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(
                          new Date(classItem.fechaHoraInicio),
                          "d 'de' MMMM, yyyy 'a las' HH:mm",
                          { locale: es },
                        )}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span>
                          {classItem.cupoActual}/{classItem.cupoMaximo} reservados
                        </span>
                        <span>•</span>
                        <span>{classItem.duracion} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm mb-1">Total Rutinas Creadas</p>
                <p className="text-4xl font-bold">{stats.totalRoutines}</p>
              </div>
              <BookOpen className="w-12 h-12 text-indigo-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Asistencias</p>
                <p className="text-4xl font-bold">{stats.totalAttendance}</p>
              </div>
              <Award className="w-12 h-12 text-green-200 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Clases Activas</p>
                <p className="text-4xl font-bold">{stats.upcomingClasses}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-200 opacity-50" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
