import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../ui';
import { ExerciseCategory, DifficultyLevel, MuscleGroup } from '../../types/exercise.types';

const exerciseSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  videoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  imagenUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  categoria: z.nativeEnum(ExerciseCategory),
  nivelDificultad: z.nativeEnum(DifficultyLevel),
  grupoMuscular: z.array(z.nativeEnum(MuscleGroup)).min(1, 'Selecciona al menos un grupo muscular'),
  instrucciones: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface ExerciseFormProps {
  onSubmit: (data: ExerciseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<ExerciseFormData>;
  isEdit?: boolean;
}

export const ExerciseForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: ExerciseFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      ...initialData,
      grupoMuscular: initialData?.grupoMuscular || [],
    },
  });

  const selectedMuscles = watch('grupoMuscular') || [];

  const categoryOptions = [
    { value: ExerciseCategory.FUERZA, label: 'Fuerza' },
    { value: ExerciseCategory.CARDIO, label: 'Cardio' },
    { value: ExerciseCategory.FLEXIBILIDAD, label: 'Flexibilidad' },
    { value: ExerciseCategory.MOVILIDAD, label: 'Movilidad' },
    { value: ExerciseCategory.FUNCIONAL, label: 'Funcional' },
  ];

  const difficultyOptions = [
    { value: DifficultyLevel.PRINCIPIANTE, label: 'Principiante' },
    { value: DifficultyLevel.INTERMEDIO, label: 'Intermedio' },
    { value: DifficultyLevel.AVANZADO, label: 'Avanzado' },
  ];

  const muscleOptions = [
    { value: MuscleGroup.PECHO, label: 'Pecho' },
    { value: MuscleGroup.ESPALDA, label: 'Espalda' },
    { value: MuscleGroup.HOMBROS, label: 'Hombros' },
    { value: MuscleGroup.BRAZOS, label: 'Brazos' },
    { value: MuscleGroup.PIERNAS, label: 'Piernas' },
    { value: MuscleGroup.ABDOMEN, label: 'Abdomen' },
    { value: MuscleGroup.GLUTEOS, label: 'Glúteos' },
    { value: MuscleGroup.CUERPO_COMPLETO, label: 'Cuerpo Completo' },
  ];

  const toggleMuscle = (muscle: MuscleGroup) => {
    const current = selectedMuscles;
    if (current.includes(muscle)) {
      setValue('grupoMuscular', current.filter(m => m !== muscle));
    } else {
      setValue('grupoMuscular', [...current, muscle]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre *"
        placeholder="Press de banca"
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Descripción del ejercicio..."
          {...register('descripcion')}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Categoría *"
          options={categoryOptions}
          error={errors.categoria?.message}
          {...register('categoria')}
        />

        <Select
          label="Dificultad *"
          options={difficultyOptions}
          error={errors.nivelDificultad?.message}
          {...register('nivelDificultad')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Grupos Musculares *
        </label>
        <div className="flex flex-wrap gap-2">
          {muscleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleMuscle(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedMuscles.includes(option.value)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.grupoMuscular && (
          <p className="text-sm text-red-600 mt-1">{errors.grupoMuscular.message}</p>
        )}
      </div>

      <Input
        label="URL del Video"
        type="url"
        placeholder="https://youtube.com/..."
        error={errors.videoUrl?.message}
        {...register('videoUrl')}
      />

      <Input
        label="URL de la Imagen"
        type="url"
        placeholder="https://..."
        error={errors.imagenUrl?.message}
        {...register('imagenUrl')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Instrucciones
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Paso a paso para realizar el ejercicio..."
          {...register('instrucciones')}
        />
      </div>

      <div className="flex gap-3 pt-4">
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
          {isEdit ? 'Guardar Cambios' : 'Crear Ejercicio'}
        </Button>
      </div>
    </form>
  );
};
