"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Check, Lock, Mail, MapPin, X } from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";

type Phase = "locked" | "breach" | "unlocked";

const UNLOCK_KEY = "sos_contact_unlocked";

const CONTACT = {
  email: "samuel.schoettker4@gmail.com",
  location: "West Palm Beach, FL",
  linkedin: "https://www.linkedin.com/in/samuel-schoettker-700b05264",
  linkedinHandle: "samuel-schoettker",
} as const;

interface BreachLine {
  text: string;
  delay: number; // ms after previous line
  tone?: "ok" | "warn" | "crit" | "bright";
  glitch?: boolean; // fire a panel glitch burst when this line lands
}

const BREACH_SCRIPT: readonly BreachLine[] = [
  { text: "> ./decrypt_contact.sh --target=SCHOETTKER_S --force", delay: 100 },
  { text: "[ARCHIVE_SEC] handshake........................ OK", delay: 350, tone: "ok" },
  { text: "[ARCHIVE_SEC] probing record locks............. 3 FOUND", delay: 300 },
  { text: "> bypass --layer 1 ............................ OK (0.31s)", delay: 380, tone: "ok" },
  { text: "> bypass --layer 2 ............................ OK (0.87s)", delay: 420, tone: "ok" },
  { text: "> bypass --layer 3 ............................ ACCESS DENIED", delay: 500, tone: "crit", glitch: true },
  { text: "> retry --keyspace 0x3FA2..0xFFFF --brute", delay: 450 },
  { text: "[■■■□□□□□□□] 31%   44,102 keys/s", delay: 350, tone: "warn" },
  { text: "[■■■■■■□□□□] 61%   51,877 keys/s", delay: 330, tone: "warn" },
  { text: "[■■■■■■■■■■] 100%  KEY ACCEPTED", delay: 400, tone: "ok", glitch: true },
  { text: "> integrity check.............................. PASS", delay: 320, tone: "ok" },
  { text: "> decrypting CONTACT_RECORD.enc ...", delay: 380 },
  { text: "ACCESS GRANTED — RECORD DECRYPTED", delay: 600, tone: "bright", glitch: true },
];

const TONE_CLASS: Record<NonNullable<BreachLine["tone"]>, string> = {
  ok: "text-signal",
  warn: "text-info-hot",
  crit: "text-crit",
  bright: "text-signal-active font-bold",
};

