import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Default to demo environment for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

// Initialize Supabase client with demo mode flag
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export demo mode status for UI feedback
export const isSupabaseDemoMode = () => isDemoMode;

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => !isDemoMode;