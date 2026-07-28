import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin, resolveTenantId } from "@/lib/supabase/admin";

export type EventRequestBody = {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venueLocation: string;
  setting: string;
  packages: string;
  specialRequests?: string;
};

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00`));
}

/** Reuse customer by tenant + phone when possible; otherwise create. */
async function ensureCustomer(
  supabase: SupabaseClient,
  tenantId: string,
  input: {
    name: string;
    phone: string;
    email: string;
    venueLocation: string;
    eventType: string;
  },
): Promise<string> {
  const { data: existing, error: findError } = await supabase
    .from("customers")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("phone", input.phone)
    .limit(1)
    .maybeSingle();

  if (findError) {
    console.error("[event-requests] find customer", findError);
    throw new Error("We couldn’t save your request. Please try again.");
  }

  if (existing?.id) {
    // Refresh contact details from the latest form submission
    const { error: updateError } = await supabase
      .from("customers")
      .update({
        name: input.name,
        company: input.name,
        email: input.email,
        address: input.venueLocation,
        business_type: input.eventType,
      })
      .eq("id", existing.id)
      .eq("tenant_id", tenantId);

    if (updateError) {
      console.error("[event-requests] update customer", updateError);
    }
    return existing.id as string;
  }

  const { data: created, error: createError } = await supabase
    .from("customers")
    .insert({
      tenant_id: tenantId,
      name: input.name,
      company: input.name,
      email: input.email,
      phone: input.phone,
      phone_2: "",
      address: input.venueLocation,
      business_type: input.eventType,
      status: "Active",
    })
    .select("id")
    .single();

  if (createError || !created?.id) {
    console.error("[event-requests] create customer", createError);
    throw new Error("We couldn’t save your request. Please try again.");
  }

  return created.id as string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<EventRequestBody>;

    const name = requiredString(body.name, "Name");
    const phone = requiredString(body.phone, "Phone");
    const email = optionalString(body.email);
    const eventType = requiredString(body.eventType, "Event type");
    const eventDate = requiredString(body.eventDate, "Event date");
    const eventTime = requiredString(body.eventTime, "Event time");
    const venueLocation = requiredString(body.venueLocation, "Venue location");
    const setting = requiredString(body.setting, "Setting");
    const packages = requiredString(body.packages, "Package");
    const specialRequests = optionalString(body.specialRequests);

    if (!isIsoDate(eventDate)) {
      return NextResponse.json({ error: "Event date must be a valid date." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const tenantId = await resolveTenantId(supabase);

    const customerId = await ensureCustomer(supabase, tenantId, {
      name,
      phone,
      email,
      venueLocation,
      eventType,
    });

    const { data, error } = await supabase
      .from("event_requests")
      .insert({
        tenant_id: tenantId,
        name,
        phone,
        email,
        event_type: eventType,
        event_date: eventDate,
        event_time: eventTime,
        venue_location: venueLocation,
        setting,
        packages,
        special_requests: specialRequests,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[event-requests]", error);
      return NextResponse.json(
        { error: "We couldn’t save your request. Please try again." },
        { status: 500 },
      );
    }

    const id = data.id as string;
    const requestCode = `#KAM-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

    return NextResponse.json({ id, requestCode, customerId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    const isClient =
      /required|valid date|KAMELLIA_TENANT_ID|No tenants|Multiple tenants/i.test(message);
    console.error("[event-requests]", err);
    return NextResponse.json(
      { error: isClient ? message : "We couldn’t save your request. Please try again." },
      { status: isClient ? 400 : 500 },
    );
  }
}
