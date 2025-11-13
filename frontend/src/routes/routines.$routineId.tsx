import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useWorkoutRoutine, useLogWorkout } from '../hooks/useWorkoutRoutines';
import type { RoutineExercise, CreateWorkoutLogDto } from '../types/workout.types';

export const Route = createFileRoute('/routines/$routineId')({
  component: RoutineDetailPage,
});

function RoutineDetailPage() {
  const { routineId } = Route.useParams();
  const { data: routine, isLoading } = useWorkoutRoutine(routineId);
  const logWorkout = useLogWorkout();
  const [selectedDay, setSelectedDay] = useState<string>('');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando rutina...</p>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Rutina no encontrada</p>
      </div>
    );
  }

  // Group exercises by day
  const exercisesByDay = routine.exercises.reduce((acc, ex) => {
    if (!acc[ex.dia]) {
      acc[ex.dia] = [];
    }
    acc[ex.dia].push(ex);
    return acc;
  }, {} as Record<string, RoutineExercise[]>);

  const days = Object.keys(exercisesByDay).sort();
  const currentDay = selectedDay || days[0];

  const handleLogExercise = async (routineExercise: RoutineExercise) => {
    const series = prompt(`Series completadas (sugerido: ${routineExercise.series}):`);
    if (!series) return;

    const reps = prompt(
      `Repeticiones realizadas por serie, separadas por comas\n(ej: 12,10,10,8):`,
    );
    if (!reps) return;

    const peso = prompt(`Peso utilizado en kg (opcional):`);
    const rpe = prompt(`RPE - Esfuerzo percibido de 1 a 10 (opcional):`);

    const logData: CreateWorkoutLogDto = {
      routineExerciseId: routineExercise.id,
      seriesCompletadas: parseInt(series),
      repeticionesRealizadas: reps,
      pesoUtilizado: peso ? parseFloat(peso) : undefined,
      rpe: rpe ? parseInt(rpe) : undefined,
    };

    try {
      await logWorkout.mutateAsync(logData);
      alert('°Entrenamiento registrado con Èxito!');
    } catch (error) {
      alert('Error al registrar el entrenamiento');
    }
  };

  const goalLabels = {
    fuerza: 'Fuerza',
    hipertrofia: 'Hipertrofia',
    resistencia: 'Resistencia',
    perdida_peso: 'PÈrdida de Peso',
    tonificacion: 'TonificaciÛn',
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
        <Link to="/routines" className="text-blue-600 hover:underline mb-2 inline-block">
          ê Volver a Rutinas
        </Link>
        <h1 className="text-3xl font-bold mb-2">{routine.nombre}</h1>
        <p className="text-gray-600">{routine.descripcion}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Objetivo</p>
          <p className="font-semibold">{goalLabels[routine.objetivo]}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">DuraciÛn</p>
          <p className="font-semibold">{routine.duracionSemanas} semanas</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Frecuencia</p>
          <p className="font-semibold">{routine.diasPorSemana} dÌas/semana</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-600">Estado</p>
          <p className="font-semibold">{routine.activa ? ' Activa' : 'Inactiva'}</p>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                currentDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises for selected day */}
      <div className="space-y-4">
        {exercisesByDay[currentDay]?.map((routineExercise) => (
          <div key={routineExercise.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{routineExercise.exercise.nombre}</h3>
                <p className="text-sm text-gray-600">
                  {muscleGroupLabels[routineExercise.exercise.grupoMuscular]} "{' '}
                  {routineExercise.exercise.equipamiento || 'Sin equipamiento'}
                </p>
              </div>
              <button
                onClick={() => handleLogExercise(routineExercise)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-4"
              >
                Registrar
              </button>
            </div>

            <p className="text-gray-700 mb-4">{routineExercise.exercise.descripcion}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-600">Series</p>
                <p className="font-bold text-lg">{routineExercise.series}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Repeticiones</p>
                <p className="font-bold text-lg">{routineExercise.repeticiones}</p>
              </div>
              {routineExercise.pesoSugerido && (
                <div>
                  <p className="text-xs text-gray-600">Peso Sugerido</p>
                  <p className="font-bold text-lg">{routineExercise.pesoSugerido} kg</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-600">Descanso</p>
                <p className="font-bold text-lg">{routineExercise.descansoSegundos}s</p>
              </div>
            </div>

            {routineExercise.notas && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> {routineExercise.notas}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {routine.exercises.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay ejercicios en esta rutina.</p>
        </div>
      )}
    </div>
  );
}
