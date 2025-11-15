import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../ui';
import { UserRole } from '../../types/user.types';

const memberSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
  rol: z.nativeEnum(UserRole),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<MemberFormData>;
  isEdit?: boolean;
}

export const MemberForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: MemberFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: initialData,
  });

  const roleOptions = [
    { value: UserRole.SOCIO, label: 'Socio' },
    { value: UserRole.ADMIN, label: 'Administrador' },
    { value: UserRole.ENTRENADOR, label: 'Entrenador' },
    { value: UserRole.RECEPCIONISTA, label: 'Recepcionista' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre *"
          placeholder="Juan"
          error={errors.nombre?.message}
          {...register('nombre')}
        />
        <Input
          label="Apellido *"
          placeholder="Pérez"
          error={errors.apellido?.message}
          {...register('apellido')}
        />
      </div>

      <Input
        label="Email *"
        type="email"
        placeholder="juan@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      {!isEdit && (
        <Input
          label="Contraseña *"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      )}

      <Input
        label="Teléfono"
        type="tel"
        placeholder="+54 9 11 1234-5678"
        error={errors.telefono?.message}
        {...register('telefono')}
      />

      <Select
        label="Rol *"
        options={roleOptions}
        error={errors.rol?.message}
        {...register('rol')}
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
          {isEdit ? 'Guardar Cambios' : 'Crear Socio'}
        </Button>
      </div>
    </form>
  );
};
