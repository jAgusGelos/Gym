import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useAdmin';
import { Button, Card, CardContent, Input, Loading, Modal } from '../../components/ui';
import { MemberForm } from '../../components/forms/MemberForm';
import { useToast } from '../../stores/toastStore';
import { Search, UserPlus, Edit, Trash2, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import { User, UserRole } from '../../types/user.types';

export const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: usersData, isLoading } = useUsers(1, 50);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const toast = useToast();

  const filteredUsers = usersData?.data.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && user.activo) ||
      (filterStatus === 'inactive' && !user.activo);

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateUser.mutate({
      id: userId,
      data: { activo: !currentStatus },
    }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Socio desactivado' : 'Socio activado');
      },
      onError: () => {
        toast.error('Error al cambiar el estado del socio');
      },
    });
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar a ${userName}?`)) {
      deleteUser.mutate(userId, {
        onSuccess: () => {
          toast.success('Socio eliminado correctamente');
        },
        onError: () => {
          toast.error('Error al eliminar el socio');
        },
      });
    }
  };

  const handleCreateUser = async (data: any) => {
    try {
      await createUser.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Socio creado correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear el socio');
    }
  };

  const handleEditUser = async (data: any) => {
    if (!editingUser) return;
    try {
      await updateUser.mutateAsync({
        id: editingUser.id,
        data,
      });
      setIsModalOpen(false);
      setEditingUser(null);
      toast.success('Socio actualizado correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el socio');
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const getRoleBadgeColor = (rol: UserRole) => {
    switch (rol) {
      case UserRole.ADMIN:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case UserRole.ENTRENADOR:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case UserRole.RECEPCIONISTA:
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Socios
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {usersData?.total || 0} socios registrados
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <UserPlus className="w-4 h-4 mr-2" />
          Nuevo Socio
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Activos
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
              >
                Inactivos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de socios */}
      {isLoading ? (
        <Loading className="py-12" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredUsers?.map((user) => (
            <Card key={user.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-600">
                        {user.nombre[0]}{user.apellido[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.nombre} {user.apellido}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.rol)}`}>
                          {user.rol}
                        </span>
                        {user.activo ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.telefono && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{user.telefono}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Miembro desde: {new Date(user.createdAt).toLocaleDateString('es-AR')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleStatus(user.id, user.activo)}
                    isLoading={updateUser.isPending}
                  >
                    {user.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id, `${user.nombre} ${user.apellido}`)}
                    isLoading={deleteUser.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers?.length === 0 && (
            <div className="col-span-2 text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No se encontraron socios con los filtros aplicados
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de crear/editar socio */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? 'Editar Socio' : 'Nuevo Socio'}
        size="lg"
      >
        <MemberForm
          onSubmit={editingUser ? handleEditUser : handleCreateUser}
          onCancel={closeModal}
          isLoading={editingUser ? updateUser.isPending : createUser.isPending}
          initialData={editingUser ? {
            nombre: editingUser.nombre,
            apellido: editingUser.apellido,
            email: editingUser.email,
            telefono: editingUser.telefono,
            rol: editingUser.rol,
          } : undefined}
          isEdit={!!editingUser}
        />
      </Modal>
    </div>
  );
};
