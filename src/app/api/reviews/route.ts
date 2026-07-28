import { NextResponse } from "next/server";
import { getSupabaseAdmin, resolveTenantId } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const tenantId = await resolveTenantId(supabase);

    // Public site: only approved reviews for this tenant
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, message, rating, status, created_at")
      .eq("tenant_id", tenantId)
      .eq("status", "APPROVED")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[reviews]", error);
      return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });
    }

    const reviews = (data ?? [])
      .filter((row) => {
        const rating = Number(row.rating);
        return (
          typeof row.name === "string" &&
          row.name.trim() &&
          typeof row.message === "string" &&
          row.message.trim() &&
          rating >= 1 &&
          rating <= 5
        );
      })
      .map((row) => ({
        id: row.id as string,
        name: (row.name as string).trim(),
        message: (row.message as string).trim(),
        rating: Number(row.rating),
      }));

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[reviews]", err);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      message?: unknown;
      rating?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const rating = Number(body.rating);

    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Please write a short review." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const tenantId = await resolveTenantId(supabase);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        tenant_id: tenantId,
        name,
        message,
        rating,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[reviews] create", error);
      return NextResponse.json(
        { error: "We couldn’t submit your review. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id as string,
      message: "Thank you! Your review was submitted and is pending approval.",
    });
  } catch (err) {
    console.error("[reviews] create", err);
    return NextResponse.json(
      { error: "We couldn’t submit your review. Please try again." },
      { status: 500 },
    );
  }
}
