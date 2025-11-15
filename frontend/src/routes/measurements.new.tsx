import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Save, Scale, Ruler, Percent, User2 } from 'lucide-react';
import { useCreateMeasurement } from '../hooks/useBodyMeasurements';
import { CreateBodyMeasurementDto } from '../types/body-measurement.types';
import { useToastStore } from '../stores/toastStore';

export default function NewMeasurementPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const createMutation = useCreateMeasurement();

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<CreateBodyMeasurementDto>({
    measurementDate: today,
    weight: 0,
    height: 0,
  });

  const handleInputChange = (field: keyof CreateBodyMeasurementDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.weight || !formData.height) {
      showToast('Peso y altura son obligatorios', 'error');
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      showToast('Medición registrada exitosamente', 'success');
      navigate({ to: '/measurements' });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al registrar medición', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/measurements' })}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Medición</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registra tus medidas corporales</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-20">
        {/* Fecha */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fecha</h2>
          <input
            type="date"
            value={formData.measurementDate}
            onChange={(e) => handleInputChange('measurementDate', e.target.value)}
            max={today}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Medidas Básicas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Medidas Básicas *
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Peso (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="500"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="Ej: 75.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Altura (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                min="50"
                max="300"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
                placeholder="Ej: 175"
              />
            </div>
          </div>
        </div>

        {/* Composición Corporal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Composición Corporal
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                % Grasa Corporal
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.bodyFatPercentage || ''}
                onChange={(e) =>
                  handleInputChange('bodyFatPercentage', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 18.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                % Masa Muscular
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.muscleMassPercentage || ''}
                onChange={(e) =>
                  handleInputChange('muscleMassPercentage', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: 42.3"
              />
            </div>
          </div>
        </div>

        {/* Medidas Corporales - Torso */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Medidas - Torso (cm)
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cuello
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.neck || ''}
                onChange={(e) =>
                  handleInputChange('neck', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hombros
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="200"
                value={formData.shoulders || ''}
                onChange={(e) =>
                  handleInputChange('shoulders', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pecho
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="200"
                value={formData.chest || ''}
                onChange={(e) =>
                  handleInputChange('chest', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cintura
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="200"
                value={formData.waist || ''}
                onChange={(e) =>
                  handleInputChange('waist', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cadera
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="200"
                value={formData.hips || ''}
                onChange={(e) =>
                  handleInputChange('hips', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Medidas Corporales - Brazos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <User2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Medidas - Brazos (cm)
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bícep Izquierdo
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.leftBicep || ''}
                onChange={(e) =>
                  handleInputChange('leftBicep', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bícep Derecho
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.rightBicep || ''}
                onChange={(e) =>
                  handleInputChange('rightBicep', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Antebrazo Izq.
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.leftForearm || ''}
                onChange={(e) =>
                  handleInputChange('leftForearm', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Antebrazo Der.
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.rightForearm || ''}
                onChange={(e) =>
                  handleInputChange('rightForearm', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Medidas Corporales - Piernas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-4">
            <User2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Medidas - Piernas (cm)
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Muslo Izquierdo
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="150"
                value={formData.leftThigh || ''}
                onChange={(e) =>
                  handleInputChange('leftThigh', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Muslo Derecho
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="150"
                value={formData.rightThigh || ''}
                onChange={(e) =>
                  handleInputChange('rightThigh', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pantorrilla Izq.
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.leftCalf || ''}
                onChange={(e) =>
                  handleInputChange('leftCalf', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pantorrilla Der.
              </label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="100"
                value={formData.rightCalf || ''}
                onChange={(e) =>
                  handleInputChange('rightCalf', e.target.value ? parseFloat(e.target.value) : undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Notas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notas</h2>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value || undefined)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
            placeholder="Observaciones adicionales..."
          />
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-5 h-5" />
          {createMutation.isPending ? 'Guardando...' : 'Guardar Medición'}
        </button>
      </form>
    </div>
  );
}
