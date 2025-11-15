import { useState } from 'react';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '../../hooks/useAnnouncements';
import { Button, Card, CardContent, Input, Loading, Modal } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { AnnouncementForm } from '../../components/forms/AnnouncementForm';
import { useToast } from '../../stores/toastStore';
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Megaphone, Calendar } from 'lucide-react';
import { Announcement, AnnouncementType } from '../../types/announcement.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AnnouncementType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const { data: announcementsData, isLoading } = useAnnouncements(1, 100);
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();
  const toast = useToast();

  const filteredAnnouncements = announcementsData?.data.filter((announcement) => {
    const matchesSearch =
      announcement.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.contenido.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' || announcement.tipo === filterType;

    return matchesSearch && matchesType;
  });

  const handleToggleStatus = (announcementId: string, currentStatus: boolean) => {
    updateAnnouncement.mutate({
      id: announcementId,
      data: { activo: !currentStatus },
    }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Anuncio desactivado' : 'Anuncio activado');
      },
      onError: () => {
        toast.error('Error al cambiar el estado del anuncio');
      },
    });
  };

  const handleDeleteAnnouncement = (announcementId: string, announcementTitle: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar "${announcementTitle}"?`)) {
      deleteAnnouncement.mutate(announcementId, {
        onSuccess: () => {
          toast.success('Anuncio eliminado correctamente');
        },
        onError: () => {
          toast.error('Error al eliminar el anuncio');
        },
      });
    }
  };

  const handleCreateAnnouncement = async (data: any) => {
    try {
      await createAnnouncement.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Anuncio creado correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear el anuncio');
    }
  };

  const handleEditAnnouncement = async (data: any) => {
    if (!editingAnnouncement) return;
    try {
      await updateAnnouncement.mutateAsync({
        id: editingAnnouncement.id,
        data,
      });
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      toast.success('Anuncio actualizado correctamente');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el anuncio');
    }
  };

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const openEditModal = (announcement: Announcement) => {
    // Convert dates to datetime-local format for the form
    const formattedAnnouncement = {
      ...announcement,
      fechaPublicacion: announcement.fechaPublicacion
        ? new Date(announcement.fechaPublicacion).toISOString().slice(0, 16)
        : '',
      fechaExpiracion: announcement.fechaExpiracion
        ? new Date(announcement.fechaExpiracion).toISOString().slice(0, 16)
        : '',
    };
    setEditingAnnouncement(formattedAnnouncement as any);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const getTypeColor = (type: AnnouncementType) => {
    const colors = {
      [AnnouncementType.NOVEDAD]: 'bg-blue-100 text-blue-800',
      [AnnouncementType.EVENTO]: 'bg-purple-100 text-purple-800',
      [AnnouncementType.PROMOCION]: 'bg-green-100 text-green-800',
      [AnnouncementType.MANTENIMIENTO]: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.EVENTO:
        return <Calendar className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Anuncios</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Administrá las novedades y anuncios del gimnasio</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Anuncio
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar anuncios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value={AnnouncementType.NOVEDAD}>Novedad</option>
              <option value={AnnouncementType.EVENTO}>Evento</option>
              <option value={AnnouncementType.PROMOCION}>Promoción</option>
              <option value={AnnouncementType.MANTENIMIENTO}>Mantenimiento</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total"
          value={announcementsData?.total || 0}
          icon={Megaphone}
          iconColor="blue"
          size="sm"
        />

        <StatCard
          label="Activos"
          value={announcementsData?.data.filter(a => a.activo).length || 0}
          icon={CheckCircle}
          iconColor="green"
          size="sm"
        />

        <StatCard
          label="Eventos"
          value={announcementsData?.data.filter(a => a.tipo === AnnouncementType.EVENTO).length || 0}
          icon={Calendar}
          iconColor="purple"
          size="sm"
        />

        <StatCard
          label="Promociones"
          value={announcementsData?.data.filter(a => a.tipo === AnnouncementType.PROMOCION).length || 0}
          icon={Megaphone}
          iconColor="green"
          size="sm"
        />
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements?.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(announcement.tipo)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{announcement.titulo}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.tipo)}`}>
                          {announcement.tipo}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {announcement.contenido}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(announcement.id, announcement.activo)}
                        className={`p-1 rounded ${
                          announcement.activo ? 'text-green-600' : 'text-gray-400'
                        }`}
                        title={announcement.activo ? 'Activo' : 'Inactivo'}
                      >
                        {announcement.activo ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Publicación: {format(new Date(announcement.fechaPublicacion), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                    {announcement.fechaExpiracion && (
                      <span>
                        Expiración: {format(new Date(announcement.fechaExpiracion), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    )}
                    {announcement.autor && (
                      <span>
                        Por: {announcement.autor.nombre} {announcement.autor.apellido}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(announcement)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id, announcement.titulo)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAnnouncements?.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron anuncios</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAnnouncement ? 'Editar Anuncio' : 'Nuevo Anuncio'}
      >
        <AnnouncementForm
          onSubmit={editingAnnouncement ? handleEditAnnouncement : handleCreateAnnouncement}
          onCancel={closeModal}
          isLoading={createAnnouncement.isPending || updateAnnouncement.isPending}
          initialData={editingAnnouncement ? {
            ...editingAnnouncement,
            fechaPublicacion: new Date(editingAnnouncement.fechaPublicacion).toISOString().split('T')[0],
            fechaExpiracion: editingAnnouncement.fechaExpiracion
              ? new Date(editingAnnouncement.fechaExpiracion).toISOString().split('T')[0]
              : undefined,
          } : undefined}
          isEdit={!!editingAnnouncement}
        />
      </Modal>
    </div>
  );
};

export default AnnouncementsPage;
