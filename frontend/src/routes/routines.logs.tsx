import { createFileRoute, Link } from '@tanstack/react-router';
import { useWorkoutLogs } from '../hooks/useWorkoutRoutines';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Route = createFileRoute('/routines/logs')({
  component: WorkoutLogsPage,
});

function WorkoutLogsPage() {
  const { data: logs = [], isLoading } = useWorkoutLogs();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando historial...</p>
      </div>
    );
  }

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
        <Link to="/routines" className="text-blue-600 hover:underline mb-2 inline-block">
          ê Volver a Rutinas
        </Link>
        <h1 className="text-3xl font-bold mb-2">Historial de Entrenamientos</h1>
        <p className="text-gray-600">Registro de todos tus entrenamientos completados</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No has registrado entrenamientos a˙n.</p>
          <Link
            to="/routines"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Ir a Mis Rutinas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {log.routineExercise.exercise.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {muscleGroupLabels[log.routineExercise.exercise.grupoMuscular]} "{' '}
                    {format(new Date(log.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
                {log.rpe && (
                  <div className="bg-blue-100 px-3 py-1 rounded-lg">
                    <p className="text-xs text-blue-600 font-semibold">RPE: {log.rpe}/10</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Series</p>
                  <p className="font-bold text-lg">{log.seriesCompletadas}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Repeticiones</p>
                  <p className="font-bold text-lg">{log.repeticionesRealizadas}</p>
                </div>
                {log.pesoUtilizado && (
                  <div>
                    <p className="text-xs text-gray-600">Peso</p>
                    <p className="font-bold text-lg">{log.pesoUtilizado} kg</p>
                  </div>
                )}
                {log.duracionMinutos && (
                  <div>
                    <p className="text-xs text-gray-600">DuraciÛn</p>
                    <p className="font-bold text-lg">{log.duracionMinutos} min</p>
                  </div>
                )}
              </div>

              {log.notas && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <strong>Notas:</strong> {log.notas}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
