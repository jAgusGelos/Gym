import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button, Input, Select } from '../ui';
import { useUsers } from '../../hooks/useAdmin';
import { UserRole } from '../../types/user.types';
import { DayOfWeek } from '../../types/class.types';
import { Plus, Trash2, Copy, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { expandScheduleRange, getScheduleRangePreview, validateScheduleRange, ScheduleRange } from '../../utils/scheduleHelpers';

const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm requerido'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:mm requerido'),
  instructorId: z.string().min(1, 'Seleccioná un instructor'),
  cupoMaximo: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    },
    z.number().nullable().optional()
  ),
  activo: z.boolean().optional(),
}).refine((data) => data.startTime < data.endTime, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['endTime'],
});

const classSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  cupoMaximo: z.number().min(1, 'El cupo debe ser al menos 1').max(100, 'El cupo máximo es 100'),
  imagenUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  schedules: z.array(scheduleSchema).min(1, 'Debe agregar al menos un horario'),
});

type ClassFormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  onSubmit: (data: ClassFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<ClassFormData>;
  isEdit?: boolean;
}

const DAY_NAMES = {
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
  [DayOfWeek.SUNDAY]: 'Domingo',
};

export const ClassForm = ({ onSubmit, onCancel, isLoading, initialData, isEdit }: ClassFormProps) => {
  const { data: usersData } = useUsers(1, 100, { rol: UserRole.ENTRENADOR });
  const instructors = usersData?.data.filter(u => u.rol === UserRole.ENTRENADOR || u.rol === UserRole.ADMIN) || [];

  const defaultValues = initialData || {
    schedules: [{
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00',
      endTime: '10:00',
      instructorId: '',
    }],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  const schedules = watch('schedules');

  // Estado para el generador rápido de rangos
  const [showRangeGenerator, setShowRangeGenerator] = useState(false);
  const [rangeForm, setRangeForm] = useState<ScheduleRange>({
    dayOfWeek: DayOfWeek.MONDAY,
    startTime: '09:00',
    endTime: '15:00',
    duration: 60,
    instructorId: '',
    cupoMaximo: undefined,
  });
  const [rangePreview, setRangePreview] = useState<string[]>([]);
  const [rangeError, setRangeError] = useState<string | null>(null);

  // Estado para el filtro de días
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');

  // Actualizar preview cuando cambia el rangeForm
  const updateRangePreview = (range: ScheduleRange) => {
    setRangeForm(range);
    const error = validateScheduleRange(range);
    setRangeError(error);

    if (!error) {
      const preview = getScheduleRangePreview(range);
      setRangePreview(preview);
    } else {
      setRangePreview([]);
    }
  };

  const instructorOptions = [
    { value: '', label: 'Seleccionar instructor' },
    ...instructors.map(instructor => ({
      value: instructor.id,
      label: `${instructor.nombre} ${instructor.apellido}`,
    })),
  ];

  const dayOptions = Object.entries(DAY_NAMES).map(([value, label]) => ({
    value,
    label,
  }));

  const handleCopyFirstInstructor = () => {
    if (schedules && schedules.length > 0 && schedules[0].instructorId) {
      const firstInstructorId = schedules[0].instructorId;
      schedules.forEach((_, index) => {
        if (index > 0) {
          const element = document.querySelector(`[name="schedules.${index}.instructorId"]`) as HTMLSelectElement;
          if (element) {
            element.value = firstInstructorId;
            // Trigger change event
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      });
    }
  };

  const addSchedule = () => {
    append({
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00',
      endTime: '10:00',
      instructorId: schedules[0]?.instructorId || '',
    });
  };

  const handleGenerateFromRange = () => {
    const error = validateScheduleRange(rangeForm);
    if (error) {
      setRangeError(error);
      return;
    }

    const expandedSchedules = expandScheduleRange(rangeForm);
    expandedSchedules.forEach(schedule => {
      append(schedule);
    });

    // Resetear el formulario y cerrar
    setShowRangeGenerator(false);
    setRangeForm({
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00',
      endTime: '15:00',
      duration: 60,
      instructorId: '',
      cupoMaximo: undefined,
    });
    setRangePreview([]);
    setRangeError(null);
  };

  const handleFormSubmit = (data: ClassFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Información básica */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información de la Clase
        </h3>

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
              placeholder:text-gray-400 dark:placeholder:text-gray-500
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

        <Input
          label="Cupo máximo por defecto *"
          type="number"
          placeholder="20"
          error={errors.cupoMaximo?.message}
          {...register('cupoMaximo', { valueAsNumber: true })}
        />

        <Input
          label="URL de imagen (opcional)"
          type="url"
          placeholder="https://..."
          error={errors.imagenUrl?.message}
          {...register('imagenUrl')}
        />
      </div>

      {/* Generador rápido de rangos */}
      <div className="space-y-4 border border-primary-200 dark:border-primary-800 rounded-lg p-4 bg-primary-50 dark:bg-primary-900/10">
        <button
          type="button"
          onClick={() => setShowRangeGenerator(!showRangeGenerator)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generador Rápido de Rangos
            </h3>
          </div>
          {showRangeGenerator ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showRangeGenerator && (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Creá múltiples horarios de forma rápida especificando un rango de tiempo y duración.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Día de la semana *
                </label>
                <select
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  value={rangeForm.dayOfWeek}
                  onChange={(e) => updateRangePreview({ ...rangeForm, dayOfWeek: Number(e.target.value) })}
                >
                  {Object.entries(DAY_NAMES).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora inicio *
                </label>
                <input
                  type="time"
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  value={rangeForm.startTime}
                  onChange={(e) => updateRangePreview({ ...rangeForm, startTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hora fin *
                </label>
                <input
                  type="time"
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  value={rangeForm.endTime}
                  onChange={(e) => updateRangePreview({ ...rangeForm, endTime: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duración (minutos) *
                </label>
                <input
                  type="number"
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  min="1"
                  value={rangeForm.duration}
                  onChange={(e) => updateRangePreview({ ...rangeForm, duration: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cupo (opcional)
                </label>
                <input
                  type="number"
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  min="1"
                  placeholder="Usar cupo por defecto"
                  value={rangeForm.cupoMaximo || ''}
                  onChange={(e) => updateRangePreview({ ...rangeForm, cupoMaximo: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructor *
                </label>
                <select
                  className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  value={rangeForm.instructorId}
                  onChange={(e) => updateRangePreview({ ...rangeForm, instructorId: e.target.value })}
                >
                  {instructorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {rangeError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{rangeError}</p>
              </div>
            )}

            {!rangeError && rangePreview.length > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Vista previa: se crearán {rangePreview.length} horarios
                </p>
                <div className="flex flex-wrap gap-2">
                  {rangePreview.map((time, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs rounded"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRangeGenerator(false);
                  setRangeError(null);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleGenerateFromRange}
                disabled={!!rangeError || rangePreview.length === 0}
                className="flex-1"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generar {rangePreview.length} horarios
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Horarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Horarios Semanales
          </h3>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyFirstInstructor}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar 1er instructor
            </Button>
          )}
        </div>

        {/* Filtro de días */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedDayFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todos
          </button>
          {Object.entries(DAY_NAMES).map(([dayValue, dayLabel]) => {
            const dayNumber = Number(dayValue);
            const count = fields.filter((_, idx) => schedules[idx]?.dayOfWeek === dayNumber).length;

            return (
              <button
                key={dayValue}
                type="button"
                onClick={() => setSelectedDayFilter(dayNumber)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedDayFilter === dayNumber
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {dayLabel}
                {count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${
                    selectedDayFilter === dayNumber
                      ? 'bg-white/20'
                      : 'bg-primary-600 text-white'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {errors.schedules?.root && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.schedules.root.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => {
            // Filtrar por día seleccionado
            if (selectedDayFilter !== 'all' && schedules[index]?.dayOfWeek !== selectedDayFilter) {
              return null;
            }

            return (
            <div
              key={field.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Horario #{index + 1}
                </span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>

              <Select
                label="Día de la semana *"
                options={dayOptions}
                error={errors.schedules?.[index]?.dayOfWeek?.message}
                {...register(`schedules.${index}.dayOfWeek`, { valueAsNumber: true })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Hora inicio *"
                  type="time"
                  error={errors.schedules?.[index]?.startTime?.message}
                  {...register(`schedules.${index}.startTime`)}
                />

                <Input
                  label="Hora fin *"
                  type="time"
                  error={errors.schedules?.[index]?.endTime?.message}
                  {...register(`schedules.${index}.endTime`)}
                />
              </div>

              <Select
                label="Instructor *"
                options={instructorOptions}
                error={errors.schedules?.[index]?.instructorId?.message}
                {...register(`schedules.${index}.instructorId`)}
              />

              <Input
                label="Cupo específico (opcional)"
                type="number"
                placeholder="Dejar vacío para usar el cupo por defecto"
                error={errors.schedules?.[index]?.cupoMaximo?.message}
                {...register(`schedules.${index}.cupoMaximo`, { valueAsNumber: true })}
              />
            </div>
            );
          })}

          {/* Mensaje cuando no hay horarios para el día seleccionado */}
          {selectedDayFilter !== 'all' &&
           fields.filter((_, idx) => schedules[idx]?.dayOfWeek === selectedDayFilter).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No hay horarios para {DAY_NAMES[selectedDayFilter as DayOfWeek]}
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addSchedule}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Horario
        </Button>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
