import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

/** Server-only Supabase client (service role). Never import from client components. */
export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

export async function resolveTenantId(supabase: SupabaseClient): Promise<string> {
  const fromEnv = process.env.KAMELLIA_TENANT_ID?.trim();
  if (fromEnv) return fromEnv;

  const { data, error } = await supabase.from("tenants").select("id").limit(2);
  if (error) throw new Error(`Could not load tenants: ${error.message}`);
  if (!data?.length) throw new Error("No tenants found. Set KAMELLIA_TENANT_ID in .env.");
  if (data.length > 1) {
    throw new Error("Multiple tenants found. Set KAMELLIA_TENANT_ID in .env.");
  }
  return data[0].id as string;
}
