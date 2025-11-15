import { createFileRoute, Link } from '@tanstack/react-router';
import { Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePersonalRecords } from '../hooks/useWorkoutLogs';

export const Route = createFileRoute('/workouts/prs')({
  component: PersonalRecordsPage,
});

export function PersonalRecordsPage() {
  const { data: prs, isLoading } = usePersonalRecords();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Agrupar PRs por grupo muscular
  const prsByMuscleGroup = prs?.reduce((acc, pr) => {
    const group = pr.exercise.grupoMuscular;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(pr);
    return acc;
  }, {} as Record<string, typeof prs>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/workouts"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 rounded-lg">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Records Personales</h1>
            <p className="text-sm text-gray-600">Tus mejores marcas por ejercicio</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <StatCard
        label="Total de Records"
        value={prs?.length || 0}
        icon={Award}
        iconColor="amber"
        variant="gradient"
        size="lg"
      />

      {/* PRs by Muscle Group */}
      {!prsByMuscleGroup || Object.keys(prsByMuscleGroup).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aún no tienes records personales
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza a entrenar y registrar tus series para establecer tus primeros PRs
          </p>
          <Link
            to="/workouts/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Registrar Entrenamiento
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(prsByMuscleGroup).map(([muscleGroup, records]) => (
            <div key={muscleGroup} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{muscleGroup}</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {records.map((pr) => (
                  <Link
                    key={pr.exercise.id}
                    to="/exercises/$exerciseId/history"
                    params={{ exerciseId: pr.exercise.id }}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {pr.exercise.nombre}
                          </h3>
                          <Award className="w-4 h-4 text-amber-500" />
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div>
                            <span className="text-gray-500">Peso:</span>{' '}
                            <span className="font-semibold text-gray-900">{pr.peso} kg</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Repeticiones:</span>{' '}
                            <span className="font-semibold text-gray-900">{pr.repeticiones}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">1RM Estimado:</span>{' '}
                            <span className="font-semibold text-gray-900">
                              {Math.round(pr.estimado1RM)} kg
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Fecha:</span>{' '}
                            <span className="font-medium text-gray-900">
                              {format(new Date(pr.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
