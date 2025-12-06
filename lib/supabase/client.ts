import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Support various key variable names
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const createSupabaseBrowserClient = <T = unknown>(): SupabaseClient<T> | null => {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createBrowserClient<T>(supabaseUrl, supabaseKey);
};
