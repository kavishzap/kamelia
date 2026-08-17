import { NextResponse } from "next/server";
import { getSupabaseAdmin, resolveTenantId } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const tenantId = await resolveTenantId(supabase);

    const { data, error } = await supabase
      .from("config_packages")
      .select("id, name, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[config_packages]", error);
      return NextResponse.json({ error: "Could not load packages." }, { status: 500 });
    }

    const packages = (data ?? [])
      .filter((row) => typeof row.name === "string" && row.name.trim())
      .map((row) => ({
        id: row.id as string,
        name: (row.name as string).trim(),
      }));

    return NextResponse.json({ packages });
  } catch (err) {
    console.error("[config_packages]", err);
    return NextResponse.json({ packages: [] });
  }
}
