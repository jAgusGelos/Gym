import { useState } from 'react';
import {
  Bell,
  Trash2,
  Check,
  CheckCheck,
  Filter,
  RefreshCw,
  Inbox,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useDeleteAllRead,
} from '../hooks/useNotifications';
import { NotificationType, NotificationPriority } from '../types/notification.types';
import { useToastStore } from '../stores/toastStore';
import { cn } from '../utils/cn';

type FilterType = 'all' | 'unread' | 'read';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('all');
  const showToast = useToastStore((state) => state.showToast);

  const { data: notificationsData, isLoading, refetch } = useNotifications(page, 20);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const deleteAllReadMutation = useDeleteAllRead();

  const notifications = notificationsData?.data || [];
  const totalPages = notificationsData?.totalPages || 1;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      showToast('Notificación marcada como leída', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al marcar como leída', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!confirm('¿Marcar todas las notificaciones como leídas?')) return;

    try {
      await markAllAsReadMutation.mutateAsync();
      showToast('Todas las notificaciones marcadas como leídas', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al marcar como leídas', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta notificación?')) return;

    try {
      await deleteNotificationMutation.mutateAsync(id);
      showToast('Notificación eliminada', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  const handleDeleteAllRead = async () => {
    if (!confirm('¿Eliminar todas las notificaciones leídas?')) return;

    try {
      await deleteAllReadMutation.mutateAsync();
      showToast('Notificaciones leídas eliminadas', 'success');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al eliminar', 'error');
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconMap: Record<NotificationType, string> = {
      [NotificationType.CLASS_REMINDER]: '📅',
      [NotificationType.CLASS_CANCELLED]: '❌',
      [NotificationType.MEMBERSHIP_EXPIRING]: '⚠️',
      [NotificationType.MEMBERSHIP_EXPIRED]: '🚫',
      [NotificationType.PAYMENT_SUCCESS]: '✅',
      [NotificationType.PAYMENT_FAILED]: '❌',
      [NotificationType.SUBSCRIPTION_RENEWED]: '🔄',
      [NotificationType.SUBSCRIPTION_PAUSED]: '⏸️',
      [NotificationType.NEW_ROUTINE]: '💪',
      [NotificationType.ACHIEVEMENT_UNLOCKED]: '🏆',
      [NotificationType.GOAL_COMPLETED]: '🎯',
      [NotificationType.SYSTEM_ANNOUNCEMENT]: '📢',
      [NotificationType.TRAINER_MESSAGE]: '💬',
      [NotificationType.BOOKING_CONFIRMED]: '✓',
      [NotificationType.WAITLIST_PROMOTED]: '⬆️',
    };
    return iconMap[type] || '🔔';
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    const colorMap: Record<NotificationPriority, string> = {
      [NotificationPriority.LOW]: 'border-l-gray-400',
      [NotificationPriority.MEDIUM]: 'border-l-blue-500',
      [NotificationPriority.HIGH]: 'border-l-orange-500',
      [NotificationPriority.URGENT]: 'border-l-red-500',
    };
    return colorMap[priority];
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notificaciones</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredNotifications.length}{' '}
              {filteredNotifications.length === 1 ? 'notificación' : 'notificaciones'}
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          title="Actualizar"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Actions Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'unread'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              No leídas
            </button>
            <button
              onClick={() => setFilter('read')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === 'read'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              Leídas
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas leídas
            </button>
            <button
              onClick={handleDeleteAllRead}
              disabled={deleteAllReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar leídas
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay notificaciones
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'unread'
                ? 'No tienes notificaciones sin leer'
                : filter === 'read'
                  ? 'No tienes notificaciones leídas'
                  : 'No tienes ninguna notificación'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-l-4',
                  getPriorityColor(notification.priority),
                  !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                )}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 text-3xl">{getNotificationIcon(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                      {notification.message}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(notification.createdAt), "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", {
                          locale: es,
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                          >
                            {notification.actionLabel || 'Ver más'}
                          </a>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                          >
                            <Check className="w-3 h-3" />
                            Marcar leída
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          disabled={deleteNotificationMutation.isPending}
                          className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
