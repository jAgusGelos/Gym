import { Link } from '@tanstack/react-router';
import {
  Scale,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  useBodyMeasurements,
  useEvolutionStats,
  useDeleteMeasurement,
} from '../hooks/useBodyMeasurements';
import { useToastStore } from '../stores/toastStore';
import { cn } from '../utils/cn';
import { Button } from '../components/ui';
import { AxiosErrorType } from '../types/error.types';

export default function MeasurementsIndexPage() {
  const { data: measurements = [], isLoading } = useBodyMeasurements();
  const { data: stats } = useEvolutionStats();
  const deleteMutation = useDeleteMeasurement();
  const showToast = useToastStore((state) => state.showToast);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta medición?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      showToast('Medición eliminada', 'success');
    } catch (error: AxiosErrorType) {
      showToast(error.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-600' };
    return { label: 'Obesidad', color: 'text-red-600' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mediciones</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seguimiento de tu evolución física
            </p>
          </div>
        </div>

        <Link to="/measurements/new">
          <Button>
            <Plus className="w-5 h-5" />
            Nueva
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      {stats && stats.totalMeasurements > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peso Actual</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.currentWeight?.toFixed(1)} kg
            </div>
            {stats.weightChange !== 0 && (
              <div
                className={cn(
                  'text-sm font-medium mt-1 flex items-center gap-1',
                  stats.weightChange > 0 ? 'text-red-600' : 'text-green-600',
                )}
              >
                {stats.weightChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(stats.weightChange).toFixed(1)} kg
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">IMC</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.currentBMI?.toFixed(1)}
            </div>
            {stats.currentBMI && (
              <div className={cn('text-sm font-medium mt-1', getBMICategory(stats.currentBMI).color)}>
                {getBMICategory(stats.currentBMI).label}
              </div>
            )}
          </div>

          {stats.currentBodyFat && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">% Grasa</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentBodyFat.toFixed(1)}%
              </div>
              {stats.bodyFatChange !== 0 && (
                <div
                  className={cn(
                    'text-sm font-medium mt-1 flex items-center gap-1',
                    stats.bodyFatChange > 0 ? 'text-red-600' : 'text-green-600',
                  )}
                >
                  {stats.bodyFatChange > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stats.bodyFatChange).toFixed(1)}%
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mediciones</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalMeasurements}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">registradas</div>
          </div>
        </div>
      )}

      {/* Historial */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Historial de Mediciones
          </h2>
        </div>

        {measurements.length === 0 ? (
          <div className="p-12 text-center">
            <Scale className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay mediciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comienza a registrar tus medidas corporales
            </p>
            <Link to="/measurements/new">
              <Button size="lg">
                <Plus className="w-5 h-5" />
                Nueva Medición
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {measurements.map((measurement) => {
              const bmiCategory = getBMICategory(Number(measurement.bmi));

              return (
                <div
                  key={measurement.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {format(new Date(measurement.measurementDate), "dd 'de' MMMM 'de' yyyy", {
                            locale: es,
                          })}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Peso</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {Number(measurement.weight).toFixed(1)} kg
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">IMC</div>
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {Number(measurement.bmi).toFixed(1)}
                          </div>
                          <div className={cn('text-xs font-medium', bmiCategory.color)}>
                            {bmiCategory.label}
                          </div>
                        </div>

                        {measurement.bodyFatPercentage && (
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">% Grasa</div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {Number(measurement.bodyFatPercentage).toFixed(1)}%
                            </div>
                          </div>
                        )}

                        {measurement.muscleMassPercentage && (
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              % Músculo
                            </div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              {Number(measurement.muscleMassPercentage).toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>

                      {measurement.notes && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                          "{measurement.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(measurement.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
