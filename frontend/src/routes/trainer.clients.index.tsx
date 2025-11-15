import { createFileRoute, Link } from '@tanstack/react-router';
import { useWorkoutClients } from '../hooks/useTrainer';

export const Route = createFileRoute('/trainer/clients/')({
  component: TrainerClientsPage,
});

function TrainerClientsPage() {
  const { data: clients = [], isLoading } = useWorkoutClients();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando clientes...</p>
      </div>
    );
  }

  const goalLabels = {
    fuerza: 'Fuerza',
    hipertrofia: 'Hipertrofia',
    resistencia: 'Resistencia',
    perdida_peso: 'Pérdida de Peso',
    tonificacion: 'Tonificación',
    funcional: 'Funcional',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Clientes</h1>
          <p className="text-gray-600">Gestiona las rutinas y progreso de tus clientes</p>
        </div>
        <Link
          to="/trainer/routines/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          + Nueva Rutina
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No tienes clientes con rutinas asignadas aún.</p>
          <Link
            to="/trainer/routines/new"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Crear Primera Rutina
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Link
              key={client.id}
              to="/trainer/clients/$clientId"
              params={{ clientId: client.id }}
              className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {client.nombre} {client.apellido}
                  </h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {client.routineCount} {client.routineCount === 1 ? 'rutina' : 'rutinas'}
                </span>
              </div>

              {client.activeRoutine ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-600 font-medium mb-1">Rutina Activa</p>
                  <p className="font-semibold text-green-900">{client.activeRoutine.nombre}</p>
                  <p className="text-xs text-green-700">
                    {goalLabels[client.activeRoutine.objetivo]}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">Sin rutina activa</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Entrenamientos</p>
                  <p className="font-bold text-lg">{client.totalWorkouts}</p>
                </div>
                <div>
                  <p className="text-gray-600">Últimos 7 días</p>
                  <p className="font-bold text-lg">{client.recentWorkouts}</p>
                </div>
              </div>

              {client.recentWorkouts > 0 && (
                <div className="mt-4 flex items-center text-green-600 text-sm">
                  <span className="mr-1">✓</span>
                  <span>Activo esta semana</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
