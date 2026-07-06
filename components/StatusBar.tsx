"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SignalDot from "./SignalDot";
import { ARCHIVE } from "@/data/archive";
import { cn } from "@/lib/utils";

type SignalLevel = "stable" | "weak" | "lost" | "reconnecting";

const SIGNAL_TONE: Record<SignalLevel, "signal" | "warn" | "crit" | "muted"> = {
  stable:       "signal",
  weak:         "warn",
  lost:         "crit",
  reconnecting: "muted",
};

const SIGNAL_LABEL: Record<SignalLevel, string> = {
  stable:       "signal_stable",
  weak:         "signal_weak",
  lost:         "signal_lost",
  reconnecting: "reconnecting...",
};

const OS_LABEL: Record<SignalLevel, string> = {
  stable:       "SAMUEL_OS",
  weak:         "SAMUEL_OS",
  lost:         "///SIGNAL LOST///",
  reconnecting: "RECONNECTING...",
};

const SHARD_COUNT = ARCHIVE.folders.length;

export default function StatusBar() {
  const [signal, setSignal] = useState<SignalLevel>("stable");
  const [integrity, setIntegrity] = useState(87);
  const [glitching, setGlitching] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerGlitch = useCallback((ms = 420) => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), ms);
  }, []);

  const scheduleNext = useCallback(() => {
    const delay = 9000 + Math.random() * 14000;
    timer.current = setTimeout(() => {
      const r = Math.random();

      if (r < 0.35) {
        // Glitch burst only — no state change
        triggerGlitch();

      } else if (r < 0.65) {
        // Weak signal event
        triggerGlitch();
        setSignal("weak");
        setIntegrity(v => Math.max(52, v - Math.floor(Math.random() * 18 + 6)));
        setTimeout(() => {
          setSignal("stable");
          setIntegrity(87);
        }, 3500 + Math.random() * 2000);

      } else {
        // Full signal lost sequence
        triggerGlitch(600);
        setSignal("lost");
        setIntegrity(0);
        setTimeout(() => {
          setSignal("reconnecting");
          setIntegrity(0);
          setTimeout(() => {
            setSignal("weak");
            setIntegrity(61);
            setTimeout(() => {
              setSignal("stable");
              setIntegrity(87);
            }, 2500 + Math.random() * 1000);
          }, 2200 + Math.random() * 800);
        }, 1800 + Math.random() * 600);
      }

      scheduleNext();
    }, delay);
  }, [triggerGlitch]);

  useEffect(() => {
    scheduleNext();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [scheduleNext]);

  const tone = SIGNAL_TONE[signal];
  const isLost = signal === "lost";
  const isReconnecting = signal === "reconnecting";
  const isWeak = signal === "weak";

  return (
    <div className={cn(
      "anim-scan relative z-10 flex items-center gap-3 border-b border-border px-3 py-2.5 font-mono text-[0.6rem] tracking-wider text-muted sm:gap-6 sm:px-6 sm:text-[0.68rem]",
      glitching && "anim-glitch-hard",
    )}
    style={{ background: "linear-gradient(180deg, rgba(4,13,16,0.9), rgba(4,13,16,0.4))" }}
    >
      {/* brand */}
      <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <span className="relative block size-4 rotate-45 border border-border-hi sm:size-5" aria-hidden>
          <span className="anim-core-pulse absolute inset-[4px] bg-signal shadow-[0_0_12px_var(--brand-signal)] sm:inset-[5px]" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className={cn(
            "font-disp text-[10px] tracking-[0.22em] sm:text-[11px] sm:tracking-[0.3em]",
            !isLost && !isReconnecting && "text-signal-active",
            isWeak && "anim-sig-weak text-warn",
            isLost && "anim-sig-lost text-crit",
            isReconnecting && "anim-reconnect text-muted",
          )}>
            {OS_LABEL[signal]}
          </span>
          <span className="whitespace-nowrap text-[7px] tracking-[0.24em] text-muted">
            DEEP ARCHIVE // v2.0
          </span>
        </span>
      </span>

      {/* waveform */}
      <svg
        className="hud-wave h-6 min-w-16 flex-1 opacity-85 max-md:hidden"
        viewBox="0 0 400 26"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polyline points="0,13 20,13 26,4 32,22 38,13 70,13 80,9 90,17 100,13 150,13 158,2 166,24 174,13 220,13 232,8 244,18 256,13 300,13 310,5 320,21 330,13 400,13" />
      </svg>
      <span className="flex-1 md:hidden" />

      <span className={cn(
        "flex items-center gap-1.5 uppercase sm:gap-2",
        isWeak && "anim-sig-weak",
        isLost && "anim-sig-lost",
      )}>
        <span className="max-[380px]:hidden">archive_integrity</span>
        <span className="text-info-hot">
          {isLost ? "--%" : isReconnecting ? "??" : `${integrity}%`}
        </span>
      </span>

      <span className="hidden items-center gap-2 uppercase md:flex">
        mem_shards <span className="text-info-hot">{SHARD_COUNT}</span>
      </span>

      <span className="flex items-center gap-2 uppercase">
        <SignalDot tone={tone} pulse={!isLost} />
        <span className={cn(
          "text-signal max-sm:hidden",
          isWeak && "anim-sig-weak text-warn",
          isLost && "anim-sig-lost text-crit",
          isReconnecting && "anim-reconnect text-muted",
        )}>
          {SIGNAL_LABEL[signal]}
        </span>
      </span>
    </div>
  );
}
