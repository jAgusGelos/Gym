import { useState } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { Card, CardContent, Loading } from '../components/ui';
import { Megaphone, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { AnnouncementType } from '../types/announcement.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const NewsPage = () => {
  const [filterType, setFilterType] = useState<AnnouncementType | 'all'>('all');
  const { data: announcementsData, isLoading } = useAnnouncements(1, 50, filterType === 'all' ? undefined : filterType);

  // Filter only active announcements and not expired
  const activeAnnouncements = announcementsData?.data.filter((announcement) => {
    if (!announcement.activo) return false;

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
      [AnnouncementType.NOVEDAD]: 'bg-blue-100 text-blue-800 border-blue-200',
      [AnnouncementType.EVENTO]: 'bg-purple-100 text-purple-800 border-purple-200',
      [AnnouncementType.PROMOCION]: 'bg-green-100 text-green-800 border-green-200',
      [AnnouncementType.MANTENIMIENTO]: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Megaphone className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Novedades</h1>
          </div>
          <p className="text-blue-100">
            Mantente al día con las últimas noticias del gimnasio
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.NOVEDAD)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.NOVEDAD
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Novedades
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.EVENTO)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.EVENTO
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.PROMOCION)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.PROMOCION
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Promociones
          </button>
          <button
            onClick={() => setFilterType(AnnouncementType.MANTENIMIENTO)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filterType === AnnouncementType.MANTENIMIENTO
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Mantenimiento
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {activeAnnouncements?.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardContent className="p-0">
                {announcement.imagenUrl && (
                  <div className="w-full h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={announcement.imagenUrl}
                      alt={announcement.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(announcement.tipo).split(' ')[0]}`}>
                      {getTypeIcon(announcement.tipo)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-bold text-gray-900">
                          {announcement.titulo}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(announcement.tipo)}`}>
                          {getTypeName(announcement.tipo)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {format(new Date(announcement.fechaPublicacion), "d 'de' MMMM, yyyy", { locale: es })}
                        {announcement.fechaExpiracion && (
                          <span className="ml-2">
                            · Válido hasta {format(new Date(announcement.fechaExpiracion), "d 'de' MMMM", { locale: es })}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {announcement.contenido}
                  </p>

                  {announcement.autor && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>
                        Publicado por {announcement.autor.nombre} {announcement.autor.apellido}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activeAnnouncements?.length === 0 && (
          <div className="text-center py-16">
            <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay anuncios disponibles
            </h3>
            <p className="text-gray-600">
              Por el momento no hay novedades para mostrar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
