import { anthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { ARCHIVE, getFile } from "@/data/archive";
import { buildSystemPrompt } from "@/lib/system-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 4000;
const MAX_TOTAL_CHARS = 12000;
const MAX_OUTPUT_TOKENS = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitBuckets = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateLimitBuckets.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateLimitBuckets.set(ip, hits);
  if (rateLimitBuckets.size > 5000) {
    for (const [k, v] of rateLimitBuckets) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length === 0) rateLimitBuckets.delete(k);
      else rateLimitBuckets.set(k, fresh);
    }
  }
  return true;
}

interface ChatRequestBody {
  messages: UIMessage[];
  activeSlug?: string | null;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "invalid request body" }, { status: 400 });
  }

  const { messages, activeSlug } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages required" }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "too many messages" }, { status: 413 });
  }

  let totalChars = 0;
  for (const m of messages) {
    const text = JSON.stringify(m.parts ?? m);
    if (text.length > MAX_CHARS_PER_MESSAGE) {
      return Response.json({ error: "message too long" }, { status: 413 });
    }
    totalChars += text.length;
  }
  if (totalChars > MAX_TOTAL_CHARS) {
    return Response.json({ error: "conversation too long" }, { status: 413 });
  }

  const activeFile = activeSlug ? getFile(activeSlug) : null;
  const system = buildSystemPrompt({
    archive: ARCHIVE,
    activeFileTitle: activeFile?.title,
    activeFileSlug: activeFile?.slug,
    activeFileFolder: activeFile?.folder,
  });

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  });

  return result.toUIMessageStreamResponse();
}
