import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  useUnreadCount,
  useUnreadNotifications,
  useMarkAsRead,
  useDeleteNotification,
} from '../../hooks/useNotifications';
import { NotificationType, NotificationPriority } from '../../types/notification.types';
import { cn } from '../../utils/cn';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: notifications = [] } = useUnreadNotifications();
  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteNotificationMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    // Map notification types to icons
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notificaciones
            </h3>
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              Ver todas
            </Link>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-4',
                      getPriorityColor(notification.priority),
                      !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                    )}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(notification.createdAt), 'dd MMM, HH:mm', {
                              locale: es,
                            })}
                          </span>
                          <div className="flex gap-2">
                            {notification.actionUrl && (
                              <Link
                                to={notification.actionUrl}
                                onClick={() => {
                                  handleMarkAsRead(notification.id, {} as any);
                                  setIsOpen(false);
                                }}
                                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                              >
                                {notification.actionLabel || 'Ver más'}
                              </Link>
                            )}
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Marcar leída
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 py-2"
              >
                Ver todas las notificaciones
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
