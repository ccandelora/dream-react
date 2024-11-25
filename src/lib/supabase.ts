import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { getEnvVar, validateEnvVars, isValidUrl } from './env';

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

// Initialize with demo values if environment variables are not set
const isDemoMode = !validateEnvVars() || !isValidUrl(supabaseUrl);
const finalSupabaseUrl = isDemoMode ? 'https://demo.supabase.co' : supabaseUrl;
const finalSupabaseKey = isDemoMode ? 'demo-anon-key' : supabaseAnonKey;

// Initialize Supabase client with demo mode flag
export const supabase = createClient<Database>(finalSupabaseUrl, finalSupabaseKey, {
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