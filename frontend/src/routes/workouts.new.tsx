import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, X, Save, Dumbbell } from 'lucide-react';
import { useCreateWorkoutLog } from '../hooks/useWorkoutLogs';
import { useExercises } from '../hooks/useExercises';
import { useToastStore } from '../stores/toastStore';
import type { CreateWorkoutLogDto, CreateExerciseSetDto } from '../types/workout-log.types';

export const Route = createFileRoute('/workouts/new')({
  component: NewWorkoutPage,
});

interface WorkoutFormData {
  fecha: string;
  titulo?: string;
  duracionMinutos?: number;
  exercises: {
    exerciseId: string;
    sets: {
      setNumber: number;
      peso: number;
      repeticiones: number;
      rir?: number;
    }[];
  }[];
}

function NewWorkoutPage() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { data: exercises, isLoading: loadingExercises } = useExercises();
  const createWorkoutLog = useCreateWorkoutLog();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WorkoutFormData>({
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      titulo: '',
      duracionMinutos: undefined,
      exercises: [],
    },
  });

  const { fields: exerciseFields, append: addExercise, remove: removeExercise } = useFieldArray({
    control,
    // @ts-expect-error - useFieldArray type issues
    name: 'exercises',
  });

  const onSubmit = async (data: WorkoutFormData) => {
    // Convertir el formato del form al formato del DTO
    const sets: CreateExerciseSetDto[] = [];
    let globalSetNumber = 1;

    data.exercises.forEach((exercise) => {
      exercise.sets.forEach((set) => {
        sets.push({
          exerciseId: exercise.exerciseId,
          setNumber: globalSetNumber++,
          peso: Number(set.peso),
          repeticiones: Number(set.repeticiones),
          rir: set.rir ? Number(set.rir) : undefined,
        });
      });
    });

    const workoutData: CreateWorkoutLogDto = {
      fecha: data.fecha,
      titulo: data.titulo || undefined,
      duracionMinutos: data.duracionMinutos ? Number(data.duracionMinutos) : undefined,
      sets,
    };

    try {
      await createWorkoutLog.mutateAsync(workoutData);
      showToast('Entrenamiento registrado exitosamente', 'success');
      navigate({ to: '/workouts' });
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al registrar entrenamiento', 'error');
    }
  };

  const handleAddExercise = () => {
    addExercise({
      exerciseId: '',
      sets: [{ setNumber: 1, peso: 0, repeticiones: 0, rir: undefined }],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Dumbbell className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registrar Entrenamiento</h1>
            <p className="text-sm text-gray-600">Registra tu sesión de entrenamiento</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Datos generales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('fecha', { required: 'La fecha es requerida' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.fecha && (
                <p className="mt-1 text-sm text-red-600">{errors.fecha.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título (opcional)
              </label>
              <input
                type="text"
                {...register('titulo')}
                placeholder="ej: Día de pierna"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <input
                type="number"
                {...register('duracionMinutos')}
                placeholder="60"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Ejercicios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ejercicios</h2>
            <button
              type="button"
              onClick={handleAddExercise}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Ejercicio
            </button>
          </div>

          {exerciseFields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No hay ejercicios agregados</p>
              <p className="text-sm">Haz clic en "Agregar Ejercicio" para comenzar</p>
            </div>
          ) : (
            <div className="space-y-6">
              {exerciseFields.map((field, exerciseIndex) => (
                <ExerciseSetForm
                  key={field.id}
                  exerciseIndex={exerciseIndex}
                  register={register}
                  control={control}
                  exercises={exercises || []}
                  removeExercise={removeExercise}
                  errors={errors}
                />
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate({ to: '/workouts' })}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createWorkoutLog.isPending || exerciseFields.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {createWorkoutLog.isPending ? 'Guardando...' : 'Guardar Entrenamiento'}
          </button>
        </div>
      </form>
    </div>
  );
}

interface ExerciseSetFormProps {
  exerciseIndex: number;
  register: any;
  control: any;
  exercises: any[];
  removeExercise: (index: number) => void;
  errors: any;
}

function ExerciseSetForm({
  exerciseIndex,
  register,
  control,
  exercises,
  removeExercise,
  errors,
}: ExerciseSetFormProps) {
  const { fields: setFields, append: addSet, remove: removeSet } = useFieldArray({
    control,
    // @ts-expect-error - useFieldArray type issues
    name: `exercises.${exerciseIndex}.sets`,
  });

  const handleAddSet = () => {
    addSet({
      setNumber: setFields.length + 1,
      peso: 0,
      repeticiones: 0,
      rir: undefined,
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ejercicio <span className="text-red-500">*</span>
          </label>
          <select
            {...register(`exercises.${exerciseIndex}.exerciseId`, {
              required: 'Selecciona un ejercicio',
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Seleccionar ejercicio...</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.nombre} ({exercise.grupoMuscular})
              </option>
            ))}
          </select>
          {errors?.exercises?.[exerciseIndex]?.exerciseId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.exercises[exerciseIndex].exerciseId.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => removeExercise(exerciseIndex)}
          className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Series</label>
          <button
            type="button"
            onClick={handleAddSet}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Agregar Serie
          </button>
        </div>

        <div className="space-y-2">
          {setFields.map((field, setIndex) => (
            <div key={field.id} className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 w-6">{setIndex + 1}.</span>

              <div className="flex-1">
                <input
                  type="number"
                  step="0.5"
                  placeholder="Peso (kg)"
                  {...register(`exercises.${exerciseIndex}.sets.${setIndex}.peso`, {
                    required: true,
                    min: 0,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <span className="text-gray-400">x</span>

              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Reps"
                  {...register(`exercises.${exerciseIndex}.sets.${setIndex}.repeticiones`, {
                    required: true,
                    min: 1,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="w-20">
                <input
                  type="number"
                  placeholder="RIR"
                  {...register(`exercises.${exerciseIndex}.sets.${setIndex}.rir`, {
                    min: 0,
                    max: 10,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => removeSet(setIndex)}
                disabled={setFields.length === 1}
                className="p-2 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
