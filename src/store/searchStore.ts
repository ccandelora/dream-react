import { create } from 'zustand';
import { Dream } from './dreamStore';

interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  clarity: number | null;
  sortBy: 'date' | 'likes' | 'clarity';
  sortOrder: 'asc' | 'desc';
}

interface SearchState {
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  filterDreams: (dreams: Dream[]) => Dream[];
}

const defaultFilters: SearchFilters = {
  query: '',
  tags: [],
  dateRange: 'all',
  clarity: null,
  sortBy: 'date',
  sortOrder: 'desc',
};

const getDateRangeStart = (range: SearchFilters['dateRange']): Date => {
  const now = new Date();
  switch (range) {
    case 'today':
      return new Date(now.setHours(0, 0, 0, 0));
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(0);
  }
};

export const useSearchStore = create<SearchState>((set, get) => ({
  filters: defaultFilters,
  
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  
  resetFilters: () => set({ filters: defaultFilters }),
  
  filterDreams: (dreams) => {
    const { filters } = get();
    const dateStart = getDateRangeStart(filters.dateRange);

    return dreams
      .filter((dream) => {
        // Full-text search
        if (filters.query) {
          const searchQuery = filters.query.toLowerCase();
          const dreamText = dream.content.toLowerCase();
          const dreamTags = dream.tags.join(' ').toLowerCase();
          if (!dreamText.includes(searchQuery) && !dreamTags.includes(searchQuery)) {
            return false;
          }
        }

        // Tag filtering
        if (filters.tags.length > 0) {
          if (!dream.tags.some((tag) => filters.tags.includes(tag))) {
            return false;
          }
        }

        // Date range filtering
        if (filters.dateRange !== 'all') {
          if (new Date(dream.createdAt) < dateStart) {
            return false;
          }
        }

        // Clarity filtering
        if (filters.clarity !== null) {
          if ((dream.clarity || 0) < filters.clarity) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        
        switch (filters.sortBy) {
          case 'likes':
            return (a.likes - b.likes) * order;
          case 'clarity':
            return ((a.clarity || 0) - (b.clarity || 0)) * order;
          default:
            return (
              (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
              order
            );
        }
      });
  },
}));