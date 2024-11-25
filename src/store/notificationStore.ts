import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 
  | 'like'
  | 'comment'
  | 'mention'
  | 'analysis'
  | 'collection'
  | 'dream_shared'
  | 'milestone';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  actionUserId?: string;
  actionUserName?: string;
  actionUserAvatar?: string;
  dreamId?: string;
  collectionId?: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'like',
    title: 'New Like',
    message: 'liked your dream about flying over the ocean',
    read: false,
    createdAt: new Date('2024-03-15T10:00:00'),
    actionUserId: '2',
    actionUserName: 'Aiden Starlight',
    actionUserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    dreamId: '1'
  },
  {
    id: '2',
    userId: '1',
    type: 'comment',
    title: 'New Comment',
    message: 'commented on your dream: "This reminds me of my own lucid dreaming experiences!"',
    read: false,
    createdAt: new Date('2024-03-15T09:30:00'),
    actionUserId: '3',
    actionUserName: 'Maya Nightshade',
    actionUserAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    dreamId: '1'
  },
  {
    id: '3',
    userId: '1',
    type: 'analysis',
    title: 'Dream Analysis Complete',
    message: 'Your latest dream analysis is ready to view',
    read: true,
    createdAt: new Date('2024-03-14T15:20:00'),
    dreamId: '2'
  },
  {
    id: '4',
    userId: '1',
    type: 'milestone',
    title: 'Achievement Unlocked',
    message: 'You have recorded 10 lucid dreams! Keep up the great work!',
    read: false,
    createdAt: new Date('2024-03-14T12:00:00')
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: sampleNotifications,
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [{
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            read: false,
            createdAt: new Date()
          }, ...state.notifications]
        })),
      
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        })),
      
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true
          }))
        })),
      
      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          )
        })),
      
      clearAll: () => set({ notifications: [] }),
      
      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter((notification) => !notification.read).length;
      }
    }),
    {
      name: 'notifications-storage'
    }
  )
);