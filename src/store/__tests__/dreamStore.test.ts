import { describe, it, expect, beforeEach } from 'vitest';
import { useDreamStore } from '../dreamStore';
import { act } from '@testing-library/react';

describe('dreamStore', () => {
  beforeEach(() => {
    const store = useDreamStore.getState();
    store.dreams = [];
  });

  it('adds a new dream', () => {
    const store = useDreamStore.getState();

    act(() => {
      store.addDream({
        id: '1',
        userId: '1',
        content: 'Test dream',
        tags: ['Test'],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        privacy: 'public',
      });
    });

    expect(store.dreams).toHaveLength(1);
    expect(store.dreams[0].content).toBe('Test dream');
  });

  it('likes a dream', () => {
    const store = useDreamStore.getState();

    act(() => {
      store.addDream({
        userId: '1',
        content: 'Test dream',
        tags: ['Test'],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        privacy: 'public',
      });
    });

    const dreamId = store.dreams[0].id;

    act(() => {
      store.likeDream(dreamId);
    });

    expect(store.dreams[0].likes).toBe(1);
  });

  it('filters dreams by privacy', () => {
    const store = useDreamStore.getState();

    act(() => {
      store.addDream({
        userId: '1',
        content: 'Public dream',
        tags: [],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        privacy: 'public',
      });

      store.addDream({
        userId: '1',
        content: 'Private dream',
        tags: [],
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        privacy: 'private',
      });
    });

    const publicDreams = store.getVisibleDreams();
    expect(publicDreams).toHaveLength(1);
    expect(publicDreams[0].content).toBe('Public dream');
  });
});
