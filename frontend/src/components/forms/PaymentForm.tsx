import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '../ui';
import { useUsers } from '../../hooks/useAdmin';
import { PaymentMethod } from '../../types/payment.types';

const paymentSchema = z.object({
  userId: z.string().min(1, 'Seleccioná un socio'),
  monto: z.number().min(1, 'El monto debe ser mayor a 0'),
  metodoPago: z.nativeEnum(PaymentMethod),
  concepto: z.string().min(5, 'El concepto debe tener al menos 5 caracteres'),
  fechaPago: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PaymentForm = ({ onSubmit, onCancel, isLoading }: PaymentFormProps) => {
  const { data: usersData } = useUsers(1, 100);
  const users = usersData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fechaPago: new Date().toISOString().split('T')[0],
    },
  });

  const userOptions = [
    { value: '', label: 'Seleccionar socio' },
    ...users.map(user => ({
      value: user.id,
      label: `${user.nombre} ${user.apellido} - ${user.email}`,
    })),
  ];

  const paymentMethodOptions = [
    { value: PaymentMethod.EFECTIVO, label: 'Efectivo' },
    { value: PaymentMethod.TARJETA, label: 'Tarjeta' },
    { value: PaymentMethod.TRANSFERENCIA, label: 'Transferencia' },
    { value: PaymentMethod.MERCADOPAGO, label: 'MercadoPago' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Socio *"
        options={userOptions}
        error={errors.userId?.message}
        {...register('userId')}
      />

      <Input
        label="Monto *"
        type="number"
        placeholder="5000"
        error={errors.monto?.message}
        {...register('monto', { valueAsNumber: true })}
      />

      <Select
        label="Método de Pago *"
        options={paymentMethodOptions}
        error={errors.metodoPago?.message}
        {...register('metodoPago')}
      />

      <Input
        label="Concepto *"
        placeholder="Membresía mensual, clase individual, etc."
        error={errors.concepto?.message}
        {...register('concepto')}
      />

      <Input
        label="Fecha de Pago"
        type="date"
        error={errors.fechaPago?.message}
        {...register('fechaPago')}
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
          Registrar Pago
        </Button>
      </div>
    </form>
  );
};
