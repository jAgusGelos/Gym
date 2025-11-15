import { useState } from 'react';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useAdmin';
import { Button, Card, CardContent, Input, Modal, DataTable } from '../../components/ui';
import { MemberForm } from '../../components/forms/MemberForm';
import { useToast } from '../../stores/toastStore';
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';
import { User, UserRole } from '../../types/user.types';

export const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Determinar filtros activos
  const activeFilters = filterStatus === 'all' ? {} : {
    estado: filterStatus === 'active' ? 'ACTIVO' : 'INACTIVO'
  };

  const { data: usersData, isLoading } = useUsers(
    pagination.pageIndex + 1,
    pagination.pageSize,
    activeFilters
  );
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const toast = useToast();

  // Filtro de búsqueda del lado del cliente (opcional, para búsqueda en la página actual)
  const filteredUsers = searchTerm
    ? usersData?.data.filter((user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : usersData?.data;

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    updateUser.mutate({
      id: userId,
      data: { estado: newStatus },
    }, {
      onSuccess: () => {
        toast.success(newStatus === 'ACTIVO' ? 'Socio activado' : 'Socio desactivado');
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

  // Definición de columnas para la tabla
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary-600">
              {row.original.nombre[0]}{row.original.apellido[0]}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {row.original.nombre} {row.original.apellido}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'telefono',
      header: 'Teléfono',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.telefono ? (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {row.original.telefono}
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'rol',
      header: 'Rol',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(row.original.rol)}`}>
          {row.original.rol}
        </span>
      ),
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ row }) => (
        row.original.estado === 'ACTIVO' ? (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        ) : row.original.estado === 'SUSPENDIDO' ? (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            Suspendido
          </span>
        ) : (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            Inactivo
          </span>
        )
      ),
    },
    {
      accessorKey: 'fechaRegistro',
      header: 'Miembro desde',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(row.original.fechaRegistro).toLocaleDateString('es-AR')}
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
            onClick={() => handleToggleStatus(row.original.id, row.original.estado)}
            disabled={updateUser.isPending}
          >
            {row.original.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
          </Button>
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
            onClick={() => handleDeleteUser(row.original.id, `${row.original.nombre} ${row.original.apellido}`)}
            disabled={deleteUser.isPending}
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

      {/* Tabla de socios */}
      <DataTable
        columns={columns}
        data={filteredUsers || []}
        pageCount={usersData?.totalPages || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        manualPagination={true}
      />

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
