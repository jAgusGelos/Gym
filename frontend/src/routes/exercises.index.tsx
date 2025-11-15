import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { Dumbbell, TrendingUp, ArrowLeft } from 'lucide-react';
import { useExercises } from '../hooks/useExercises';

export default function ExercisesPage() {
  const search = useSearch({ from: '/exercises' }) as { view?: string };
  const view = search?.view || 'list';
  const { data: exercises, isLoading } = useExercises();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Agrupar ejercicios por grupo muscular
  const exercisesByGroup = exercises?.reduce((acc, exercise) => {
    const group = exercise.grupoMuscular;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(exercise);
    return acc;
  }, {} as Record<string, typeof exercises>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/workouts' })}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Dumbbell className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ejercicios</h1>
            <p className="text-sm text-gray-600">Explora ejercicios y tu progreso</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate({ to: '/exercises', search: { view: 'list' } })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'list'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Lista de Ejercicios
        </button>
        <button
          onClick={() => navigate({ to: '/exercises', search: { view: 'history' } })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'history'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Ver Progreso
        </button>
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="space-y-4">
          {exercisesByGroup && Object.entries(exercisesByGroup).map(([group, groupExercises]) => (
            <div key={group} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{group}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {groupExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{exercise.nombre}</h3>
                    {exercise.descripcion && (
                      <p className="text-sm text-gray-600 mt-1">{exercise.descripcion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Ejercicio</h2>
            <div className="space-y-3">
              {exercises?.map((exercise) => (
                <Link
                  key={exercise.id}
                  to="/exercises/$exerciseId/history"
                  params={{ exerciseId: exercise.id }}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{exercise.nombre}</h3>
                      <p className="text-sm text-gray-600">{exercise.grupoMuscular}</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
