import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Legacy client for backwards compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client component client with auth helpers
export const createSupabaseClient = () => createClientComponentClient();
