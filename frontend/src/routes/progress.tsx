import { useState } from 'react';
import { useMyProgress, useProgressStats, useCreateProgressEntry, useDeleteProgressEntry } from '../hooks/useProgress';
import { Card, CardContent, Button, Input, Loading } from '../components/ui';
import { StatCard } from '../components/ui/StatCard';
import { useToast } from '../stores/toastStore';
import { Plus, TrendingUp, TrendingDown, Calendar, Trash2, Scale, Activity, Percent } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const ProgressPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: entries, isLoading } = useMyProgress();
  const { data: stats } = useProgressStats();
  const createEntry = useCreateProgressEntry();
  const deleteEntry = useDeleteProgressEntry();
  const toast = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      peso: '',
      grasaCorporal: '',
      pecho: '',
      cintura: '',
      caderas: '',
      notas: '',
    },
  });

  const handleCreateEntry = async (data: any) => {
    try {
      // Convert empty strings to undefined
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value === '') return acc;
        if (key === 'fecha') return { ...acc, [key]: value };
        if (key === 'notas') return { ...acc, [key]: value };
        return { ...acc, [key]: parseFloat(value as string) };
      }, {});

      await createEntry.mutateAsync(cleanedData as any);
      toast.success('Progreso registrado correctamente');
      reset();
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al registrar progreso');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que querés eliminar este registro?')) {
      deleteEntry.mutate(id, {
        onSuccess: () => {
          toast.success('Registro eliminado');
        },
        onError: () => {
          toast.error('Error al eliminar registro');
        },
      });
    }
  };

  const renderWeightChart = () => {
    if (!entries || entries.length === 0) return null;

    const weightEntries = entries.filter(e => e.peso).slice(0, 10).reverse();
    if (weightEntries.length === 0) return null;

    const maxWeight = Math.max(...weightEntries.map(e => e.peso!));
    const minWeight = Math.min(...weightEntries.map(e => e.peso!));
    const range = maxWeight - minWeight || 10;
    const padding = range * 0.1;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Evolución de Peso</h3>
        <div className="relative h-48 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#4b5563"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}

            {/* Line chart */}
            {weightEntries.length > 1 && (
              <polyline
                points={weightEntries.map((entry, i) => {
                  const x = (i / (weightEntries.length - 1)) * 100;
                  const y = 100 - ((entry.peso! - minWeight + padding) / (range + padding * 2)) * 100;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#9333ea"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            )}

            {/* Data points */}
            {weightEntries.map((entry, i) => {
              const x = (i / (weightEntries.length - 1)) * 100;
              const y = 100 - ((entry.peso! - minWeight + padding) / (range + padding * 2)) * 100;
              return (
                <circle
                  key={entry.id}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#9333ea"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400">
            {minWeight.toFixed(1)} kg
          </div>
          <div className="absolute top-2 left-2 text-xs text-gray-500 dark:text-gray-400">
            {maxWeight.toFixed(1)} kg
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Progreso</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Seguí tu evolución</p>
          </div>
        </div>

        {/* Stats */}
        {stats && stats.totalEntries > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Peso Actual"
              value={stats.latestWeight?.toFixed(1) || '-'}
              icon={Scale}
              iconColor="blue"
              size="sm"
              suffix="kg"
            />

            <StatCard
              label="Cambio"
              value={stats.weightChange !== null ? (
                `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)}`
              ) : '-'}
              icon={stats.weightChange !== null && stats.weightChange < 0 ? TrendingDown : TrendingUp}
              iconColor={stats.weightChange !== null && stats.weightChange < 0 ? 'green' : 'orange'}
              size="sm"
              suffix="kg"
            />

            <StatCard
              label="Grasa"
              value={stats.latestBodyFat?.toFixed(1) || '-'}
              icon={Percent}
              iconColor="purple"
              size="sm"
              suffix="%"
            />

            <StatCard
              label="Registros"
              value={stats.totalEntries}
              icon={Calendar}
              iconColor="indigo"
              size="sm"
            />
          </div>
        )}

        {/* Add Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Registrar Progreso
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Nuevo Registro</h2>
            <form onSubmit={handleSubmit(handleCreateEntry)} className="space-y-4">
                <Input
                  label="Fecha *"
                  type="date"
                  error={errors.fecha?.message}
                  {...register('fecha', { required: 'La fecha es requerida' })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Peso (kg)"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    {...register('peso')}
                  />
                  <Input
                    label="Grasa (%)"
                    type="number"
                    step="0.1"
                    placeholder="18.5"
                    {...register('grasaCorporal')}
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Medidas (cm)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      label="Pecho"
                      type="number"
                      step="0.1"
                      placeholder="100"
                      {...register('pecho')}
                    />
                    <Input
                      label="Cintura"
                      type="number"
                      step="0.1"
                      placeholder="85"
                      {...register('cintura')}
                    />
                    <Input
                      label="Caderas"
                      type="number"
                      step="0.1"
                      placeholder="95"
                      {...register('caderas')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notas
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    rows={3}
                    placeholder="¿Cómo te sentiste hoy?"
                    {...register('notas')}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createEntry.isPending}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {createEntry.isPending ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
        )}

        {/* Chart */}
        {entries && entries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {renderWeightChart()}
          </div>
        )}

        {/* History */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historial</h2>

          {entries?.map((entry) => (
            <div key={entry.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {format(new Date(entry.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {entry.peso && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Peso:</span>{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.peso} kg</span>
                      </div>
                    )}
                    {entry.grasaCorporal && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Grasa:</span>{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.grasaCorporal}%</span>
                      </div>
                    )}
                    {entry.cintura && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Cintura:</span>{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.cintura} cm</span>
                      </div>
                    )}
                    {entry.pecho && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Pecho:</span>{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{entry.pecho} cm</span>
                      </div>
                    )}
                  </div>

                  {entry.notas && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{entry.notas}"</p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {entries?.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <Activity className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No hay registros aún
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Empezá a registrar tu progreso para ver tu evolución
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
