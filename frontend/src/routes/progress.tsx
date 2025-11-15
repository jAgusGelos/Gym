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
        <h3 className="text-lg font-semibold text-gray-900">Evolución de Peso</h3>
        <div className="relative h-48 bg-gradient-to-b from-blue-50 to-white rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="0.5"
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
                stroke="#3b82f6"
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
                  fill="#3b82f6"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <div className="absolute bottom-2 left-2 text-xs text-gray-500">
            {minWeight.toFixed(1)} kg
          </div>
          <div className="absolute top-2 left-2 text-xs text-gray-500">
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mi Progreso</h1>
              <p className="text-purple-100 mt-1">Seguí tu evolución</p>
            </div>
            <Activity className="w-12 h-12 opacity-50" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
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
          <Button onClick={() => setShowForm(true)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Progreso
          </Button>
        )}

        {/* Form */}
        {showForm && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nuevo Registro</h2>
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

                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Medidas (cm)</h3>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    rows={3}
                    placeholder="¿Cómo te sentiste hoy?"
                    {...register('notas')}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createEntry.isPending}
                    className="flex-1"
                  >
                    Guardar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Chart */}
        {entries && entries.length > 0 && (
          <Card>
            <CardContent className="p-6">
              {renderWeightChart()}
            </CardContent>
          </Card>
        )}

        {/* History */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">Historial</h2>

          {entries?.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        {format(new Date(entry.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {entry.peso && (
                        <div>
                          <span className="text-gray-600">Peso:</span>{' '}
                          <span className="font-semibold">{entry.peso} kg</span>
                        </div>
                      )}
                      {entry.grasaCorporal && (
                        <div>
                          <span className="text-gray-600">Grasa:</span>{' '}
                          <span className="font-semibold">{entry.grasaCorporal}%</span>
                        </div>
                      )}
                      {entry.cintura && (
                        <div>
                          <span className="text-gray-600">Cintura:</span>{' '}
                          <span className="font-semibold">{entry.cintura} cm</span>
                        </div>
                      )}
                      {entry.pecho && (
                        <div>
                          <span className="text-gray-600">Pecho:</span>{' '}
                          <span className="font-semibold">{entry.pecho} cm</span>
                        </div>
                      )}
                    </div>

                    {entry.notas && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{entry.notas}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {entries?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay registros aún
              </h3>
              <p className="text-gray-600 mb-4">
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
