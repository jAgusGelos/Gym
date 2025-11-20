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
import { AxiosErrorType } from '../../types/error.types';

interface FormattedAnnouncement extends Omit<Announcement, 'fechaPublicacion' | 'fechaExpiracion'> {
  fechaPublicacion: string;
  fechaExpiracion: string;
}

export const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AnnouncementType | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<FormattedAnnouncement | null>(null);

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

  interface AnnouncementFormData {
    titulo: string;
    contenido: string;
    tipo: AnnouncementType;
    imagenUrl?: string;
    fechaPublicacion: string;
    fechaExpiracion?: string;
  }

  const handleCreateAnnouncement = async (data: AnnouncementFormData) => {
    try {
      await createAnnouncement.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Anuncio creado correctamente');
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al crear el anuncio');
    }
  };

  const handleEditAnnouncement = async (data: AnnouncementFormData) => {
    if (!editingAnnouncement) return;
    try {
      await updateAnnouncement.mutateAsync({
        id: editingAnnouncement.id,
        data,
      });
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      toast.success('Anuncio actualizado correctamente');
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al actualizar el anuncio');
    }
  };

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const openEditModal = (announcement: Announcement) => {
    // Convert dates to datetime-local format for the form
    interface FormattedAnnouncement extends Omit<Announcement, 'fechaPublicacion' | 'fechaExpiracion'> {
      fechaPublicacion: string;
      fechaExpiracion: string;
    }

    const formattedAnnouncement: FormattedAnnouncement = {
      ...announcement,
      fechaPublicacion: announcement.fechaPublicacion
        ? new Date(announcement.fechaPublicacion).toISOString().slice(0, 16)
        : '',
      fechaExpiracion: announcement.fechaExpiracion
        ? new Date(announcement.fechaExpiracion).toISOString().slice(0, 16)
        : '',
    };
    setEditingAnnouncement(formattedAnnouncement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const getTypeColor = (type: AnnouncementType) => {
    const colors = {
      [AnnouncementType.NOVEDAD]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      [AnnouncementType.EVENTO]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      [AnnouncementType.PROMOCION]: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      [AnnouncementType.MANTENIMIENTO]: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Anuncios</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Administrá las novedades y anuncios del gimnasio</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Anuncio
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar anuncios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AnnouncementType | 'all')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value={AnnouncementType.NOVEDAD}>Novedad</option>
            <option value={AnnouncementType.EVENTO}>Evento</option>
            <option value={AnnouncementType.PROMOCION}>Promoción</option>
            <option value={AnnouncementType.MANTENIMIENTO}>Mantenimiento</option>
          </select>
        </div>
      </div>

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
          <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-gray-600 dark:text-gray-400">
                {getTypeIcon(announcement.tipo)}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{announcement.titulo}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.tipo)}`}>
                        {announcement.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {announcement.contenido}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(announcement.id, announcement.activo)}
                      className={`p-1 rounded transition-colors ${
                        announcement.activo
                          ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                          : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      title={announcement.activo ? 'Activo' : 'Inactivo'}
                    >
                      {announcement.activo ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                  <button
                    onClick={() => openEditModal(announcement)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement.id, announcement.titulo)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAnnouncements?.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Megaphone className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No se encontraron anuncios</p>
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
