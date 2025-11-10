import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../ui';
import { useUsers } from '../../hooks/useAdmin';
import { UserRole } from '../../types/user.types';

const classSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  duracion: z.number().min(15, 'La duración mínima es 15 minutos').max(180, 'La duración máxima es 180 minutos'),
  cupoMaximo: z.number().min(1, 'El cupo debe ser al menos 1').max(100, 'El cupo máximo es 100'),
  fechaHora: z.string().min(1, 'Seleccioná fecha y hora'),
  instructorId: z.string().min(1, 'Seleccioná un instructor'),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<ClassFormData>;
  isEdit?: boolean;
}

export const ClassForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: ClassFormProps) => {
  const { data: usersData } = useUsers(1, 100, { rol: UserRole.ENTRENADOR });
  const instructors = usersData?.data.filter(u => u.rol === UserRole.ENTRENADOR || u.rol === UserRole.ADMIN) || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData,
  });

  const instructorOptions = [
    { value: '', label: 'Seleccionar instructor' },
    ...instructors.map(instructor => ({
      value: instructor.id,
      label: `${instructor.nombre} ${instructor.apellido}`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre de la clase *"
        placeholder="Yoga, Pilates, CrossFit..."
        error={errors.nombre?.message}
        {...register('nombre')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción *
        </label>
        <textarea
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:cursor-not-allowed disabled:opacity-50
            dark:bg-gray-800 dark:border-gray-600 dark:text-white min-h-[100px]"
          placeholder="Descripción detallada de la clase..."
          {...register('descripcion')}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Duración (minutos) *"
          type="number"
          placeholder="60"
          error={errors.duracion?.message}
          {...register('duracion', { valueAsNumber: true })}
        />

        <Input
          label="Cupo máximo *"
          type="number"
          placeholder="20"
          error={errors.cupoMaximo?.message}
          {...register('cupoMaximo', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Fecha y hora *"
        type="datetime-local"
        error={errors.fechaHora?.message}
        {...register('fechaHora')}
      />

      <Select
        label="Instructor *"
        options={instructorOptions}
        error={errors.instructorId?.message}
        {...register('instructorId')}
      />

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
          {isEdit ? 'Guardar Cambios' : 'Crear Clase'}
        </Button>
      </div>
    </form>
  );
};
