import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => {
  return createServerComponentClient({ cookies });
};

export const getServerSession = async () => {
  const supabase = createServerSupabaseClient();
  try {
    const { error } = await supabase.auth.getUser();
    if (error) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    return null;
  }
};

export const getServerUser = async () => {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
