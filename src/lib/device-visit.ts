export type DeviceVisitClientPayload = {
  platform?: string;
  language?: string;
  timezone?: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  pixelRatio?: number;
  path?: string;
  referrer?: string;
  userAgent?: string;
};

export type ParsedDevice = {
  os: string;
  browser: string;
  deviceType: "mobile" | "tablet" | "desktop" | "bot";
};

const MAX_TEXT = 500;

export function clipText(value: unknown, max = MAX_TEXT): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export function clipInt(value: unknown, max = 100_000): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0 || n > max) return null;
  return Math.round(n);
}

export function clipRatio(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0 || n > 10) return null;
  return Math.round(n * 100) / 100;
}

export function parseDevice(userAgent: string, platform?: string | null): ParsedDevice {
  const ua = userAgent.toLowerCase();

  if (/bot|crawl|spider|slurp|preview|lighthouse|pingdom/i.test(userAgent)) {
    return { os: parseOs(ua, platform), browser: parseBrowser(ua), deviceType: "bot" };
  }

  const isTablet =
    /ipad|tablet|playbook|silk/.test(ua) ||
    (/android/.test(ua) && !/mobile/.test(ua));
  const isMobile = /mobi|iphone|ipod|android.+mobile|windows phone/.test(ua);

  let deviceType: ParsedDevice["deviceType"] = "desktop";
  if (isTablet) deviceType = "tablet";
  else if (isMobile) deviceType = "mobile";

  return {
    os: parseOs(ua, platform),
    browser: parseBrowser(ua),
    deviceType,
  };
}

function parseOs(ua: string, platform?: string | null): string {
  const hint = platform?.toLowerCase() ?? "";
  if (/win/.test(hint) || /windows/.test(ua)) return "Windows";
  if (/android/.test(hint) || /android/.test(ua)) return "Android";
  if (/iphone|ipad|ipod|ios/.test(hint) || /iphone|ipad|ipod/.test(ua)) return "iOS";
  if (/mac/.test(hint) || /mac os/.test(ua)) return "macOS";
  if (/cros/.test(ua)) return "Chrome OS";
  if (/linux/.test(hint) || /linux/.test(ua)) return "Linux";
  return "Unknown";
}

function parseBrowser(ua: string): string {
  if (/edg\//.test(ua)) return "Edge";
  if (/opr\/|opera/.test(ua)) return "Opera";
  if (/samsungbrowser/.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/.test(ua)) return "Firefox";
  if (/crios|chrome/.test(ua) && !/edg\//.test(ua)) return "Chrome";
  if (/safari/.test(ua) && !/chrome|crios|android/.test(ua)) return "Safari";
  return "Unknown";
}

export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real =
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return real ? real.slice(0, 64) : null;
}
