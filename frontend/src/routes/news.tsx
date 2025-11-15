import { useState } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { Card, CardContent, Loading } from '../components/ui';
import { Megaphone, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { AnnouncementType } from '../types/announcement.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const NewsPage = () => {
  const [filterType, setFilterType] = useState<AnnouncementType | 'all'>('all');
  const { data: announcementsData, isLoading } = useAnnouncements(1, 50);

  // Filter only active announcements and not expired
  const activeAnnouncements = announcementsData?.data.filter((announcement) => {
    if (!announcement.activo) return false;

    // Filter by type
    if (filterType !== 'all' && announcement.tipo !== filterType) {
      return false;
    }

    // Check if not expired
    if (announcement.fechaExpiracion) {
      const now = new Date();
      const expiration = new Date(announcement.fechaExpiracion);
      if (expiration < now) return false;
    }

    // Check if publication date has passed
    const publicationDate = new Date(announcement.fechaPublicacion);
    const now = new Date();
    return publicationDate <= now;
  });

  const getTypeColor = (type: AnnouncementType) => {
    const colors = {
      [AnnouncementType.NOVEDAD]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
      [AnnouncementType.EVENTO]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
      [AnnouncementType.PROMOCION]: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
      [AnnouncementType.MANTENIMIENTO]: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
    };
    return colors[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  };

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.EVENTO:
        return <Calendar className="w-6 h-6" />;
      case AnnouncementType.PROMOCION:
        return <Sparkles className="w-6 h-6" />;
      case AnnouncementType.MANTENIMIENTO:
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Megaphone className="w-6 h-6" />;
    }
  };

  const getTypeName = (type: AnnouncementType) => {
    const names = {
      [AnnouncementType.NOVEDAD]: 'Novedad',
      [AnnouncementType.EVENTO]: 'Evento',
      [AnnouncementType.PROMOCION]: 'Promoción',
      [AnnouncementType.MANTENIMIENTO]: 'Mantenimiento',
    };
    return names[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Megaphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Novedades</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mantente al día con las últimas noticias del gimnasio
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.NOVEDAD)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.NOVEDAD
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Novedades
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.EVENTO)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.EVENTO
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.PROMOCION)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.PROMOCION
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Promociones
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.MANTENIMIENTO)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.MANTENIMIENTO
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Mantenimiento
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {activeAnnouncements?.map((announcement) => (
            <div key={announcement.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {announcement.imagenUrl && (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={announcement.imagenUrl}
                    alt={announcement.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(announcement.tipo).split(' ')[0]} ${getTypeColor(announcement.tipo).split(' ')[1]}`}>
                    {getTypeIcon(announcement.tipo)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {announcement.titulo}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.tipo)}`}>
                        {getTypeName(announcement.tipo)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(announcement.fechaPublicacion), "d 'de' MMMM, yyyy", { locale: es })}
                      {announcement.fechaExpiracion && (
                        <span className="ml-2">
                          · Válido hasta {format(new Date(announcement.fechaExpiracion), "d 'de' MMMM", { locale: es })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {announcement.contenido}
                </p>

                {announcement.autor && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span>
                      Publicado por {announcement.autor.nombre} {announcement.autor.apellido}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeAnnouncements?.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center py-16">
            <Megaphone className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay anuncios disponibles
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Por el momento no hay novedades para mostrar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
