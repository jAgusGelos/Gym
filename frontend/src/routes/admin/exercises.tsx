import { useState } from 'react';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useExercises, useCreateExercise, useUpdateExercise, useDeleteExercise } from '../../hooks/useExercises';
import { Button, Card, CardContent, Input, Modal, DataTable } from '../../components/ui';
import { ExerciseForm } from '../../components/forms/ExerciseForm';
import { useToast } from '../../stores/toastStore';
import { Plus, Edit, Trash2, Dumbbell } from 'lucide-react';
import { Exercise, MuscleGroup, DifficultyLevel } from '../../types/workout.types';
import { AxiosErrorType } from '../../types/error.types';

export const ExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: exercisesData, isLoading } = useExercises(
    pagination.pageIndex + 1,
    pagination.pageSize
  );
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();
  const toast = useToast();

  // Filtro de búsqueda del lado del cliente (para la página actual)
  const filteredExercises = searchTerm
    ? exercisesData?.data.filter((exercise) =>
        exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : exercisesData?.data;

  const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar "${exerciseName}"?`)) {
      deleteExercise.mutate(exerciseId, {
        onSuccess: () => {
          toast.success('Ejercicio eliminado correctamente');
        },
        onError: () => {
          toast.error('Error al eliminar el ejercicio');
        },
      });
    }
  };

  interface ExerciseFormData {
    nombre: string;
    descripcion: string;
    grupoMuscular: MuscleGroup;
    equipamiento?: string;
    nivelDificultad: DifficultyLevel;
    videoUrl?: string;
    imagenUrl?: string;
  }

  const handleCreateExercise = async (data: ExerciseFormData) => {
    try {
      await createExercise.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Ejercicio creado correctamente');
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al crear el ejercicio');
    }
  };

  const handleEditExercise = async (data: ExerciseFormData) => {
    if (!editingExercise) return;
    try {
      await updateExercise.mutateAsync({
        id: editingExercise.id,
        ...data,
      });
      setIsModalOpen(false);
      setEditingExercise(null);
      toast.success('Ejercicio actualizado correctamente');
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al actualizar el ejercicio');
    }
  };

  const openCreateModal = () => {
    setEditingExercise(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
  };

  const getMuscleGroupLabel = (group: MuscleGroup): string => {
    const labels: Record<MuscleGroup, string> = {
      [MuscleGroup.PECHO]: 'Pecho',
      [MuscleGroup.ESPALDA]: 'Espalda',
      [MuscleGroup.PIERNAS]: 'Piernas',
      [MuscleGroup.HOMBROS]: 'Hombros',
      [MuscleGroup.BRAZOS]: 'Brazos',
      [MuscleGroup.CORE]: 'Core',
      [MuscleGroup.CARDIO]: 'Cardio',
      [MuscleGroup.CUERPO_COMPLETO]: 'Cuerpo Completo',
    };
    return labels[group] || group;
  };

  const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
    const labels: Record<DifficultyLevel, string> = {
      [DifficultyLevel.PRINCIPIANTE]: 'Principiante',
      [DifficultyLevel.INTERMEDIO]: 'Intermedio',
      [DifficultyLevel.AVANZADO]: 'Avanzado',
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty: DifficultyLevel): string => {
    switch (difficulty) {
      case DifficultyLevel.PRINCIPIANTE:
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case DifficultyLevel.INTERMEDIO:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';
      case DifficultyLevel.AVANZADO:
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Definición de columnas para la tabla
  const columns: ColumnDef<Exercise>[] = [
    {
      accessorKey: 'nombre',
      header: 'Ejercicio',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.original.nombre}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {row.original.descripcion}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'grupoMuscular',
      header: 'Grupo Muscular',
      cell: ({ row }) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded">
          {getMuscleGroupLabel(row.original.grupoMuscular)}
        </span>
      ),
    },
    {
      accessorKey: 'nivelDificultad',
      header: 'Dificultad',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(row.original.nivelDificultad)}`}>
          {getDifficultyLabel(row.original.nivelDificultad)}
        </span>
      ),
    },
    {
      accessorKey: 'equipamiento',
      header: 'Equipamiento',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.equipamiento || '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditModal(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteExercise(row.original.id, row.original.nombre)}
            disabled={deleteExercise.isPending}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Ejercicios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {exercisesData?.total || 0} ejercicios registrados
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ejercicio
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de ejercicios */}
      <DataTable
        columns={columns}
        data={filteredExercises || []}
        pageCount={exercisesData?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        manualPagination={true}
      />

      {/* Modal de crear/editar ejercicio */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
        size="lg"
      >
        <ExerciseForm
          onSubmit={editingExercise ? handleEditExercise : handleCreateExercise}
          onCancel={closeModal}
          isLoading={editingExercise ? updateExercise.isPending : createExercise.isPending}
          initialData={editingExercise ? {
            nombre: editingExercise.nombre,
            descripcion: editingExercise.descripcion,
            grupoMuscular: editingExercise.grupoMuscular,
            equipamiento: editingExercise.equipamiento || '',
            nivelDificultad: editingExercise.nivelDificultad,
            videoUrl: editingExercise.videoUrl || '',
            imagenUrl: editingExercise.imagenUrl || '',
          } : undefined}
          isEdit={!!editingExercise}
        />
      </Modal>
    </div>
  );
};
