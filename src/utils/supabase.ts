import { createClient } from '@supabase/supabase-js';
import { Database } from './type';

// Use a consistent approach for environment variables to avoid hydration errors
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only throw this error during initialization, not during rendering
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing environment variables for Supabase configuration');
}

// Create the Supabase client with consistent configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
