import { useState } from "react";
import {
  useAdminRoutines,
  useCreateRoutine,
  useUpdateRoutine,
  useDeleteRoutine,
} from "../../hooks/useAdminRoutines";
import {
  Button,
  Card,
  CardContent,
  Input,
  Loading,
  Modal,
} from "../../components/ui";
import { RoutineForm } from "../../components/forms/RoutineForm";
import { useToast } from "../../stores/toastStore";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ClipboardList,
  Clock,
} from "lucide-react";
import { Routine, RoutineLevel, RoutineGoal } from "../../types/routine.types";

export const AdminRoutinesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<RoutineLevel | "all">("all");
  const [filterGoal, setFilterGoal] = useState<RoutineGoal | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const { data: routinesData, isLoading } = useAdminRoutines(1, 100);
  const createRoutine = useCreateRoutine();
  const updateRoutine = useUpdateRoutine();
  const deleteRoutine = useDeleteRoutine();
  const toast = useToast();

  const filteredRoutines = routinesData?.data.filter((routine) => {
    const matchesSearch =
      routine.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      routine.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = filterLevel === "all" || routine.nivel === filterLevel;

    const matchesGoal = filterGoal === "all" || routine.objetivo === filterGoal;

    return matchesSearch && matchesLevel && matchesGoal;
  });

  const handleToggleStatus = (routineId: string, currentStatus: boolean) => {
    updateRoutine.mutate(
      {
        id: routineId,
        data: { activo: !currentStatus },
      },
      {
        onSuccess: () => {
          toast.success(
            currentStatus ? "Rutina desactivada" : "Rutina activada"
          );
        },
        onError: () => {
          toast.error("Error al cambiar el estado de la rutina");
        },
      }
    );
  };

  const handleDeleteRoutine = (routineId: string, routineName: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar "${routineName}"?`)) {
      deleteRoutine.mutate(routineId, {
        onSuccess: () => {
          toast.success("Rutina eliminada correctamente");
        },
        onError: () => {
          toast.error("Error al eliminar la rutina");
        },
      });
    }
  };

  const handleCreateRoutine = async (data: any) => {
    try {
      await createRoutine.mutateAsync(data);
      setIsModalOpen(false);
      toast.success("Rutina creada correctamente");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear la rutina");
    }
  };

  const handleEditRoutine = async (data: any) => {
    if (!editingRoutine) return;
    try {
      await updateRoutine.mutateAsync({
        id: editingRoutine.id,
        data,
      });
      setIsModalOpen(false);
      setEditingRoutine(null);
      toast.success("Rutina actualizada correctamente");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al actualizar la rutina"
      );
    }
  };

  const openCreateModal = () => {
    setEditingRoutine(null);
    setIsModalOpen(true);
  };

  const openEditModal = (routine: Routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoutine(null);
  };

  const getLevelColor = (level: RoutineLevel) => {
    const colors = {
      [RoutineLevel.PRINCIPIANTE]: "bg-green-100 text-green-800",
      [RoutineLevel.INTERMEDIO]: "bg-yellow-100 text-yellow-800",
      [RoutineLevel.AVANZADO]: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getGoalColor = (goal: RoutineGoal) => {
    const colors = {
      [RoutineGoal.FUERZA]: "bg-red-100 text-red-800",
      [RoutineGoal.HIPERTROFIA]: "bg-purple-100 text-purple-800",
      [RoutineGoal.DEFINICION]: "bg-blue-100 text-blue-800",
      [RoutineGoal.RESISTENCIA]: "bg-green-100 text-green-800",
      [RoutineGoal.MOVILIDAD]: "bg-yellow-100 text-yellow-800",
      [RoutineGoal.PERDIDA_PESO]: "bg-orange-100 text-orange-800",
    };
    return colors[goal] || "bg-gray-100 text-gray-800";
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Rutinas
          </h1>
          <p className="text-gray-600 mt-1">
            Administrá las rutinas de entrenamiento
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Rutina
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar rutinas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los niveles</option>
              <option value={RoutineLevel.PRINCIPIANTE}>Principiante</option>
              <option value={RoutineLevel.INTERMEDIO}>Intermedio</option>
              <option value={RoutineLevel.AVANZADO}>Avanzado</option>
            </select>

            <select
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los objetivos</option>
              <option value={RoutineGoal.FUERZA}>Fuerza</option>
              <option value={RoutineGoal.HIPERTROFIA}>Hipertrofia</option>
              <option value={RoutineGoal.DEFINICION}>Definición</option>
              <option value={RoutineGoal.RESISTENCIA}>Resistencia</option>
              <option value={RoutineGoal.MOVILIDAD}>Movilidad</option>
              <option value={RoutineGoal.PERDIDA_PESO}>Pérdida de Peso</option>
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
                <p className="text-sm text-gray-600">Total de Rutinas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {routinesData?.total || 0}
                </p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Públicas</p>
                <p className="text-2xl font-bold text-green-600">
                  {routinesData?.data.filter((r) => r.publico).length || 0}
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
                <p className="text-sm text-gray-600">Privadas</p>
                <p className="text-2xl font-bold text-gray-600">
                  {routinesData?.data.filter((r) => !r.publico).length || 0}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRoutines?.map((routine) => (
          <Card key={routine.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {routine.nombre}
                      </h3>
                      {routine.publico && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Público
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {routine.descripcion}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() =>
                        handleToggleStatus(routine.id, routine.activo)
                      }
                      className={`p-1 rounded ${
                        routine.activo ? "text-green-600" : "text-gray-400"
                      }`}
                      title={routine.activo ? "Activo" : "Inactivo"}
                    >
                      {routine.activo ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                      routine.nivel
                    )}`}
                  >
                    {routine.nivel}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalColor(
                      routine.objetivo
                    )}`}
                  >
                    {routine.objetivo}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    <span>{routine.ejercicios?.length || 0} ejercicios</span>
                  </div>
                  {routine.duracionEstimada && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{routine.duracionEstimada} min</span>
                    </div>
                  )}
                </div>

                {routine.creador && (
                  <p className="text-xs text-gray-500">
                    Creado por: {routine.creador.nombre}{" "}
                    {routine.creador.apellido}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(routine)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      handleDeleteRoutine(routine.id, routine.nombre)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoutines?.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron rutinas</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRoutine ? "Editar Rutina" : "Nueva Rutina"}
        size="xl"
      >
        <RoutineForm
          onSubmit={editingRoutine ? handleEditRoutine : handleCreateRoutine}
          onCancel={closeModal}
          isLoading={createRoutine.isPending || updateRoutine.isPending}
          initialData={editingRoutine || undefined}
          isEdit={!!editingRoutine}
        />
      </Modal>
    </div>
  );
};

export default AdminRoutinesPage;
