import { create } from 'zustand';

export interface DreamCollection {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  dreamIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface CollectionState {
  collections: DreamCollection[];
  addCollection: (collection: Omit<DreamCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCollection: (id: string, updates: Partial<DreamCollection>) => void;
  deleteCollection: (id: string) => void;
  addDreamToCollection: (collectionId: string, dreamId: string) => void;
  removeDreamFromCollection: (collectionId: string, dreamId: string) => void;
}

const sampleCollections: DreamCollection[] = [
  // Luna's Collections
  {
    id: '1',
    userId: '1',
    name: 'Lucid Adventures',
    description: 'Collection of my most vivid lucid dreams',
    icon: 'Sparkles',
    color: 'purple',
    dreamIds: ['1'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: '2',
    userId: '1',
    name: 'Ocean Dreams',
    description: 'Dreams featuring water and marine life',
    icon: 'Repeat',
    color: 'blue',
    dreamIds: ['1'],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-15')
  },
  // Aiden's Collections
  {
    id: '3',
    userId: '2',
    name: 'Knowledge Seekers',
    description: 'Dreams about learning and discovery',
    icon: 'Sparkles',
    color: 'green',
    dreamIds: ['3'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-13')
  },
  // Maya's Collections
  {
    id: '4',
    userId: '3',
    name: 'Cosmic Symphony',
    description: 'Dreams filled with music and celestial wonders',
    icon: 'Sparkles',
    color: 'rose',
    dreamIds: ['5'],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-11')
  }
];

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: sampleCollections,
  addCollection: (collection) =>
    set((state) => ({
      collections: [
        ...state.collections,
        {
          ...collection,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    })),
  updateCollection: (id, updates) =>
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === id
          ? { ...collection, ...updates, updatedAt: new Date() }
          : collection
      )
    })),
  deleteCollection: (id) =>
    set((state) => ({
      collections: state.collections.filter((collection) => collection.id !== id)
    })),
  addDreamToCollection: (collectionId, dreamId) =>
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId && !collection.dreamIds.includes(dreamId)
          ? {
              ...collection,
              dreamIds: [...collection.dreamIds, dreamId],
              updatedAt: new Date()
            }
          : collection
      )
    })),
  removeDreamFromCollection: (collectionId, dreamId) =>
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              dreamIds: collection.dreamIds.filter((id) => id !== dreamId),
              updatedAt: new Date()
            }
          : collection
      )
    }))
}));