import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast so client-side code doesn't run with missing credentials.
  throw new Error("Missing Supabase environment variables");
}

export const createSupabaseBrowserClient = <T = unknown>(): SupabaseClient<T> =>
  createBrowserClient<T>(supabaseUrl, supabaseAnonKey);
