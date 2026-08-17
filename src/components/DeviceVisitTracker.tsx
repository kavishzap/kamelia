"use client";

import { useEffect } from "react";

let sentThisLoad = false;

function collectPayload() {
  const screen = window.screen;
  return {
    platform: navigator.platform || undefined,
    language: navigator.language || undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
    screenWidth: screen?.width,
    screenHeight: screen?.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio,
    path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
    userAgent: navigator.userAgent || undefined,
  };
}

/** Records device/browser details once per website load. Fails silently. */
export function DeviceVisitTracker() {
  useEffect(() => {
    if (sentThisLoad) return;
    sentThisLoad = true;

    const body = JSON.stringify(collectPayload());
    const blob = new Blob([body], { type: "application/json" });

    try {
      if (navigator.sendBeacon?.("/api/device-visits", blob)) return;
    } catch {
      /* fall through to fetch */
    }

    void fetch("/api/device-visits", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* ignore */
    });
  }, []);

  return null;
}
