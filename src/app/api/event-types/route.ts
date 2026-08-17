import { NextResponse } from "next/server";
import { getSupabaseAdmin, resolveTenantId } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const tenantId = await resolveTenantId(supabase);

    const { data, error } = await supabase
      .from("event_types")
      .select("id, name, created_at")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[event_types]", error);
      return NextResponse.json({ error: "Could not load event types." }, { status: 500 });
    }

    const eventTypes = (data ?? [])
      .filter((row) => typeof row.name === "string" && row.name.trim())
      .map((row) => ({
        id: row.id as string,
        name: (row.name as string).trim(),
      }));

    return NextResponse.json({ eventTypes });
  } catch (err) {
    console.error("[event_types]", err);
    return NextResponse.json({ eventTypes: [] });
  }
}
