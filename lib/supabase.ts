import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

// Use a valid Supabase URL format for builds without env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjE2MTYxNiwiZXhwIjoxOTMxNzM3NjE2fQ.placeholder';

// Lazy client singleton
let _supabaseClient: ReturnType<typeof createClient> | null = null;

const getBasicClient = () => {
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _supabaseClient;
};

// Legacy client - exported as getter to avoid module-level instantiation
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    return getBasicClient()[prop as keyof ReturnType<typeof createClient>];
  }
});

// Client component client with auth helpers
export const createSupabaseClient = () => {
  // Only use auth helpers if we have valid credentials
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      return createClientComponentClient();
    } catch (error) {
      console.warn('Supabase client creation failed, using fallback');
      return getBasicClient();
    }
  }

  // Return basic client as fallback
  return getBasicClient();
};
