import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

export function SC() {
  return createBrowserSupabaseClient();
}
