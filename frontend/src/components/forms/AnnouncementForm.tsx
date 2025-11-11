import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../ui';
import { AnnouncementType } from '../../types/announcement.types';

const announcementSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres'),
  tipo: z.nativeEnum(AnnouncementType),
  imagenUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  fechaPublicacion: z.string().min(1, 'La fecha de publicación es requerida'),
  fechaExpiracion: z.string().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  onSubmit: (data: AnnouncementFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<AnnouncementFormData>;
  isEdit?: boolean;
}

export const AnnouncementForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: AnnouncementFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: initialData,
  });

  const typeOptions = [
    { value: AnnouncementType.NOVEDAD, label: 'Novedad' },
    { value: AnnouncementType.EVENTO, label: 'Evento' },
    { value: AnnouncementType.PROMOCION, label: 'Promoción' },
    { value: AnnouncementType.MANTENIMIENTO, label: 'Mantenimiento' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Título *"
        placeholder="Título del anuncio"
        error={errors.titulo?.message}
        {...register('titulo')}
      />

      <Select
        label="Tipo *"
        options={typeOptions}
        error={errors.tipo?.message}
        {...register('tipo')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contenido *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={5}
          placeholder="Contenido del anuncio..."
          {...register('contenido')}
        />
        {errors.contenido && (
          <p className="text-sm text-red-600 mt-1">{errors.contenido.message}</p>
        )}
      </div>

      <Input
        label="URL de la Imagen"
        type="url"
        placeholder="https://..."
        error={errors.imagenUrl?.message}
        {...register('imagenUrl')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha de Publicación *"
          type="datetime-local"
          error={errors.fechaPublicacion?.message}
          {...register('fechaPublicacion')}
        />

        <Input
          label="Fecha de Expiración"
          type="datetime-local"
          error={errors.fechaExpiracion?.message}
          {...register('fechaExpiracion')}
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
          {isEdit ? 'Guardar Cambios' : 'Crear Anuncio'}
        </Button>
      </div>
    </form>
  );
};
