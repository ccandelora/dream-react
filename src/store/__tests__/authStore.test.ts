import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { act } from '@testing-library/react';

describe('authStore', () => {
  beforeEach(() => {
    const store = useAuthStore.getState();
    store.logout();
  });

  it('handles user registration', async () => {
    const store = useAuthStore.getState();
    
    await act(async () => {
      await store.register('test@example.com', 'password123', 'Test User');
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.email).toBe('test@example.com');
    expect(store.user?.name).toBe('Test User');
  });

  it('handles user login', async () => {
    const store = useAuthStore.getState();
    
    await act(async () => {
      await store.login('luna@example.com', 'demo');
    });

    expect(store.isAuthenticated).toBe(true);
    expect(store.user?.email).toBe('luna@example.com');
  });

  it('handles logout', () => {
    const store = useAuthStore.getState();
    
    act(() => {
      store.logout();
    });

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBe(null);
  });

  it('prevents login with invalid credentials', async () => {
    const store = useAuthStore.getState();
    
    await expect(
      act(async () => {
        await store.login('invalid@example.com', 'wrongpassword');
      })
    ).rejects.toThrow();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBe(null);
  });
});