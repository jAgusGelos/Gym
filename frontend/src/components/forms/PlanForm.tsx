import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../ui';
import { MembershipType } from '../../types/membership.types';
import { Plus, X } from 'lucide-react';

const planSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  tipo: z.nativeEnum(MembershipType),
  precio: z.number().min(1, 'El precio debe ser mayor a 0'),
  duracionDias: z.number().min(1, 'La duración debe ser mayor a 0'),
  beneficios: z.array(z.string()).min(1, 'Agrega al menos un beneficio'),
  destacado: z.boolean(),
  orden: z.number().min(0, 'El orden debe ser mayor o igual a 0'),
});

type PlanFormData = z.infer<typeof planSchema>;

interface PlanFormProps {
  onSubmit: (data: PlanFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<PlanFormData>;
  isEdit?: boolean;
}

export const PlanForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: PlanFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      ...initialData,
      beneficios: initialData?.beneficios || [''],
      destacado: initialData?.destacado ?? false,
      orden: initialData?.orden ?? 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-expect-error - useFieldArray type issues with strict mode
    name: 'beneficios',
  });

  const tipoOptions = [
    { value: MembershipType.MENSUAL, label: 'Mensual (30 días)' },
    { value: MembershipType.TRIMESTRAL, label: 'Trimestral (90 días)' },
    { value: MembershipType.SEMESTRAL, label: 'Semestral (180 días)' },
    { value: MembershipType.ANUAL, label: 'Anual (365 días)' },
  ];

  const getDuracionPorTipo = (tipo: MembershipType) => {
    switch (tipo) {
      case MembershipType.MENSUAL:
        return 30;
      case MembershipType.TRIMESTRAL:
        return 90;
      case MembershipType.SEMESTRAL:
        return 180;
      case MembershipType.ANUAL:
        return 365;
      default:
        return 30;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre del Plan *"
        placeholder="Plan Mensual"
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
          placeholder="Descripción del plan..."
          {...register('descripcion')}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 mt-1">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Tipo de Membresía *"
          options={tipoOptions}
          error={errors.tipo?.message}
          {...register('tipo')}
        />

        <Input
          label="Precio (ARS) *"
          type="number"
          placeholder="15000"
          error={errors.precio?.message}
          {...register('precio', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Duración (días) *"
        type="number"
        placeholder="30"
        helperText="Ej: 30 para mensual, 90 para trimestral, 365 para anual"
        error={errors.duracionDias?.message}
        {...register('duracionDias', { valueAsNumber: true })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Beneficios *
        </label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="Ej: Acceso ilimitado al gimnasio"
                error={errors.beneficios?.[index]?.message}
                {...register(`beneficios.${index}`)}
                className="flex-1"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('')}
          className="mt-2"
        >
          <Plus className="w-4 h-4 mr-1" />
          Agregar Beneficio
        </Button>
        {errors.beneficios && (
          <p className="text-sm text-red-600 mt-1">{errors.beneficios.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            id="destacado"
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            {...register('destacado')}
          />
          <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
            Plan Destacado
          </label>
        </div>

        <Input
          label="Orden de Visualización"
          type="number"
          placeholder="0"
          helperText="Menor número = aparece primero"
          error={errors.orden?.message}
          {...register('orden', { valueAsNumber: true })}
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
          {isEdit ? 'Guardar Cambios' : 'Crear Plan'}
        </Button>
      </div>
    </form>
  );
};
