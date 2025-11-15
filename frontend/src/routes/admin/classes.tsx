import { useState } from 'react';
import { useAdminClasses, useCreateClass, useUpdateClass, useDeleteClass } from '../../hooks/useAdminClasses';
import { Button, Card, CardContent, Loading, Modal } from '../../components/ui';
import { ClassForm } from '../../components/forms/ClassForm';
import { useToast } from '../../stores/toastStore';
import { Calendar, Plus, Edit, Trash2, Clock, Zap } from 'lucide-react';
import { Class, DayOfWeek } from '../../types/class.types';
import { compressSchedulesToRanges } from '../../utils/scheduleHelpers';

const DAY_NAMES = {
  [DayOfWeek.SUNDAY]: 'Dom',
  [DayOfWeek.MONDAY]: 'Lun',
  [DayOfWeek.TUESDAY]: 'Mar',
  [DayOfWeek.WEDNESDAY]: 'Mié',
  [DayOfWeek.THURSDAY]: 'Jue',
  [DayOfWeek.FRIDAY]: 'Vie',
  [DayOfWeek.SATURDAY]: 'Sáb',
};

export const AdminClassesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const { data: classesData, isLoading } = useAdminClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const toast = useToast();

  const handleToggleStatus = (classId: string, currentStatus: boolean) => {
    updateClass.mutate({
      id: classId,
      data: { activo: !currentStatus },
    }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Clase desactivada' : 'Clase activada');
      },
      onError: () => {
        toast.error('Error al cambiar el estado de la clase');
      },
    });
  };

  const handleDeleteClass = (classId: string, className: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar la clase "${className}"?`)) {
      deleteClass.mutate(classId, {
        onSuccess: () => {
          toast.success('Clase eliminada correctamente');
        },
        onError: () => {
          toast.error('Error al eliminar la clase');
        },
      });
    }
  };

  const handleCreateClass = async (data: any) => {
    try {
      await createClass.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Clase creada correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la clase');
    }
  };

  const handleEditClass = async (data: any) => {
    if (!editingClass) return;
    try {
      await updateClass.mutateAsync({
        id: editingClass.id,
        data,
      });
      setIsModalOpen(false);
      setEditingClass(null);
      toast.success('Clase actualizada correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar la clase');
    }
  };

  const openCreateModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const openEditModal = (classItem: Class) => {
    setEditingClass(classItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  // Comprimir horarios en ranges para mostrar de forma más compacta al admin
  const getCompressedSchedules = (classItem: Class) => {
    const ranges = compressSchedulesToRanges(classItem.schedules);

    // Agrupar ranges por día
    const byDay = new Map<number, typeof ranges>();

    ranges.forEach(range => {
      if (!byDay.has(range.dayOfWeek)) {
        byDay.set(range.dayOfWeek, []);
      }
      byDay.get(range.dayOfWeek)!.push(range);
    });

    return byDay;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Clases
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {classesData?.total || 0} clases configuradas
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Clase
        </Button>
      </div>

      {isLoading ? (
        <Loading className="py-12" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {classesData?.data.map((classItem) => {
            const rangesByDay = getCompressedSchedules(classItem);

            return (
              <Card key={classItem.id}>
                <CardContent className="pt-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {classItem.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {classItem.descripcion}
                      </p>
                    </div>
                    {classItem.activo ? (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded">
                        Activa
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded">
                        Inactiva
                      </span>
                    )}
                  </div>

                  {/* Información general */}
                  <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Cupo por defecto:</span> {classItem.cupoMaximo} personas
                    </p>
                  </div>

                  {/* Horarios comprimidos por día */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Horarios Semanales
                      <span className="text-xs text-gray-500 font-normal">(vista comprimida)</span>
                    </h4>
                    <div className="space-y-2">
                      {Array.from(rangesByDay.entries())
                        .sort(([a], [b]) => a - b)
                        .map(([day, ranges]) => (
                          <div key={day} className="text-sm">
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {DAY_NAMES[day as DayOfWeek]}:
                                </span>
                                <div className="mt-1 space-y-1">
                                  {ranges.map((range, idx) => {
                                    const instructor = classItem.schedules.find(
                                      s => s.instructorId === range.instructorId
                                    )?.instructor;

                                    return (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 text-xs bg-primary-50 dark:bg-primary-900/10 p-2 rounded border border-primary-200 dark:border-primary-800"
                                      >
                                        <Zap className="w-3 h-3 text-primary-600" />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                              {range.startTime} - {range.endTime}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                              ({range.duration} min)
                                            </span>
                                          </div>
                                          <div className="text-gray-600 dark:text-gray-400 mt-0.5">
                                            {instructor?.nombre} {instructor?.apellido}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleToggleStatus(classItem.id, classItem.activo)}
                      isLoading={updateClass.isPending}
                    >
                      {classItem.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEditModal(classItem)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClass(classItem.id, classItem.nombre)}
                      isLoading={deleteClass.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {classesData?.data.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No hay clases creadas. Creá tu primera clase.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de crear/editar clase */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClass ? 'Editar Clase' : 'Nueva Clase'}
        size="lg"
      >
        <ClassForm
          key={editingClass?.id || 'new'}
          onSubmit={editingClass ? handleEditClass : handleCreateClass}
          onCancel={closeModal}
          isLoading={editingClass ? updateClass.isPending : createClass.isPending}
          initialData={editingClass ? {
            nombre: editingClass.nombre,
            descripcion: editingClass.descripcion,
            cupoMaximo: editingClass.cupoMaximo,
            imagenUrl: editingClass.imagenUrl || '',
            schedules: editingClass.schedules.map(schedule => ({
              dayOfWeek: schedule.dayOfWeek,
              // Convertir HH:mm:ss a HH:mm para el input type="time"
              startTime: schedule.startTime.substring(0, 5),
              endTime: schedule.endTime.substring(0, 5),
              instructorId: schedule.instructorId,
              cupoMaximo: schedule.cupoMaximo,
              activo: schedule.activo,
            })),
          } : undefined}
          isEdit={!!editingClass}
        />
      </Modal>
    </div>
  );
};
