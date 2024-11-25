import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { login, register, logout, isLoading } = useAuthStore();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      throw error;
    }
  }, [login]);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      await register(email, password, name);
    } catch (error) {
      throw error;
    }
  }, [register]);

  const signOut = useCallback(async () => {
    try {
      logout();
    } catch (error) {
      throw error;
    }
  }, [logout]);

  return { signIn, signUp, signOut, isLoading };
}