export default function ContactTerminal() {
  const { contactOpen, closeContact } = useArchive();

  const [phase, setPhase] = useState<Phase>("locked");
  const [lineCount, setLineCount] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wasAlreadyUnlocked, setWasAlreadyUnlocked] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // On open: restore unlock state from this session
  useEffect(() => {
    if (!contactOpen) return;
    let unlocked = false;
    try {
      unlocked = sessionStorage.getItem(UNLOCK_KEY) === "1";
    } catch {}
    setPhase(unlocked ? "unlocked" : "locked");
    setWasAlreadyUnlocked(unlocked);
    setLineCount(0);
    setCopied(false);
  }, [contactOpen]);

  // Escape closes
  useEffect(() => {
    if (!contactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContact();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contactOpen, closeContact]);

  // Clear pending timers on close/unmount
  useEffect(() => {
    if (!contactOpen) {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [contactOpen]);

  // Keep the breach log scrolled to the newest line
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lineCount]);

  const runBreach = useCallback(() => {
    setPhase("breach");
    setLineCount(0);

    let elapsed = 0;
    BREACH_SCRIPT.forEach((line, i) => {
      elapsed += line.delay;
      const t = setTimeout(() => {
        setLineCount(i + 1);
        if (line.glitch) {
          setGlitching(true);
          setTimeout(() => setGlitching(false), 450);
        }
      }, elapsed);
      timersRef.current.push(t);
    });

    const done = setTimeout(() => {
      setPhase("unlocked");
      try {
        sessionStorage.setItem(UNLOCK_KEY, "1");
      } catch {}
    }, elapsed + 900);
    timersRef.current.push(done);
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(CONTACT.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  if (!contactOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="contact-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
        onClick={closeContact}
      >
        <motion.div
          key="contact-panel"
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Contact uplink terminal"
          className={cn(
            "clip-console relative flex w-full max-w-xl flex-col border border-border-hi",
            glitching && "anim-glitch-hard",
          )}
          style={{
            background: "linear-gradient(180deg, rgba(6,17,20,0.97), rgba(3,10,12,0.98))",
            boxShadow: "0 0 60px rgba(61,212,200,0.12), inset 0 1px 0 rgba(143,247,238,0.08)",
          }}
        >
          {/* corrupt scanlines during breach */}
          {phase === "breach" && (
            <div className="anim-corrupt-scan pointer-events-none absolute inset-0 z-10" aria-hidden />
          )}

          {/* header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em]">
            <span className="flex items-center gap-2 text-info-hot">
              <Lock className="size-3.5" />
              UPLINK://CONTACT
            </span>
            <span className="flex items-center gap-3">
              <span className="text-muted max-sm:hidden">ARCHIVE_SEC L7</span>
              <button
                type="button"
                onClick={closeContact}
                aria-label="Close contact uplink"
                className="rounded-sm p-1 text-text/70 transition-colors hover:text-text"
              >
                <X className="size-4" />
              </button>
            </span>
          </div>

          {/* ── LOCKED ── */}
          {phase === "locked" && (
            <div className="flex flex-col gap-5 p-5 sm:p-6">
              <div className="font-mono text-[13px] leading-relaxed">
                <p className="text-muted">
                  operator@samuel_os:~${" "}
                  <span className="text-text">./decrypt_contact.sh --target=SCHOETTKER_S --force</span>
                  <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-signal align-middle" aria-hidden />
                </p>
                <p className="mt-4 text-crit/90">
                  [ WARNING: record protected by ARCHIVE_SEC layer 7 ]
                </p>
                <p className="mt-1 text-muted">
                  [ direct read refused — brute-force decryption required ]
                </p>
                {wasAlreadyUnlocked && (
                  <p className="mt-1 text-signal/80">[ note: record already decrypted this session ]</p>
                )}
              </div>

              <button
                type="button"
                onClick={runBreach}
                className="clip-btn group mx-auto flex items-center gap-3 border border-info/50 bg-info/10 px-8 py-3.5 font-tech text-lg font-bold tracking-[0.3em] text-info-hot transition-colors hover:bg-info/20 hover:text-signal-active"
              >
                [ BASH ▸ ]
              </button>
              <p className="text-center font-mono text-[8px] uppercase tracking-[0.3em] text-muted/60">
                EXECUTE DECRYPTION SEQUENCE
              </p>
            </div>
          )}

          {/* ── BREACH ── */}
          {phase === "breach" && (
            <div
              ref={scrollRef}
              className="scroll-system h-72 overflow-y-auto p-5 font-mono text-[12.5px] leading-[1.7] sm:p-6"
              aria-live="polite"
            >
              {BREACH_SCRIPT.slice(0, lineCount).map((line, i) => (
                <p
                  key={i}
                  className={cn(
                    "whitespace-pre",
                    line.tone ? TONE_CLASS[line.tone] : "text-text/80",
                    line.tone === "crit" && "anim-rgb",
                  )}
                >
                  {line.text}
                </p>
              ))}
              <span className="inline-block h-3.5 w-2 animate-pulse bg-signal" aria-hidden />
            </div>
          )}

          {/* ── UNLOCKED ── */}
          {phase === "unlocked" && (
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <p className="anim-crt-blip text-center font-disp text-sm uppercase tracking-[0.3em] text-signal-active">
                ACCESS GRANTED
              </p>
              <p className="-mt-2 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted">
                CONTACT_RECORD.enc — DECRYPTED
              </p>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 border border-border bg-panel px-4 py-3">
                  <Mail className="size-4 shrink-0 text-signal" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-muted">EMAIL</p>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="block truncate font-mono text-sm text-signal-active underline-offset-4 hover:underline"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="flex size-8 shrink-0 items-center justify-center border border-border text-muted transition-colors hover:border-border-hi hover:text-signal"
                  >
                    {copied ? <Check className="size-3.5 text-signal" /> : <Copy className="size-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 border border-border bg-panel px-4 py-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4 shrink-0 text-signal"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-muted">LINKEDIN</p>
                    <a
                      href={CONTACT.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-mono text-sm text-signal-active underline-offset-4 hover:underline"
                    >
                      {CONTACT.linkedinHandle}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 border border-border bg-panel px-4 py-3">
                  <MapPin className="size-4 shrink-0 text-signal" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-muted">LOCATION</p>
                    <p className="font-mono text-sm text-text">{CONTACT.location}</p>
                  </div>
                </div>
              </div>

              <p className="font-mono text-[11px] leading-relaxed text-muted">
                Email is the fastest channel. Be direct about what you want — role, company, what
                caught your eye. You&apos;ll get an honest answer either way.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
