import React from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotificationStore, NotificationType } from '../store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotificationStore();

  if (!isOpen) return null;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'mention':
        return '@';
      case 'analysis':
        return '🧠';
      case 'collection':
        return '📁';
      case 'dream_shared':
        return '🔗';
      case 'milestone':
        return '🏆';
      default:
        return '📢';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl w-full max-w-md mx-4 shadow-xl">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-300" />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="p-2 text-purple-300 hover:text-white transition-colors"
                title="Mark all as read"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={clearAll}
                className="p-2 text-purple-300 hover:text-white transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-purple-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <p className="text-purple-200">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-white/5 transition-colors ${
                    !notification.read ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {notification.actionUserAvatar ? (
                      <img
                        src={notification.actionUserAvatar}
                        alt={notification.actionUserName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-white">
                            {notification.actionUserName && (
                              <span className="font-medium">
                                {notification.actionUserName}{' '}
                              </span>
                            )}
                            {notification.message}
                          </p>
                          <p className="text-sm text-purple-300 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-purple-300 hover:text-white transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-purple-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}