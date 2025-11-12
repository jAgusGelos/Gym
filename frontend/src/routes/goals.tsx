import { useState } from 'react';
import { Plus, Target, Trophy, Filter } from 'lucide-react';
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, useRecalculateGoals } from '../hooks/useGoals';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalForm } from '../components/goals/GoalForm';
import { UserGoal, GoalStatus } from '../types/goal.types';
import { useToastStore } from '../stores/toast.store';

export const GoalsPage = () => {
  const { data: goals = [], isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const recalculate = useRecalculateGoals();
  const { showToast } = useToastStore();

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleCreate = async (data: any) => {
    try {
      await createGoal.mutateAsync(data);
      showToast('Objetivo creado exitosamente', 'success');
      setShowForm(false);
    } catch (error) {
      showToast('Error al crear objetivo', 'error');
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingGoal) return;

    try {
      await updateGoal.mutateAsync({ id: editingGoal.id, data });
      showToast('Objetivo actualizado exitosamente', 'success');
      setEditingGoal(null);
      setShowForm(false);
    } catch (error) {
      showToast('Error al actualizar objetivo', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este objetivo?')) return;

    try {
      await deleteGoal.mutateAsync(id);
      showToast('Objetivo eliminado exitosamente', 'success');
    } catch (error) {
      showToast('Error al eliminar objetivo', 'error');
    }
  };

  const handleUpdateStatus = async (id: string, status: GoalStatus) => {
    try {
      await updateGoal.mutateAsync({ id, data: { estado: status } });
      showToast('Estado actualizado exitosamente', 'success');
    } catch (error) {
      showToast('Error al actualizar estado', 'error');
    }
  };

  const handleEdit = (goal: UserGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleRecalculate = async () => {
    try {
      await recalculate.mutateAsync();
      showToast('Progreso recalculado exitosamente', 'success');
    } catch (error) {
      showToast('Error al recalcular progreso', 'error');
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'active') return goal.estado === GoalStatus.ACTIVO;
    if (filter === 'completed') return goal.estado === GoalStatus.COMPLETADO;
    return true;
  });

  const activeGoals = goals.filter((g) => g.estado === GoalStatus.ACTIVO);
  const completedGoals = goals.filter((g) => g.estado === GoalStatus.COMPLETADO);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando objetivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Target className="w-8 h-8" />
              Mis Objetivos
            </h1>
            <p className="text-primary-100 mt-1">Configura y alcanza tus metas</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRecalculate}
              disabled={recalculate.isPending}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {recalculate.isPending ? 'Recalculando...' : 'Actualizar Progreso'}
            </button>
            <button
              onClick={() => {
                setEditingGoal(null);
                setShowForm(true);
              }}
              className="bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Objetivo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{goals.length}</div>
            <div className="text-sm text-primary-100">Total</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold">{activeGoals.length}</div>
            <div className="text-sm text-primary-100">Activos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {completedGoals.length}
            </div>
            <div className="text-sm text-primary-100">Completados</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todos ({goals.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Activos ({activeGoals.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Completados ({completedGoals.length})
          </button>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingGoal ? 'Editar Objetivo' : 'Nuevo Objetivo'}
            </h2>
            <GoalForm
              goal={editingGoal || undefined}
              onSubmit={editingGoal ? handleUpdate : handleCreate}
              onCancel={handleCancel}
              isSubmitting={createGoal.isPending || updateGoal.isPending}
            />
          </div>
        </div>
      )}

      {/* Grid de objetivos */}
      <div className="p-6">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {filter === 'all'
                ? 'No tienes objetivos aún'
                : filter === 'active'
                ? 'No tienes objetivos activos'
                : 'No has completado objetivos aún'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Crea tu primer objetivo y comienza a alcanzar tus metas
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Objetivo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
