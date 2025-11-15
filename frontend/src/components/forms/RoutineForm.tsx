import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef } from 'react';
import { Button, Input, Select, Combobox } from '../ui';
import { RoutineLevel, RoutineGoal } from '../../types/routine.types';
import { useExercises } from '../../hooks/useExercises';
import { useUsers } from '../../hooks/useAdmin';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const routineExerciseSchema = z.object({
  exerciseId: z.string().min(1, 'Selecciona un ejercicio'),
  orden: z.number(),
  series: z.number().min(1, 'Mínimo 1 serie'),
  repeticiones: z.string().min(1, 'Las repeticiones son requeridas'),
  descanso: z.number().min(0, 'El descanso debe ser mayor o igual a 0'),
  notas: z.string().optional(),
});

const routineSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  nivel: z.nativeEnum(RoutineLevel),
  objetivo: z.nativeEnum(RoutineGoal),
  duracionEstimada: z.number().min(1, 'La duración debe ser mayor a 0').optional(),
  publico: z.boolean(),
  userId: z.string().optional(),
  ejercicios: z.array(routineExerciseSchema).min(1, 'Agrega al menos un ejercicio'),
});

type RoutineFormData = z.infer<typeof routineSchema>;

interface RoutineFormProps {
  onSubmit: (data: RoutineFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<RoutineFormData>;
  isEdit?: boolean;
}

export const RoutineForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: RoutineFormProps) => {
  const { data: exercisesData } = useExercises();
  const { data: usersData } = useUsers(1, 100);
  const exerciseInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RoutineFormData>({
    resolver: zodResolver(routineSchema),
    defaultValues: {
      ...initialData,
      publico: initialData?.publico ?? true,
      ejercicios: initialData?.ejercicios || [],
    },
  });

  const isPublic = useWatch({ control, name: 'publico' });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ejercicios',
  });

  const levelOptions = [
    { value: RoutineLevel.PRINCIPIANTE, label: 'Principiante' },
    { value: RoutineLevel.INTERMEDIO, label: 'Intermedio' },
    { value: RoutineLevel.AVANZADO, label: 'Avanzado' },
  ];

  const goalOptions = [
    { value: RoutineGoal.FUERZA, label: 'Fuerza' },
    { value: RoutineGoal.HIPERTROFIA, label: 'Hipertrofia' },
    { value: RoutineGoal.DEFINICION, label: 'Definición' },
    { value: RoutineGoal.RESISTENCIA, label: 'Resistencia' },
    { value: RoutineGoal.MOVILIDAD, label: 'Movilidad' },
    { value: RoutineGoal.PERDIDA_PESO, label: 'Pérdida de Peso' },
  ];

  const exerciseOptions = exercisesData?.data?.map((ex) => ({
    value: ex.id,
    label: ex.nombre,
  })) || [];

  const userOptions = [
    { value: '', label: 'Seleccionar usuario (opcional)' },
    ...(usersData?.data?.map((user) => ({
      value: user.id,
      label: `${user.nombre} ${user.apellido}`,
    })) || [])
  ];

  const addExercise = () => {
    const newIndex = fields.length;
    append({
      exerciseId: '',
      orden: newIndex + 1,
      series: 3,
      repeticiones: '10',
      descanso: 60,
      notas: '',
    });

    // Focus on the newly added exercise input
    setTimeout(() => {
      exerciseInputRefs.current[newIndex]?.focus();
    }, 100);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
      <Input
        label="Nombre *"
        placeholder="Rutina de Fuerza Completa"
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          rows={3}
          placeholder="Descripción de la rutina..."
          {...register('descripcion')}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Nivel *"
          options={levelOptions}
          error={errors.nivel?.message}
          {...register('nivel')}
        />

        <Select
          label="Objetivo *"
          options={goalOptions}
          error={errors.objetivo?.message}
          {...register('objetivo')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Duración Estimada (min)"
          type="number"
          placeholder="45"
          error={errors.duracionEstimada?.message}
          {...register('duracionEstimada', { valueAsNumber: true })}
        />

        <div className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            id="publico"
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            {...register('publico')}
          />
          <label htmlFor="publico" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Rutina pública
          </label>
        </div>
      </div>

      {!isPublic && (
        <Select
          label="Asignar a Usuario"
          options={userOptions}
          error={errors.userId?.message}
          {...register('userId')}
        />
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ejercicios *
        </label>

        {errors.ejercicios && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.ejercicios.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ejercicio {index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <Controller
                name={`ejercicios.${index}.exerciseId`}
                control={control}
                render={({ field }) => (
                  <Combobox
                    ref={(el) => (exerciseInputRefs.current[index] = el)}
                    label="Ejercicio *"
                    options={exerciseOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.ejercicios?.[index]?.exerciseId?.message}
                    placeholder="Buscar ejercicio..."
                  />
                )}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Series *"
                  type="number"
                  placeholder="3"
                  error={errors.ejercicios?.[index]?.series?.message}
                  {...register(`ejercicios.${index}.series`, { valueAsNumber: true })}
                />

                <Input
                  label="Repeticiones *"
                  placeholder="10-12"
                  error={errors.ejercicios?.[index]?.repeticiones?.message}
                  {...register(`ejercicios.${index}.repeticiones`)}
                />

                <Input
                  label="Descanso (seg) *"
                  type="number"
                  placeholder="60"
                  error={errors.ejercicios?.[index]?.descanso?.message}
                  {...register(`ejercicios.${index}.descanso`, { valueAsNumber: true })}
                />
              </div>

              <Input
                label="Notas"
                placeholder="Notas adicionales..."
                {...register(`ejercicios.${index}.notas`)}
              />

              <input
                type="hidden"
                {...register(`ejercicios.${index}.orden`, { value: index + 1 })}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addExercise}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Ejercicio
          </Button>

          {fields.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <p className="text-sm">No hay ejercicios agregados</p>
              <p className="text-xs mt-1">Haz clic en "Agregar Ejercicio" para empezar</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 -mx-6 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
          isLoading={isLoading}
        >
          {isEdit ? 'Guardar Cambios' : 'Crear Rutina'}
        </Button>
      </div>
    </form>
  );
};
