import { createFileRoute, Link } from '@tanstack/react-router';
import { useClientProgress } from '../hooks/useTrainer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Route = createFileRoute('/trainer/clients/$clientId')({
  component: ClientProgressPage,
});

function ClientProgressPage() {
  const { clientId } = Route.useParams();
  const { data, isLoading } = useClientProgress(clientId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando progreso...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cliente no encontrado</p>
      </div>
    );
  }

  const { client, routines, recentLogs, stats } = data;

  const goalLabels = {
    fuerza: 'Fuerza',
    hipertrofia: 'Hipertrofia',
    resistencia: 'Resistencia',
    perdida_peso: 'Pérdida de Peso',
    tonificacion: 'Tonificación',
    funcional: 'Funcional',
  };

  const muscleGroupLabels = {
    pecho: 'Pecho',
    espalda: 'Espalda',
    piernas: 'Piernas',
    hombros: 'Hombros',
    brazos: 'Brazos',
    core: 'Core',
    cardio: 'Cardio',
    cuerpo_completo: 'Cuerpo Completo',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/trainer/clients" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Volver a Clientes
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          {client.nombre} {client.apellido}
        </h1>
        <p className="text-gray-600">{client.email}</p>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Entrenamientos (30 días)</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalWorkoutsLast30Days}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Días de Entrenamiento</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.uniqueTrainingDaysLast30Days}
          </p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Rutinas Totales</p>
          <p className="text-3xl font-bold text-purple-600">{stats.totalRoutines}</p>
        </div>
        <div className="bg-white border rounded-lg p-6">
          <p className="text-sm text-gray-600 mb-1">Rutinas Activas</p>
          <p className="text-3xl font-bold text-orange-600">{stats.activeRoutineCount}</p>
        </div>
      </div>

      {/* Rutinas */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Rutinas Asignadas</h2>
          <Link
            to="/trainer/routines/new"
            search={{ clientId }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Asignar Nueva Rutina
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className={`border rounded-lg p-6 ${
                routine.activa ? 'bg-green-50 border-green-500' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold">{routine.nombre}</h3>
                  <p className="text-sm text-gray-600">{routine.descripcion}</p>
                </div>
                {routine.activa && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                    Activa
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-600">Objetivo</p>
                  <p className="font-medium">{goalLabels[routine.objetivo]}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duración</p>
                  <p className="font-medium">{routine.duracionSemanas} sem</p>
                </div>
                <div>
                  <p className="text-gray-600">Frecuencia</p>
                  <p className="font-medium">{routine.diasPorSemana} días</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">
                {routine.exercises?.length || 0} ejercicios
              </p>

              <div className="flex gap-2">
                <Link
                  to="/trainer/routines/$routineId"
                  params={{ routineId: routine.id }}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-center text-sm hover:bg-gray-700"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>

        {routines.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No hay rutinas asignadas</p>
          </div>
        )}
      </div>

      {/* Entrenamientos Recientes */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Entrenamientos Recientes</h2>

        {recentLogs.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Sin entrenamientos registrados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold">{log.routineExercise.exercise.nombre}</h4>
                    <p className="text-sm text-gray-600">
                      {muscleGroupLabels[log.routineExercise.exercise.grupoMuscular]} •{' '}
                      {format(new Date(log.fecha), "d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                  {log.rpe && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      RPE: {log.rpe}/10
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-gray-600">Series</p>
                    <p className="font-semibold">{log.seriesCompletadas}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reps</p>
                    <p className="font-semibold">{log.repeticionesRealizadas}</p>
                  </div>
                  {log.pesoUtilizado && (
                    <div>
                      <p className="text-gray-600">Peso</p>
                      <p className="font-semibold">{log.pesoUtilizado} kg</p>
                    </div>
                  )}
                  {log.duracionMinutos && (
                    <div>
                      <p className="text-gray-600">Duración</p>
                      <p className="font-semibold">{log.duracionMinutos} min</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
