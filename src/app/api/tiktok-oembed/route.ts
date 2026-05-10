import { NextResponse } from "next/server";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function extractVideoId(html: string): string | null {
  const data = html.match(/data-video-id="(\d+)"/);
  if (data?.[1]) return data[1];
  const embed = html.match(/tiktok\.com\/embed\/v2\/(\d+)/);
  if (embed?.[1]) return embed[1];
  const path = html.match(/\/video\/(\d+)/);
  if (path?.[1]) return path[1];
  return null;
}

/**
 * Proxies TikTok oEmbed so the client can resolve thumbnails / video ids without CORS issues.
 * If TikTok blocks or changes responses, the UI falls back to placeholders + external link.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url?.trim()) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!parsed.hostname.endsWith("tiktok.com")) {
    return NextResponse.json({ error: "Only TikTok URLs are allowed" }, { status: 400 });
  }

  const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "oembed_failed", status: res.status },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      html?: string;
      thumbnail_url?: string;
      title?: string;
      author_name?: string;
    };

    const html = data.html ?? "";
    const videoId = extractVideoId(html);

    return NextResponse.json({
      videoId,
      thumbnailUrl: data.thumbnail_url ?? null,
      title: data.title ?? null,
      authorName: data.author_name ?? null,
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}
