import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, Calendar, TrendingUp, User } from 'lucide-react';
import { useClientDetails } from '../hooks/useTrainers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Route = createFileRoute('/trainer/clients/$clientId')({
  component: ClientDetailPage,
});

function ClientDetailPage() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useClientDetails(clientId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Cliente no encontrado</h3>
        <button
          onClick={() => navigate({ to: '/trainer/clients' })}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Volver a Clientes
        </button>
      </div>
    );
  }

  const { client, routines, recentClasses } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/trainer/clients' })}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-semibold text-2xl">
              {client.nombre[0]}
              {client.apellido[0]}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {client.nombre} {client.apellido}
            </h1>
            <p className="text-sm text-gray-600">{client.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rutinas Asignadas</p>
              <p className="text-2xl font-bold text-gray-900">{routines.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rutinas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {routines.filter((r) => r.activo).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Clases Asistidas</p>
              <p className="text-2xl font-bold text-gray-900">{recentClasses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rutinas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Rutinas Asignadas
            </h2>
          </div>

          {routines.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay rutinas</h3>
              <p className="text-gray-600">Este cliente no tiene rutinas asignadas</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {routines.map((routine) => (
                <Link
                  key={routine.id}
                  to="/routines/$routineId"
                  params={{ routineId: routine.id }}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{routine.nombre}</h3>
                        {routine.activo && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Activa
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{routine.descripcion}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded">{routine.objetivo}</span>
                        <span>{routine.diasSemana} días/semana</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Clases Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Clases Recientes
            </h2>
          </div>

          {recentClasses.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay clases registradas
              </h3>
              <p className="text-gray-600">
                Este cliente no ha asistido a clases recientemente
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentClasses.map((booking: any) => (
                <div key={booking.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {booking.class?.nombre || 'Clase'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.class?.fechaHoraInicio &&
                          format(
                            new Date(booking.class.fechaHoraInicio),
                            "d 'de' MMMM, yyyy",
                            { locale: es },
                          )}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Asistió
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Client Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-900">{client.email}</p>
          </div>
          {client.telefono && (
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="font-medium text-gray-900">{client.telefono}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                client.estado === 'ACTIVO'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {client.estado}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Miembro desde</p>
            <p className="font-medium text-gray-900">
              {format(new Date(client.fechaRegistro || client.createdAt), 'MMMM yyyy', {
                locale: es,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
