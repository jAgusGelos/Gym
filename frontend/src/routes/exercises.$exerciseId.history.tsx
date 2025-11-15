import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, TrendingUp, Award, Activity, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  useExerciseHistory,
  useExerciseStats,
  useExerciseChart,
} from '../hooks/useWorkoutLogs';
import { useExercise } from '../hooks/useExercises';

export const Route = createFileRoute('/exercises/$exerciseId/history')({
  component: ExerciseHistoryPage,
});

function ExerciseHistoryPage() {
  const navigate = useNavigate();
  const { exerciseId } = Route.useParams();

  const { data: exercise } = useExercise(exerciseId);
  const { data: history, isLoading: loadingHistory } = useExerciseHistory(exerciseId);
  const { data: stats, isLoading: loadingStats } = useExerciseStats(exerciseId);
  const { data: chartData, isLoading: loadingChart } = useExerciseChart(exerciseId, 15);

  if (loadingHistory || loadingStats || loadingChart) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/exercises' })}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exercise?.nombre}</h1>
            <p className="text-sm text-gray-600">Progreso y estadísticas</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Series</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Volumen Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.volumeTotal.toLocaleString()} kg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Peso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pesoPromedio} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Record Personal</p>
                {stats.pr ? (
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.pr.peso} kg x {stats.pr.repeticiones}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Sin datos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData && chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolución de 1RM Estimado</h2>
          <ProgressChart data={chartData} />
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Sesiones</h2>
        </div>

        {!history || history.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos</h3>
            <p className="text-gray-600">
              Aún no has registrado este ejercicio en ningún entrenamiento
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {history.map((session, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {format(new Date(session.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>

                <div className="space-y-2">
                  {session.sets.map((set) => (
                    <div
                      key={set.setNumber}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-600 w-16">
                        Serie {set.setNumber}
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-semibold text-gray-900">{set.peso} kg</span>
                        <span className="text-gray-400">×</span>
                        <span className="font-semibold text-gray-900">{set.repeticiones} reps</span>
                        {set.rir !== null && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">RIR {set.rir}</span>
                          </>
                        )}
                      </div>
                      {set.esPR && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                          <Award className="w-3 h-3" />
                          PR
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressChart({ data }: { data: any[] }) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.estimado1RM));
  const minValue = Math.min(...data.map((d) => d.estimado1RM));
  const range = maxValue - minValue;
  const padding = range * 0.1;

  const chartHeight = 200;
  const chartWidth = 800;
  const pointSpacing = chartWidth / (data.length - 1 || 1);

  const getY = (value: number) => {
    const normalizedValue = (value - minValue + padding) / (range + padding * 2);
    return chartHeight - normalizedValue * chartHeight;
  };

  const points = data
    .map((point, index) => ({
      x: index * pointSpacing,
      y: getY(point.estimado1RM),
      value: point.estimado1RM,
      fecha: point.fecha,
    }));

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`)
    .join(' ');

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth} height={chartHeight + 60} className="mx-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((percent) => {
          const y = chartHeight * percent;
          const value = maxValue + padding - (range + padding * 2) * percent;
          return (
            <g key={percent}>
              <line
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text x="-5" y={y + 5} fontSize="12" fill="#6b7280" textAnchor="end">
                {Math.round(value)} kg
              </text>
            </g>
          );
        })}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="5" fill="#6366f1" />
            <text
              x={point.x}
              y={chartHeight + 20}
              fontSize="10"
              fill="#6b7280"
              textAnchor="middle"
              transform={`rotate(-45, ${point.x}, ${chartHeight + 20})`}
            >
              {format(new Date(point.fecha), 'dd/MM')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
