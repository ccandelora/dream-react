import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinedDate: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const initialDemoUsers: User[] = [
  {
    id: '1',
    name: 'Luna Dreamweaver',
    email: 'luna@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Exploring the depths of consciousness through lucid dreaming',
    joinedDate: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Aiden Starlight',
    email: 'aiden@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Dream researcher and consciousness explorer',
    joinedDate: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Maya Nightshade',
    email: 'maya@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    bio: 'Recording my dream journey one night at a time',
    joinedDate: new Date('2024-02-15')
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      users: initialDemoUsers,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { users } = get();
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user || (password !== 'demo' && user.id <= '3')) {
            throw new Error('Invalid email or password');
          }

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Invalid credentials'
          });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });

        try {
          const { users } = get();
          
          // Check if email already exists
          if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email already registered');
          }

          // Create new user
          const newUser: User = {
            id: (Math.max(...users.map(u => parseInt(u.id))) + 1).toString(),
            name,
            email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
            joinedDate: new Date()
          };

          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            users: [...state.users, newUser],
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          isLoading: false
        });
      }
    }),
    {
      name: 'dream-journal-auth',
      partialize: (state) => ({
        users: state.users
      })
    }
  )
);