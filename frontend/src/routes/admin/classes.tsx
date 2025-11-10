import { useState } from 'react';
import { useAdminClasses, useCreateClass, useUpdateClass, useDeleteClass } from '../../hooks/useAdminClasses';
import { Button, Card, CardContent, Loading, Modal } from '../../components/ui';
import { ClassForm } from '../../components/forms/ClassForm';
import { Calendar, Plus, Edit, Trash2, Users, Clock, User } from 'lucide-react';
import { Class } from '../../types/class.types';

export const AdminClassesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const { data: classesData, isLoading } = useAdminClasses(1, 50);
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const handleToggleStatus = (classId: string, currentStatus: boolean) => {
    updateClass.mutate({
      id: classId,
      data: { activo: !currentStatus },
    });
  };

  const handleDeleteClass = (classId: string, className: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar la clase "${className}"?`)) {
      deleteClass.mutate(classId);
    }
  };

  const handleCreateClass = async (data: any) => {
    try {
      await createClass.mutateAsync(data);
      setIsModalOpen(false);
    } catch (error) {
      // Error handling
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
    } catch (error) {
      // Error handling
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

  const upcomingClasses = classesData?.data.filter(
    (c) => new Date(c.fechaHora) > new Date()
  ) || [];

  const pastClasses = classesData?.data.filter(
    (c) => new Date(c.fechaHora) <= new Date()
  ) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Clases
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {classesData?.total || 0} clases programadas
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
        <>
          {/* Próximas clases */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Próximas Clases ({upcomingClasses.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingClasses.map((classItem) => (
                <Card key={classItem.id}>
                  <CardContent className="pt-6">
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

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(classItem.fechaHora).toLocaleDateString('es-AR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          {new Date(classItem.fechaHora).toLocaleTimeString('es-AR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>
                          {classItem.instructor?.nombre} {classItem.instructor?.apellido}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {classItem.cupoActual}/{classItem.cupoMaximo} reservas
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso de cupos */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            classItem.cupoActual >= classItem.cupoMaximo
                              ? 'bg-red-500'
                              : classItem.cupoActual >= classItem.cupoMaximo * 0.8
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${(classItem.cupoActual / classItem.cupoMaximo) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {classItem.cupoMaximo - classItem.cupoActual} lugares disponibles
                      </p>
                    </div>

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
              ))}

              {upcomingClasses.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No hay clases programadas próximamente
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Clases pasadas */}
          {pastClasses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Clases Pasadas ({pastClasses.length})
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pastClasses.slice(0, 4).map((classItem) => (
                  <Card key={classItem.id} className="opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {classItem.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(classItem.fechaHora).toLocaleDateString('es-AR')} -{' '}
                            {new Date(classItem.fechaHora).toLocaleTimeString('es-AR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                          Finalizada
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {classItem.cupoActual} asistentes de {classItem.cupoMaximo} cupos
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de crear/editar clase */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClass ? 'Editar Clase' : 'Nueva Clase'}
        size="lg"
      >
        <ClassForm
          onSubmit={editingClass ? handleEditClass : handleCreateClass}
          onCancel={closeModal}
          isLoading={editingClass ? updateClass.isPending : createClass.isPending}
          initialData={editingClass ? {
            nombre: editingClass.nombre,
            descripcion: editingClass.descripcion,
            duracion: editingClass.duracion,
            cupoMaximo: editingClass.cupoMaximo,
            fechaHora: new Date(editingClass.fechaHora).toISOString().slice(0, 16),
            instructorId: editingClass.instructorId,
          } : undefined}
          isEdit={!!editingClass}
        />
      </Modal>
    </div>
  );
};
