import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Select } from "../ui";
import {
  MuscleGroup,
  DifficultyLevel,
} from "../../types/workout.types";

const exerciseSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  grupoMuscular: z.nativeEnum(MuscleGroup, {
    errorMap: () => ({ message: "Selecciona un grupo muscular" }),
  }),
  equipamiento: z.string().optional(),
  nivelDificultad: z.nativeEnum(DifficultyLevel, {
    errorMap: () => ({ message: "Selecciona un nivel de dificultad" }),
  }),
  videoUrl: z.string().optional(),
  imagenUrl: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

interface ExerciseFormProps {
  onSubmit: (data: ExerciseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<ExerciseFormData>;
  isEdit?: boolean;
}

export const ExerciseForm = ({
  onSubmit,
  onCancel,
  isLoading,
  initialData,
  isEdit,
}: ExerciseFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: initialData,
  });

  const muscleGroupOptions = [
    { value: MuscleGroup.PECHO, label: "Pecho" },
    { value: MuscleGroup.ESPALDA, label: "Espalda" },
    { value: MuscleGroup.HOMBROS, label: "Hombros" },
    { value: MuscleGroup.BRAZOS, label: "Brazos" },
    { value: MuscleGroup.PIERNAS, label: "Piernas" },
    { value: MuscleGroup.CORE, label: "Core" },
    { value: MuscleGroup.CARDIO, label: "Cardio" },
    { value: MuscleGroup.CUERPO_COMPLETO, label: "Cuerpo Completo" },
  ];

  const difficultyOptions = [
    { value: DifficultyLevel.PRINCIPIANTE, label: "Principiante" },
    { value: DifficultyLevel.INTERMEDIO, label: "Intermedio" },
    { value: DifficultyLevel.AVANZADO, label: "Avanzado" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre *"
        placeholder="Press de banca"
        error={errors.nombre?.message}
        {...register("nombre")}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción *
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
          rows={3}
          placeholder="Descripción del ejercicio..."
          {...register("descripcion")}
        />
        {errors.descripcion && (
          <p className="text-sm text-red-600 mt-1">
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Grupo Muscular *"
          options={muscleGroupOptions}
          error={errors.grupoMuscular?.message}
          {...register("grupoMuscular")}
        />

        <Select
          label="Dificultad *"
          options={difficultyOptions}
          error={errors.nivelDificultad?.message}
          {...register("nivelDificultad")}
        />
      </div>

      <Input
        label="Equipamiento"
        placeholder="Barra y banco"
        error={errors.equipamiento?.message}
        {...register("equipamiento")}
      />

      <Input
        label="URL del Video"
        type="url"
        placeholder="https://youtube.com/..."
        error={errors.videoUrl?.message}
        {...register("videoUrl")}
      />

      <Input
        label="URL de la Imagen"
        type="url"
        placeholder="https://..."
        error={errors.imagenUrl?.message}
        {...register("imagenUrl")}
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
        <Button type="submit" className="flex-1" isLoading={isLoading}>
          {isEdit ? "Guardar Cambios" : "Crear Ejercicio"}
        </Button>
      </div>
    </form>
  );
};
