import { useState } from 'react';
import { useExercises, useCreateExercise, useUpdateExercise, useDeleteExercise } from '../../hooks/useExercises';
import { Button, Card, CardContent, Input, Loading, Modal } from '../../components/ui';
import { ExerciseForm } from '../../components/forms/ExerciseForm';
import { useToast } from '../../stores/toastStore';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Dumbbell } from 'lucide-react';
import { Exercise, ExerciseCategory, DifficultyLevel } from '../../types/exercise.types';

export const ExercisesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ExerciseCategory | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const { data: exercisesData, isLoading } = useExercises(1, 100);
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const deleteExercise = useDeleteExercise();
  const toast = useToast();

  const filteredExercises = exercisesData?.data.filter((exercise) => {
    const matchesSearch =
      exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || exercise.categoria === filterCategory;

    const matchesDifficulty =
      filterDifficulty === 'all' || exercise.nivelDificultad === filterDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleToggleStatus = (exerciseId: string, currentStatus: boolean) => {
    updateExercise.mutate({
      id: exerciseId,
      data: { activo: !currentStatus },
    }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Ejercicio desactivado' : 'Ejercicio activado');
      },
      onError: () => {
        toast.error('Error al cambiar el estado del ejercicio');
      },
    });
  };

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

  const handleCreateExercise = async (data: any) => {
    try {
      await createExercise.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Ejercicio creado correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear el ejercicio');
    }
  };

  const handleEditExercise = async (data: any) => {
    if (!editingExercise) return;
    try {
      await updateExercise.mutateAsync({
        id: editingExercise.id,
        data,
      });
      setIsModalOpen(false);
      setEditingExercise(null);
      toast.success('Ejercicio actualizado correctamente');
    } catch (error: any) {
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

  const getCategoryColor = (category: ExerciseCategory) => {
    const colors = {
      [ExerciseCategory.FUERZA]: 'bg-red-100 text-red-800',
      [ExerciseCategory.CARDIO]: 'bg-blue-100 text-blue-800',
      [ExerciseCategory.FLEXIBILIDAD]: 'bg-purple-100 text-purple-800',
      [ExerciseCategory.MOVILIDAD]: 'bg-green-100 text-green-800',
      [ExerciseCategory.FUNCIONAL]: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    const colors = {
      [DifficultyLevel.PRINCIPIANTE]: 'bg-green-100 text-green-800',
      [DifficultyLevel.INTERMEDIO]: 'bg-yellow-100 text-yellow-800',
      [DifficultyLevel.AVANZADO]: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Ejercicios</h1>
          <p className="text-gray-600 mt-1">Administrá la biblioteca de ejercicios</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Ejercicio
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value={ExerciseCategory.FUERZA}>Fuerza</option>
              <option value={ExerciseCategory.CARDIO}>Cardio</option>
              <option value={ExerciseCategory.FLEXIBILIDAD}>Flexibilidad</option>
              <option value={ExerciseCategory.MOVILIDAD}>Movilidad</option>
              <option value={ExerciseCategory.FUNCIONAL}>Funcional</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las dificultades</option>
              <option value={DifficultyLevel.PRINCIPIANTE}>Principiante</option>
              <option value={DifficultyLevel.INTERMEDIO}>Intermedio</option>
              <option value={DifficultyLevel.AVANZADO}>Avanzado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Ejercicios</p>
                <p className="text-2xl font-bold text-gray-900">{exercisesData?.total || 0}</p>
              </div>
              <Dumbbell className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">
                  {exercisesData?.data.filter(e => e.activo).length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactivos</p>
                <p className="text-2xl font-bold text-red-600">
                  {exercisesData?.data.filter(e => !e.activo).length || 0}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises?.map((exercise) => (
          <Card key={exercise.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{exercise.nombre}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {exercise.descripcion}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleToggleStatus(exercise.id, exercise.activo)}
                      className={`p-1 rounded ${
                        exercise.activo ? 'text-green-600' : 'text-gray-400'
                      }`}
                      title={exercise.activo ? 'Activo' : 'Inactivo'}
                    >
                      {exercise.activo ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.categoria)}`}>
                    {exercise.categoria}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.nivelDificultad)}`}>
                    {exercise.nivelDificultad}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {exercise.grupoMuscular.map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(exercise)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteExercise(exercise.id, exercise.nombre)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExercises?.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron ejercicios</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExercise ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
      >
        <ExerciseForm
          onSubmit={editingExercise ? handleEditExercise : handleCreateExercise}
          onCancel={closeModal}
          isLoading={createExercise.isPending || updateExercise.isPending}
          initialData={editingExercise || undefined}
          isEdit={!!editingExercise}
        />
      </Modal>
    </div>
  );
};

export default ExercisesPage;
