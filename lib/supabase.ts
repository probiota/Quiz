import { createClient } from "@supabase/supabase-js";

// We use the service role key for admin tasks like inserting leads if needed,
// or anon key if RLS allows it.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder_service_role_key"
);
