import { NextResponse } from "next/server";
import { getSupabaseAdmin, resolveTenantId } from "@/lib/supabase/admin";
import {
  clientIp,
  clipInt,
  clipRatio,
  clipText,
  parseDevice,
  type DeviceVisitClientPayload,
} from "@/lib/device-visit";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as DeviceVisitClientPayload;
    const headerUa = clipText(request.headers.get("user-agent"), 800);
    const userAgent = clipText(body.userAgent, 800) ?? headerUa;
    const parsed = parseDevice(userAgent ?? "", clipText(body.platform, 80));

    const supabase = getSupabaseAdmin();
    const tenantId = await resolveTenantId(supabase);

    const { error } = await supabase.from("device_visits").insert({
      tenant_id: tenantId,
      ip_address: clientIp(request.headers),
      user_agent: userAgent,
      platform: clipText(body.platform, 80),
      os: parsed.os,
      browser: parsed.browser,
      device_type: parsed.deviceType,
      language: clipText(body.language, 40),
      timezone: clipText(body.timezone, 80),
      screen_width: clipInt(body.screenWidth),
      screen_height: clipInt(body.screenHeight),
      viewport_width: clipInt(body.viewportWidth),
      viewport_height: clipInt(body.viewportHeight),
      pixel_ratio: clipRatio(body.pixelRatio),
      path: clipText(body.path, 300) ?? "/",
      referrer: clipText(body.referrer, 500),
    });

    if (error) {
      console.error("[device_visits]", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[device_visits]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
