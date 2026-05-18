"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SignalDot from "./SignalDot";
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
  stable:       "Samuel Operating System",
  weak:         "Samuel Operating System",
  lost:         "///SIGNAL LOST///",
  reconnecting: "RECONNECTING...",
};

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
      "flex items-center gap-2 border-b border-border bg-bg-deep px-3 py-2 font-mono text-[0.65rem] tracking-wider text-muted anim-scan sm:gap-4 sm:px-4 sm:text-xs",
      glitching && "anim-glitch-hard",
    )}>
      <span className="flex min-w-0 items-center gap-2">
        <SignalDot tone={tone} pulse={!isLost} />
        <span className="text-signal">[ SOS &gt;</span>
        <span className={cn(
          "truncate uppercase tracking-widest",
          !isLost && !isReconnecting && "text-text",
          isWeak && "text-warn anim-sig-weak",
          isLost && "text-crit anim-sig-lost",
          isReconnecting && "text-muted anim-reconnect",
        )}>
          {OS_LABEL[signal]}
        </span>
        <span className="text-signal">]</span>
      </span>

      <span className={cn(
        "hidden items-center gap-2 uppercase md:flex",
        isWeak && "anim-sig-weak",
        isLost && "anim-sig-lost",
      )}>
        <span className="text-info">archive_integrity:</span>
        <span className="text-info">
          {isLost ? "--%  " : isReconnecting ? "??" : `${integrity}%`}
        </span>
      </span>

      <span className="ml-auto hidden items-center gap-2 uppercase sm:flex">
        <SignalDot tone={tone} pulse={!isLost} />
        <span className={cn(
          isWeak && "text-warn anim-sig-weak",
          isLost && "text-crit anim-sig-lost",
          isReconnecting && "text-muted anim-reconnect",
        )}>
          {SIGNAL_LABEL[signal]}
        </span>
      </span>
    </div>
  );
}
