import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface Dream {
  id: string;
  userId: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  clarity?: number;
  analysis?: DreamAnalysis;
  privacy: 'public' | 'anonymous' | 'private';
  userName?: string;
  avatar?: string;
}

interface DreamAnalysis {
  symbols: string[];
  interpretation: string;
  mood: string;
  themes: string[];
}

interface DreamState {
  dreams: Dream[];
  addDream: (dream: string) => void;
  likeDream: (dreamId: string) => void;
  analyzeDream: (dreamId: string, analysis: DreamAnalysis) => void;
  updateDreamPrivacy: (dreamId: string, privacy: Dream['privacy']) => void;
  getVisibleDreams: (currentUserId?: string) => Dream[];
}

// Helper to attach user info to dreams
const attachUserInfo = (dream: Dream) => {
  const user = useAuthStore.getState().users.find((u) => u.id === dream.userId);
  return {
    ...dream,
    userName: dream.privacy === 'anonymous' ? 'Anonymous Dreamer' : user?.name,
    avatar:
      dream.privacy === 'anonymous'
        ? 'https://images.unsplash.com/photo-1612994370726-5d4d609fca1b?w=150'
        : user?.avatar,
  };
};

const sampleDreams: Dream[] = [
  {
    id: '1',
    userId: '1',
    content:
      'I was flying over a vast ocean at sunset. The water below was crystal clear, and I could see whales swimming beneath the surface. As I flew higher, the clouds formed intricate patterns that seemed to tell a story.',
    tags: ['Flying', 'Water', 'Lucid'],
    likes: 124,
    comments: 18,
    createdAt: new Date('2024-03-15'),
    clarity: 9,
    privacy: 'public',
    analysis: {
      symbols: ['Ocean', 'Flying', 'Whales', 'Clouds'],
      interpretation:
        'This dream suggests a deep connection with your emotional state and spiritual journey. The ocean represents your emotional depth, while flying indicates a desire for freedom.',
      mood: 'Peaceful',
      themes: ['Freedom', 'Spirituality', 'Connection'],
    },
  },
  {
    id: '2',
    userId: '2',
    content:
      'In a mystical library, each book contained a different universe. When I opened them, the stories came alive around me, and I could step into different realities at will.',
    tags: ['Adventure', 'Lucid', 'Magic'],
    likes: 89,
    comments: 12,
    createdAt: new Date('2024-03-14'),
    clarity: 8,
    privacy: 'public',
    analysis: {
      symbols: ['Library', 'Books', 'Portal', 'Universe'],
      interpretation:
        'Your dream reflects a desire for knowledge and exploration. The library represents the vast potential of your mind.',
      mood: 'Curious',
      themes: ['Discovery', 'Knowledge', 'Adventure'],
    },
  },
  {
    id: '3',
    userId: '3',
    content:
      'I found myself conducting an orchestra of stars. Each constellation played a different melody, and together they created the music of the cosmos.',
    tags: ['Music', 'Stars', 'Creative'],
    likes: 156,
    comments: 24,
    createdAt: new Date('2024-03-13'),
    clarity: 7,
    privacy: 'public',
    analysis: {
      symbols: ['Stars', 'Music', 'Conductor', 'Cosmos'],
      interpretation:
        'This dream symbolizes your creative potential and connection to the universe. The music represents harmony in your life.',
      mood: 'Inspired',
      themes: ['Creativity', 'Harmony', 'Connection'],
    },
  },
].map(attachUserInfo);

export const useDreamStore = create<DreamState>()(
  persist(
    (set, get) => ({
      dreams: sampleDreams,

      addDream: (dream) =>
        set((state) => ({
          dreams: [
            {
              ...attachUserInfo({
                ...dream,
                id: Math.random().toString(36).substr(2, 9),
              }),
            },
            ...state.dreams,
          ],
        })),

      likeDream: (dreamId) =>
        set((state) => ({
          dreams: state.dreams.map((dream) =>
            dream.id === dreamId ? { ...dream, likes: dream.likes + 1 } : dream
          ),
        })),

      analyzeDream: (dreamId, analysis) =>
        set((state) => ({
          dreams: state.dreams.map((dream) =>
            dream.id === dreamId ? { ...dream, analysis } : dream
          ),
        })),

      updateDreamPrivacy: (dreamId, privacy) =>
        set((state) => ({
          dreams: state.dreams.map((dream) =>
            dream.id === dreamId ? { ...dream, privacy } : dream
          ),
        })),

      getVisibleDreams: (currentUserId) => {
        const { dreams } = get();
        return dreams.filter((dream) => {
          // If viewing own dreams, show all
          if (currentUserId && dream.userId === currentUserId) return true;

          // Otherwise, only show public and anonymous dreams
          return dream.privacy !== 'private';
        });
      },
    }),
    {
      name: 'dream-journal-dreams',
    }
  )
);
