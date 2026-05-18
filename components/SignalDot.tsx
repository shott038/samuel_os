"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
  tone?: "signal" | "info" | "muted" | "warn" | "crit";
  pulse?: boolean;
  className?: string;
}

const TONE_CLASS: Record<NonNullable<Props["tone"]>, string> = {
  signal: "bg-signal",
  info: "bg-info",
  muted: "bg-muted",
  warn: "bg-warn",
  crit: "bg-crit",
};

export default function SignalDot({ tone = "signal", pulse = false, className }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  const baseClass = cn("inline-block size-2 rounded-full", TONE_CLASS[tone], className);

  if (pulse && !reducedMotion) {
    return (
      <motion.span
        className={baseClass}
        aria-hidden
        animate={{ scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    );
  }

  return <span className={baseClass} aria-hidden />;
}
