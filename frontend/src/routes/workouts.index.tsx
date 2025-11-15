import { createFileRoute, Link } from '@tanstack/react-router';
import { Plus, Calendar, Dumbbell, TrendingUp, Award, Trash2, Clock } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useWorkoutLogs, useUserWorkoutStats, useDeleteWorkoutLog } from '../hooks/useWorkoutLogs';
import { useToastStore } from '../stores/toastStore';

export const Route = createFileRoute('/workouts/')({
  component: WorkoutsPage,
});

export function WorkoutsPage() {
  const showToast = useToastStore((state) => state.showToast);
  const { data: workouts, isLoading } = useWorkoutLogs();
  const { data: stats } = useUserWorkoutStats();
  const deleteWorkout = useDeleteWorkoutLog();

  const handleDelete = async (id: string, titulo: string | null) => {
    if (!confirm(`¿Estás seguro de eliminar el entrenamiento "${titulo || 'Sin título'}"?`)) {
      return;
    }

    try {
      await deleteWorkout.mutateAsync(id);
      showToast('Entrenamiento eliminado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al eliminar entrenamiento', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <Dumbbell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Entrenamientos</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registra y monitorea tus sesiones</p>
          </div>
        </div>
        <Link
          to="/workouts/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Entrenamiento
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Entrenamientos"
            value={stats.totalWorkouts}
            icon={Dumbbell}
            iconColor="blue"
            size="sm"
          />

          <StatCard
            label="Total Series"
            value={stats.totalSets}
            icon={TrendingUp}
            iconColor="green"
            size="sm"
          />

          <StatCard
            label="Volumen Total"
            value={stats.totalVolume.toLocaleString()}
            icon={Award}
            iconColor="purple"
            size="sm"
            suffix="kg"
          />

          <StatCard
            label="Racha Actual"
            value={stats.currentStreak}
            icon={Calendar}
            iconColor="orange"
            size="sm"
            suffix="días"
          />
        </div>
      )}

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link
          to="/exercises"
          search={{ view: 'history' }}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Ver Progreso por Ejercicio
        </Link>
        <Link
          to="/workouts/prs"
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Award className="w-4 h-4" />
          Mis Records Personales
        </Link>
      </div>

      {/* Workouts List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de Entrenamientos</h2>
        </div>

        {!workouts || workouts.length === 0 ? (
          <div className="p-12 text-center">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay entrenamientos registrados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comienza a registrar tus entrenamientos para ver tu progreso
            </p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Registrar Primer Entrenamiento
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {workouts.map((workout) => (
              <div key={workout.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {workout.titulo || 'Entrenamiento sin título'}
                      </h3>
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded">
                        {workout.sets.length} series
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(workout.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                      </div>
                      {workout.duracionMinutos && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duracionMinutos} min
                        </div>
                      )}
                    </div>

                    {/* Ejercicios del workout */}
                    <div className="space-y-2">
                      {getExercisesSummary(workout.sets).map((exercise, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {exercise.nombre}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            - {exercise.sets} series x {exercise.avgReps} reps @ {exercise.avgWeight} kg
                          </span>
                          {exercise.hasPR && (
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                              <Award className="w-3 h-3" />
                              PR
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(workout.id, workout.titulo)}
                    disabled={deleteWorkout.isPending}
                    className="ml-4 p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getExercisesSummary(sets: any[]) {
  const exerciseMap = new Map();

  sets.forEach((set) => {
    if (!set.exercise) return;

    const key = set.exerciseId;
    if (!exerciseMap.has(key)) {
      exerciseMap.set(key, {
        nombre: set.exercise.nombre,
        sets: 0,
        totalReps: 0,
        totalWeight: 0,
        hasPR: false,
      });
    }

    const exercise = exerciseMap.get(key);
    exercise.sets++;
    exercise.totalReps += set.repeticiones;
    exercise.totalWeight += Number(set.peso);
    if (set.esPR) exercise.hasPR = true;
  });

  return Array.from(exerciseMap.values()).map((ex) => ({
    ...ex,
    avgReps: Math.round(ex.totalReps / ex.sets),
    avgWeight: Math.round((ex.totalWeight / ex.sets) * 10) / 10,
  }));
}
