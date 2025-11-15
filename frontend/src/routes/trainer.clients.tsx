import { createFileRoute, Link } from '@tanstack/react-router';
import { Users, Search, ChevronRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useMyClients } from '../hooks/useTrainers';

export const Route = createFileRoute('/trainer/clients')({
  component: TrainerClientsPage,
});

function TrainerClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: clients, isLoading } = useMyClients();

  const filteredClients = clients?.filter((client) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${client.nombre} ${client.apellido}`.toLowerCase();
    return fullName.includes(query) || client.email.toLowerCase().includes(query);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Clientes</h1>
            <p className="text-sm text-gray-600">Gestiona y hace seguimiento de tus clientes</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Clientes</p>
          <p className="text-2xl font-bold text-gray-900">{clients?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Clientes con Rutinas Activas</p>
          <p className="text-2xl font-bold text-gray-900">
            {clients?.filter((c) => c.latestRoutine).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Rutinas Asignadas</p>
          <p className="text-2xl font-bold text-gray-900">
            {clients?.reduce((sum, c) => sum + c.routineCount, 0) || 0}
          </p>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Clientes</h2>
        </div>

        {!filteredClients || filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron clientes' : 'No hay clientes'}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'Aún no tienes clientes asignados con rutinas'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <Link
                key={client.id}
                to="/trainer/clients/$clientId"
                params={{ clientId: client.id }}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-lg">
                        {client.nombre[0]}
                        {client.apellido[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {client.nombre} {client.apellido}
                      </h3>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {client.routineCount} {client.routineCount === 1 ? 'rutina' : 'rutinas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {client.latestRoutine ? (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {client.latestRoutine.nombre}
                        </p>
                        <p className="text-xs text-gray-600">{client.latestRoutine.objetivo}</p>
                        <span className="inline-flex items-center mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          Activa
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        Sin rutina activa
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
