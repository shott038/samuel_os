import { headers } from "next/headers";
import { userAgent } from "next/server";

export type Platform = "mobile" | "desktop";

/**
 * Server-side platform sniffer. Runs per-request before any HTML is sent,
 * so each visitor only ever receives their platform's component tree.
 *
 * Detection order:
 *  1. `Sec-CH-UA-Mobile` client hint — Chromium browsers send this on every
 *     request (`?1` = mobile, `?0` = desktop) and it survives UA reduction.
 *  2. User-Agent parse via Next's `userAgent()` (ua-parser-js under the hood):
 *     `device.type` is "mobile" for phones. Tablets ("tablet") get the
 *     desktop layout — their viewports handle it.
 */
export async function detectPlatform(): Promise<Platform> {
  const h = await headers();

  const clientHint = h.get("sec-ch-ua-mobile");
  if (clientHint === "?1") return "mobile";
  if (clientHint === "?0") return "desktop";

  const { device } = userAgent({ headers: h });
  return device.type === "mobile" ? "mobile" : "desktop";
}
