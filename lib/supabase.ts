import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Legacy client for backwards compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client component client with auth helpers
export const createSupabaseClient = () => {
  try {
    return createClientComponentClient();
  } catch (error) {
    console.warn('Supabase client creation failed, using placeholder');
    return supabase;
  }
};
