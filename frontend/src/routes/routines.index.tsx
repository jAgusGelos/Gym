import { createFileRoute, Link } from '@tanstack/react-router';
import { useMyRoutines, useActivateRoutine } from '../hooks/useWorkoutRoutines';

export const Route = createFileRoute('/routines/')({
  component: RoutinesPage,
});

function RoutinesPage() {
  const { data: routines = [], isLoading } = useMyRoutines();
  const activateRoutine = useActivateRoutine();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando rutinas...</p>
      </div>
    );
  }

  const activeRoutine = routines.find((r) => r.activa);
  const inactiveRoutines = routines.filter((r) => !r.activa);

  const handleActivate = async (id: string) => {
    if (confirm('¿Deseas activar esta rutina? Esto desactivará tu rutina actual.')) {
      await activateRoutine.mutateAsync(id);
    }
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Rutinas</h1>
        <p className="text-gray-600">Gestiona tus rutinas de entrenamiento</p>
      </div>

      {/* Active Routine */}
      {activeRoutine && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rutina Activa</h2>
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-green-900">{activeRoutine.nombre}</h3>
                <p className="text-gray-700 mt-1">{activeRoutine.descripcion}</p>
              </div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Activa
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Objetivo</p>
                <p className="font-semibold">{goalLabels[activeRoutine.objetivo]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duración</p>
                <p className="font-semibold">{activeRoutine.duracionSemanas} semanas</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Frecuencia</p>
                <p className="font-semibold">{activeRoutine.diasPorSemana} días/semana</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ejercicios</p>
                <p className="font-semibold">{activeRoutine.exercises?.length || 0}</p>
              </div>
            </div>

            {activeRoutine.trainer && (
              <p className="text-sm text-gray-600 mb-4">
                Creada por: {activeRoutine.trainer.nombre} {activeRoutine.trainer.apellido}
              </p>
            )}

            <div className="flex gap-2">
              <Link
                to="/routines/$routineId"
                params={{ routineId: activeRoutine.id }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Ver Detalles y Entrenar
              </Link>
              <Link
                to="/routines/logs"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Ver Historial
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Inactive Routines */}
      {inactiveRoutines.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Otras Rutinas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {inactiveRoutines.map((routine) => (
              <div key={routine.id} className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-2">{routine.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4">{routine.descripcion}</p>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Objetivo</p>
                    <p className="font-medium">{goalLabels[routine.objetivo]}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duración</p>
                    <p className="font-medium">{routine.duracionSemanas} semanas</p>
                  </div>
                </div>

                {routine.trainer && (
                  <p className="text-xs text-gray-500 mb-4">
                    Por: {routine.trainer.nombre} {routine.trainer.apellido}
                  </p>
                )}

                <div className="flex gap-2">
                  <Link
                    to="/routines/$routineId"
                    params={{ routineId: routine.id }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-center"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleActivate(routine.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Activar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {routines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No tienes rutinas asignadas aún.</p>
          <p className="text-sm text-gray-500">
            Contacta a tu entrenador para que te asigne una rutina personalizada.
          </p>
        </div>
      )}
    </div>
  );
}
