"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { Send, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import SignalDot from "@/components/SignalDot";
import { getFile } from "@/data/archive";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";

const SEED_PROMPTS: readonly string[] = [
  "What are your most impressive projects?",
  "Walk me through your leadership experience.",
  "What capabilities define you?",
];

// ─── Milestone overlay: DATA CORRUPTION (3rd prompt) ────────────────────────

function DataCorruptionOverlay({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"active" | "recovering" | "done">("active");
  const [subtext, setSubtext] = useState(0);

  // Cycle subtext every 900ms
  useEffect(() => {
    const id = setInterval(() => setSubtext((s) => (s + 1) % 2), 900);
    return () => clearInterval(id);
  }, []);

  // Progress bar fills over 2.5s → then 1s of "RECOVERY OK" → fade out
  useEffect(() => {
    const recoverTimer = setTimeout(() => setPhase("recovering"), 2500);
    const doneTimer = setTimeout(() => onDone(), 3500);
    return () => {
      clearTimeout(recoverTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const subtextLines = ["ARCHIVE INTEGRITY COMPROMISED", "ATTEMPTING RECOVERY..."];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep/95"
      style={{ pointerEvents: "all" }}
    >
      {/* Corrupt scanlines layer */}
      <div className="anim-corrupt-scan pointer-events-none absolute inset-0" />

      {/* Screen tear ghost */}
      <div
        className="anim-screen-tear pointer-events-none absolute inset-0 font-mono text-2xl text-crit"
        aria-hidden
        style={{ userSelect: "none" }}
      >
        <div className="flex h-full items-center justify-center">
          /// DATA CORRUPTION DETECTED ///
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-6 px-8">
        <h2
          className="anim-crt-flicker font-mono text-xl font-bold uppercase tracking-widest text-crit"
          style={{ letterSpacing: "0.25em" }}
        >
          /// DATA CORRUPTION DETECTED ///
        </h2>

        <p
          key={subtext}
          className="anim-subtext-flicker font-mono text-sm uppercase tracking-widest text-crit/70"
        >
          {subtextLines[subtext]}
        </p>

        {/* Recovery progress bar */}
        <div className="w-80 overflow-hidden rounded-sm border border-crit/30 bg-bg-deep">
          <motion.div
            className="h-1.5 bg-crit"
            initial={{ width: "0%" }}
            animate={{ width: phase === "recovering" ? "100%" : "85%" }}
            transition={{
              duration: phase === "recovering" ? 0.4 : 2.5,
              ease: phase === "recovering" ? "easeOut" : "linear",
            }}
          />
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-crit/50">
          {phase === "recovering" ? "RECOVERY COMPLETE — RESUMING" : "RUNNING INTEGRITY CHECK..."}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Milestone overlay: SYSTEM OVERLOADED (5th prompt) ──────────────────────

function SystemOverloadOverlay({ onDone }: { onDone: () => void }) {
  const [countdown, setCountdown] = useState(3);
  const [terminated, setTerminated] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setTerminated(true);
      const doneTimer = setTimeout(() => onDone(), 800);
      return () => clearTimeout(doneTimer);
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 900);
    return () => clearTimeout(id);
  }, [countdown, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.08 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-deep/98"
      style={{ pointerEvents: "all" }}
    >
      {/* Dense corrupt scanlines */}
      <div className="anim-corrupt-scan pointer-events-none absolute inset-0 opacity-200" />

      {/* Screen tear ghost */}
      <div
        className="anim-screen-tear pointer-events-none absolute inset-0 font-mono text-2xl text-crit"
        aria-hidden
        style={{ userSelect: "none" }}
      >
        <div className="flex h-full items-center justify-center">SYSTEM_OVERLOAD</div>
      </div>

      <div className="relative flex flex-col items-center gap-5 px-8 text-center">
        <h2
          className="anim-crt-flicker font-mono text-2xl font-bold uppercase tracking-widest text-crit"
          style={{ letterSpacing: "0.3em" }}
        >
          SYSTEM_OVERLOAD
        </h2>

        <div className="flex flex-col gap-1.5">
          <p className="anim-sig-lost font-mono text-sm uppercase tracking-widest text-crit/80">
            QUERY LIMIT EXCEEDED
          </p>
          <p className="anim-glitch-loop font-mono text-sm uppercase tracking-widest text-crit/70">
            OPERATOR ACCESS REVOKED
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-crit/50">
            CONTACT SYSTEM ADMINISTRATOR
          </p>
        </div>

        <div className="mt-2 flex flex-col items-center gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-crit/40">
            SESSION TERMINATING IN
          </p>
          <div
            className={cn(
              "font-mono text-5xl font-bold tabular-nums text-crit",
              !terminated && "anim-countdown"
            )}
          >
            {terminated ? "TERMINATED" : countdown}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Module-scoped slot read by the transport's body() resolver.
// Updated by ChatPanel's effect on every activeSlug change. Intentionally
// not React state — the transport is constructed once, body() runs per
// request, and we just need it to see fresh data.
let latestActiveSlug: string | null = null;

function createChatTransport() {
  return new DefaultChatTransport({
    api: "/api/chat",
    body: () => ({ activeSlug: latestActiveSlug }),
  });
}

export default function ChatPanel() {
  const { activeSlug, openFile, closeFile, pendingPrompt, consumePendingPrompt } = useArchive();
  const [input, setInput] = useState("");

  // ── Milestone state ──────────────────────────────────────────────────────
  const userMessageCountRef = useRef(0);
  const [activeOverlay, setActiveOverlay] = useState<"corruption" | "overload" | null>(null);
  const [systemLocked, setSystemLocked] = useState(false);

  // Module-scoped slot lets the transport's body() resolver always see the
  // latest active file without recreating the transport (which would reset
  // chat state). React's lifecycle never reads it during render.
  const [transport] = useState(() => createChatTransport());

  useEffect(() => {
    latestActiveSlug = activeSlug;
  }, [activeSlug]);

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
    stop,
    clearError,
  } = useChat({
    transport,
  });

  const isStreaming = status === "submitted" || status === "streaming";

  const listRef = useRef<HTMLDivElement | null>(null);
  const stickyBottomRef = useRef(true);

  const onListScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickyBottomRef.current = distanceFromBottom < 32;
  }, []);

  useEffect(() => {
    if (!stickyBottomRef.current) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const submit = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming || systemLocked) return;
      stickyBottomRef.current = true;
      void sendMessage({ text: trimmed });
      setInput("");

      // Increment and check milestones
      userMessageCountRef.current += 1;
      const count = userMessageCountRef.current;
      if (count === 3) setActiveOverlay("corruption");
      else if (count === 6) setActiveOverlay("overload");
    },
    [sendMessage, isStreaming, systemLocked]
  );

  const onCorruptionDone = useCallback(() => {
    setActiveOverlay(null);
  }, []);

  const onOverloadDone = useCallback(() => {
    setActiveOverlay(null);
    setSystemLocked(true);
  }, []);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submit(input);
    },
    [submit, input]
  );

  const onTextareaKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit(input);
      }
    },
    [submit, input]
  );

  const onReset = useCallback(() => {
    if (isStreaming) stop();
    setMessages([]);
    setInput("");
    clearError();
    stickyBottomRef.current = true;
    userMessageCountRef.current = 0;
    setActiveOverlay(null);
    setSystemLocked(false);
  }, [isStreaming, stop, setMessages, clearError]);

  // Consume a pending prompt from FileViewer chips or other surfaces.
  // Use a ref guard so a re-render with the same non-null value doesn't re-fire.
  const lastConsumedPromptRef = useRef<string | null>(null);
  useEffect(() => {
    if (!pendingPrompt) return;
    if (pendingPrompt === lastConsumedPromptRef.current) return;
    lastConsumedPromptRef.current = pendingPrompt;
    consumePendingPrompt();
    submit(pendingPrompt);
  }, [pendingPrompt, consumePendingPrompt, submit]);

  const activeFile = activeSlug ? getFile(activeSlug) : null;
  const showError = error && !isStreaming;

  return (
    <div id="chat-panel" className="relative flex h-full min-h-0 flex-col bg-bg">
      {/* ── Milestone overlays ── */}
      <AnimatePresence>
        {activeOverlay === "corruption" && (
          <DataCorruptionOverlay key="corruption" onDone={onCorruptionDone} />
        )}
        {activeOverlay === "overload" && (
          <SystemOverloadOverlay key="overload" onDone={onOverloadDone} />
        )}
      </AnimatePresence>
      <header className="flex items-center justify-between gap-2 border-b border-border bg-bg-deep px-4 py-2 font-mono text-[0.65rem] uppercase tracking-widest">
        <div className="flex items-center gap-2 text-info">
          <SignalDot tone="signal" className="animate-pulse" />
          Samuel OS
        </div>
        {!systemLocked && (
          <button
            type="button"
            onClick={onReset}
            disabled={messages.length === 0 && !error}
            className="rounded border border-border px-2 py-0.5 text-muted transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Clear chat history"
          >
            Reset
          </button>
        )}
      </header>

      <div
        ref={listRef}
        onScroll={onListScroll}
        role="log"
        aria-live="polite"
        aria-label="Recovered intelligence transcript"
        className="flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <EmptyState onSelect={submit} disabled={isStreaming} />
        ) : (
          <ol className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
            {messages.map((m, idx) => {
              const isLast = idx === messages.length - 1;
              return (
                <MessageRow
                  key={m.id}
                  message={m}
                  showStreamingCursor={isLast && isStreaming && m.role === "assistant"}
                />
              );
            })}
          </ol>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-bg-deep p-3">
        {activeFile ? (
          <div className="flex items-center justify-between gap-2 rounded-sm border border-info/20 bg-bg-elev px-3 py-2 font-mono text-xs text-info">
            <span className="truncate">▌ Viewing: /{activeFile.folder}/{activeFile.filename}</span>
            <button
              type="button"
              onClick={closeFile}
              className="flex size-5 shrink-0 items-center justify-center rounded text-info/70 transition-colors hover:text-info"
              aria-label="Close active file"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : null}

        {showError ? (
          <div className="rounded-sm border border-crit/30 bg-crit/10 px-3 py-2 font-mono text-xs text-crit">
            {error.message || "Connection error. Try again."}
          </div>
        ) : null}

        {systemLocked ? (
          <div
            className="anim-sig-lost flex items-center justify-center rounded border border-crit/40 bg-crit/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-crit"
            role="status"
            aria-label="System offline"
          >
            SYSTEM OFFLINE — ACCESS REVOKED
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex items-end gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hologram.png"
              alt=""
              aria-hidden
              className="hologram-idle pointer-events-none h-10 w-10 shrink-0 rounded-full object-cover object-top"
              style={{ mixBlendMode: "screen" }}
            />
            <label className="sr-only" htmlFor="chat-input">
              Query the recovered intelligence
            </label>
            <textarea
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onTextareaKeyDown}
              placeholder="Query the archive..."
              disabled={isStreaming}
              rows={1}
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none rounded border border-border bg-bg px-3 py-2 text-base text-text placeholder:text-muted focus:border-signal focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isStreaming || input.trim().length === 0}
              aria-label="Send query"
              className="flex size-9 shrink-0 items-center justify-center rounded border border-border bg-bg-elev text-muted transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

interface MessageRowProps {
  message: import("ai").UIMessage;
  showStreamingCursor: boolean;
}

function MessageRow({ message, showStreamingCursor }: MessageRowProps) {
  const isUser = message.role === "user";

  return (
    <li
      className={cn(
        "flex flex-col gap-1.5",
        isUser ? "items-end" : "items-start"
      )}
    >
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`;

        if (part.type === "text") {
          return (
            <div
              key={key}
              className={cn(
                "max-w-[85%] whitespace-pre-wrap text-base leading-relaxed",
                isUser
                  ? "rounded bg-bg-elev px-3 py-2 text-text"
                  : "text-text/95"
              )}
            >
              {part.text}
              {showStreamingCursor && i === message.parts.length - 1 ? (
                <span className="ml-0.5 inline-block animate-pulse text-signal">▍</span>
              ) : null}
            </div>
          );
        }

        return null;
      })}
    </li>
  );
}

interface EmptyStateProps {
  onSelect: (text: string) => void;
  disabled: boolean;
}

function EmptyState({ onSelect, disabled }: EmptyStateProps) {
  return (
    <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-3 px-4 py-8 text-center sm:gap-4 sm:py-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hologram.png"
        alt=""
        aria-hidden
        className="hologram-idle pointer-events-none w-[55%] max-w-[180px] sm:w-[75%] sm:max-w-[260px]"
        style={{ mixBlendMode: "screen" }}
      />
      <div className="flex items-center gap-2 font-mono text-lg uppercase tracking-widest text-info sm:gap-3 sm:text-3xl">
        <SignalDot tone="signal" className="animate-pulse" />
        Samuel OS Ready
      </div>
      <p className="text-xs text-muted sm:text-sm">Query the archive. Suggested entry points:</p>
      <div className="flex flex-col gap-2">
        {SEED_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(p)}
            className="flicker-on-hover rounded border border-border bg-bg-elev px-3 py-2 text-left text-sm text-text/90 transition-colors hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
