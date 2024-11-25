// Environment variable validation and access
export function validateEnvVars(): boolean {
  const requiredVars = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missingVars = requiredVars.filter(key => !import.meta.env[`VITE_${key}`]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    return false;
  }
  
  return true;
}

export function getEnvVar(key: string): string {
  const value = import.meta.env[`VITE_${key}`];
  return value || '';
}

export function isDemoMode(): boolean {
  const geminiKey = getEnvVar('GEMINI_API_KEY');
  return !geminiKey || geminiKey === 'your_gemini_api_key_here';
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}