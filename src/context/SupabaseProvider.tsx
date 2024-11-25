import React from 'react';
import { useAuthStore } from '../store/authStore';

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}