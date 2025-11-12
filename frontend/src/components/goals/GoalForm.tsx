import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoalType, goalTypeLabels, goalTypeIcons, UserGoal } from '../../types/goal.types';

const goalSchema = z.object({
  tipo: z.nativeEnum(GoalType),
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  pesoObjetivo: z.number().min(30).max(300).optional().or(z.literal('')),
  grasaCorporalObjetivo: z.number().min(1).max(50).optional().or(z.literal('')),
  masaMuscularObjetivo: z.number().min(10).max(100).optional().or(z.literal('')),
  fechaInicio: z.string(),
  fechaObjetivo: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  goal?: UserGoal;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const GoalForm = ({ goal, onSubmit, onCancel, isSubmitting }: GoalFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal
      ? {
          tipo: goal.tipo,
          titulo: goal.titulo,
          descripcion: goal.descripcion || '',
          pesoObjetivo: goal.pesoObjetivo || ('' as any),
          grasaCorporalObjetivo: goal.grasaCorporalObjetivo || ('' as any),
          masaMuscularObjetivo: goal.masaMuscularObjetivo || ('' as any),
          fechaInicio: new Date(goal.fechaInicio).toISOString().split('T')[0],
          fechaObjetivo: goal.fechaObjetivo
            ? new Date(goal.fechaObjetivo).toISOString().split('T')[0]
            : '',
        }
      : {
          tipo: GoalType.PERDER_PESO,
          titulo: '',
          descripcion: '',
          fechaInicio: new Date().toISOString().split('T')[0],
          fechaObjetivo: '',
        },
  });

  const selectedType = watch('tipo');

  const handleFormSubmit = (data: GoalFormData) => {
    // Convertir empty strings a undefined para campos numéricos
    const cleanedData = {
      ...data,
      pesoObjetivo: data.pesoObjetivo === '' ? undefined : Number(data.pesoObjetivo),
      grasaCorporalObjetivo:
        data.grasaCorporalObjetivo === '' ? undefined : Number(data.grasaCorporalObjetivo),
      masaMuscularObjetivo:
        data.masaMuscularObjetivo === '' ? undefined : Number(data.masaMuscularObjetivo),
      fechaObjetivo: data.fechaObjetivo || undefined,
    };
    onSubmit(cleanedData);
  };

  const needsWeightGoal = [
    GoalType.PERDER_PESO,
    GoalType.GANAR_PESO,
    GoalType.GANAR_MUSCULO,
    GoalType.MANTENER_PESO,
  ].includes(selectedType);

  const needsBodyFatGoal = selectedType === GoalType.REDUCIR_GRASA;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Tipo de Objetivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de Objetivo
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(goalTypeLabels).map(([key, label]) => (
            <label
              key={key}
              className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                watch('tipo') === key
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="radio"
                value={key}
                {...register('tipo')}
                className="sr-only"
              />
              <span className="text-2xl">{goalTypeIcons[key as GoalType]}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
            </label>
          ))}
        </div>
        {errors.tipo && (
          <p className="text-red-600 text-sm mt-1">{errors.tipo.message}</p>
        )}
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título del Objetivo *
        </label>
        <input
          type="text"
          {...register('titulo')}
          placeholder="Ej: Alcanzar mi peso ideal"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
        {errors.titulo && (
          <p className="text-red-600 text-sm mt-1">{errors.titulo.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          {...register('descripcion')}
          rows={3}
          placeholder="Describe tu objetivo..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Peso Objetivo */}
      {needsWeightGoal && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Peso Objetivo (kg)
          </label>
          <input
            type="number"
            step="0.1"
            {...register('pesoObjetivo', { valueAsNumber: true })}
            placeholder="Ej: 75.5"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.pesoObjetivo && (
            <p className="text-red-600 text-sm mt-1">{errors.pesoObjetivo.message}</p>
          )}
        </div>
      )}

      {/* Grasa Corporal Objetivo */}
      {needsBodyFatGoal && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Grasa Corporal Objetivo (%)
          </label>
          <input
            type="number"
            step="0.1"
            {...register('grasaCorporalObjetivo', { valueAsNumber: true })}
            placeholder="Ej: 15"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.grasaCorporalObjetivo && (
            <p className="text-red-600 text-sm mt-1">{errors.grasaCorporalObjetivo.message}</p>
          )}
        </div>
      )}

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Inicio *
          </label>
          <input
            type="date"
            {...register('fechaInicio')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Objetivo
          </label>
          <input
            type="date"
            {...register('fechaObjetivo')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Guardando...' : goal ? 'Actualizar' : 'Crear Objetivo'}
        </button>
      </div>
    </form>
  );
};
