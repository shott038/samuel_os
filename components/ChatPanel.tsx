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

import HoloCore from "@/components/HoloCore";
import SignalDot from "@/components/SignalDot";
import { getFile } from "@/data/archive";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";

const SEED_PROMPTS: readonly { label: string; text: string }[] = [
  { label: "QUERY_01", text: "What are your most impressive projects?" },
  { label: "QUERY_02", text: "Walk me through your leadership experience." },
  { label: "QUERY_03", text: "What capabilities define you?" },
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
          className="anim-crt-flicker text-center font-mono text-lg font-bold uppercase tracking-widest text-crit sm:text-xl"
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
        <div className="w-72 overflow-hidden rounded-sm border border-crit/30 bg-bg-deep sm:w-80">
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

// ─── Milestone overlay: SYSTEM OVERLOADED (6th prompt) ──────────────────────

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
          className="anim-crt-flicker font-mono text-xl font-bold uppercase tracking-widest text-crit sm:text-2xl"
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
  const { activeSlug, closeFile, pendingPrompt, consumePendingPrompt } = useArchive();
  const [input, setInput] = useState("");

  // ── Milestone state ──────────────────────────────────────────────────────
  const userMessageCountRef = useRef(0);
  const [queryCount, setQueryCount] = useState(0);
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
      setQueryCount(count);
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
    setQueryCount(0);
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

  // Lore hint under the input: counts down to the next milestone event
  const hint = systemLocked
    ? null
    : queryCount < 3
      ? `${3 - queryCount} QUERIES UNTIL DATA CORRUPTION EVENT · SESSION MONITORED`
      : queryCount < 6
        ? `${6 - queryCount} QUERIES UNTIL SYSTEM_OVERLOAD · SESSION MONITORED`
        : null;

  return (
    <div id="chat-panel" className="relative flex h-full min-h-0 flex-col">
      {/* ── Milestone overlays ── */}
      <AnimatePresence>
        {activeOverlay === "corruption" && (
          <DataCorruptionOverlay key="corruption" onDone={onCorruptionDone} />
        )}
        {activeOverlay === "overload" && (
          <SystemOverloadOverlay key="overload" onDone={onOverloadDone} />
        )}
      </AnimatePresence>

      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.24em]">
        <div className="flex items-center gap-2 text-info">
          <SignalDot tone="signal" className="animate-pulse" />
          SOS // CONSOLE
        </div>
        {!systemLocked && (
          <button
            type="button"
            onClick={onReset}
            disabled={messages.length === 0 && !error}
            className="rounded-sm border border-border px-2 py-0.5 text-muted transition-colors hover:border-border-hi hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
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
        className="scroll-system flex-1 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <EmptyState onSelect={submit} disabled={isStreaming} />
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col px-4 pb-6">
            {/* Compact core stays at the head of the transcript */}
            <div className="flex flex-col items-center gap-1 pb-2 pt-4">
              <HoloCore size={128} />
              <span className="font-disp text-[11px] uppercase tracking-[0.34em] text-signal-active/80">
                Samuel<span className="text-info-hot">_</span>OS
              </span>
            </div>
            <ol className="flex flex-col gap-4">
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
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3 pt-2 sm:px-5 sm:pb-4">
        {activeFile ? (
          <div className="flex items-center justify-between gap-2 border border-info/25 bg-bg-elev/70 px-3 py-2 font-mono text-xs text-info">
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
          <div className="border border-crit/30 bg-crit/10 px-3 py-2 font-mono text-xs text-crit">
            {error.message || "Connection error. Try again."}
          </div>
        ) : null}

        {systemLocked ? (
          <div
            className="anim-sig-lost flex items-center justify-center border border-crit/40 bg-crit/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-crit"
            role="status"
            aria-label="System offline"
          >
            SYSTEM OFFLINE — ACCESS REVOKED
          </div>
        ) : (
          <>
            <form
              onSubmit={onSubmit}
              className="clip-console flex items-end gap-2.5 border border-border-hi p-2.5 sm:gap-3 sm:p-3"
              style={{
                background: "linear-gradient(180deg, rgba(10,26,30,0.85), rgba(6,17,20,0.9))",
                boxShadow: "0 0 34px rgba(61,212,200,0.10), inset 0 1px 0 rgba(143,247,238,0.08)",
              }}
            >
              <span
                className="size-9 shrink-0 overflow-hidden rounded-full border border-signal/40 shadow-[0_0_14px_rgba(61,212,200,0.3)]"
                aria-hidden
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hologram.webp"
                  alt=""
                  className="hologram-idle h-full w-full object-cover object-top"
                  style={{ mixBlendMode: "screen" }}
                />
              </span>
              <span className="pb-2 font-mono text-sm text-signal" aria-hidden>
                &gt;_
              </span>
              <label className="sr-only" htmlFor="chat-input">
                Query the recovered intelligence
              </label>
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onTextareaKeyDown}
                placeholder="query the archive..."
                disabled={isStreaming}
                rows={1}
                className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent px-1 py-1.5 font-mono text-base text-text placeholder:text-muted focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isStreaming || input.trim().length === 0}
                aria-label="Send query"
                className="clip-btn flex h-9 shrink-0 items-center gap-1.5 bg-signal px-3 font-tech text-xs font-bold tracking-[0.18em] text-bg-deep shadow-[0_0_20px_rgba(61,212,200,0.4)] transition-opacity disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
              >
                <span className="max-sm:hidden">TRANSMIT</span>
                <Send className="size-3.5" />
              </button>
            </form>
            {hint && (
              <p className="text-center font-mono text-[8px] uppercase tracking-[0.28em] text-muted/60">
                {hint}
              </p>
            )}
          </>
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
                "max-w-[85%] whitespace-pre-wrap font-mono text-[13.5px] leading-relaxed",
                isUser
                  ? "clip-msg-user border border-signal/25 bg-signal/5 px-3.5 py-2.5 text-signal-active"
                  : "clip-msg-ai border border-border border-l-2 border-l-info bg-panel px-3.5 py-2.5 text-text/95"
              )}
            >
              {!isUser && (
                <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.3em] text-info-hot">
                  ▌ SAMUEL_OS // RECONSTRUCTED
                </span>
              )}
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
    <div className="mx-auto flex h-full min-h-fit max-w-3xl flex-col items-center justify-center gap-4 px-4 py-6 text-center sm:gap-5">
      <HoloCore size={230} labels className="sm:hidden" />
      <HoloCore size={300} labels className="max-sm:hidden" />

      <div>
        <h1 className="anim-crt-blip font-disp text-[26px] uppercase tracking-[0.24em] text-signal-active [text-shadow:0_0_22px_rgba(61,212,200,0.45),0_0_60px_rgba(61,212,200,0.18)] sm:text-[38px] sm:tracking-[0.3em]">
          Samuel<span className="text-info-hot [text-shadow:0_0_22px_rgba(200,144,32,0.5)]">_</span>OS
        </h1>
        <p className="mt-2.5 font-mono text-[8px] uppercase tracking-[0.4em] text-muted sm:text-[9.5px] sm:tracking-[0.5em]">
          RECONSTRUCTED INTELLIGENCE <span className="text-signal">//</span> QUERY THE ARCHIVE
        </p>
      </div>

      <div className="scroll-strip -mx-4 flex w-[calc(100%+2rem)] snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:w-auto sm:justify-center sm:overflow-visible sm:px-0">
        {SEED_PROMPTS.map((p) => (
          <button
            key={p.text}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(p.text)}
            className="clip-chip flicker-on-hover shrink-0 snap-start border border-border bg-panel px-4 py-2.5 text-left transition-colors hover:border-border-hi hover:bg-panel-hi disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block font-mono text-[8px] tracking-[0.24em] text-muted">
              {p.label}
            </span>
            <span className="mt-0.5 block font-tech text-sm font-semibold tracking-wide text-text">
              {p.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
