"use client";

import { useEffect, useReducer, useRef } from "react";
import { cn } from "@/lib/utils";

const LINES = [
  "> samuel_os booting...",
  "> loading core modules...",
  "> system ready",
] as const;

// Durations
const LINE_DURATION_MS = 800;
const TOTAL_DURATION_MS = LINE_DURATION_MS * LINES.length; // 2400ms
const FADE_OUT_MS = 250;
const REDUCED_DURATION_MS = 600;

type Phase = "init" | "active" | "fading" | "done";

interface State {
  phase: Phase;
  visibleCount: number;
}

type Action =
  | { type: "begin" }
  | { type: "show_line"; count: number }
  | { type: "start_fade" }
  | { type: "done" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "begin":
      return { ...state, phase: "active" };
    case "show_line":
      return { ...state, visibleCount: action.count };
    case "start_fade":
      return { ...state, phase: "fading" };
    case "done":
      return { ...state, phase: "done" };
    default:
      return state;
  }
}

export default function BootSequence() {
  // Start in `init` so the server and the first client render agree (both render null).
  // sessionStorage is only read inside the effect, after hydration completes.
  const [state, dispatch] = useReducer(reducer, {
    phase: "init",
    visibleCount: 0,
  });

  const prefersReducedMotion = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    dispatch({ type: "start_fade" });
    timersRef.current.push(
      setTimeout(() => dispatch({ type: "done" }), FADE_OUT_MS),
    );
  };

  useEffect(() => {
    const seen = sessionStorage.getItem("ri_boot_seen") === "1";
    if (seen) {
      dispatch({ type: "done" });
      return;
    }

    sessionStorage.setItem("ri_boot_seen", "1");
    dispatch({ type: "begin" });

    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onKey = () => dismiss();
    const onClick = () => dismiss();
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);

    if (prefersReducedMotion.current) {
      dispatch({ type: "show_line", count: LINES.length });
      const t = setTimeout(dismiss, REDUCED_DURATION_MS);
      timersRef.current.push(t);
    } else {
      LINES.forEach((_, i) => {
        const t = setTimeout(
          () => dispatch({ type: "show_line", count: i + 1 }),
          LINE_DURATION_MS * i,
        );
        timersRef.current.push(t);
      });
      const fadeT = setTimeout(dismiss, TOTAL_DURATION_MS);
      timersRef.current.push(fadeT);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `init` still renders the overlay: it is server-rendered so the boot screen
  // is the first paint, before hydration. Repeat visits are hidden pre-paint
  // by the inline script in layout.tsx via html[data-boot-seen].
  if (state.phase === "done") return null;

  return (
    <div
      id="boot-overlay"
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-start justify-center bg-bg-deep px-16",
        "transition-opacity",
        state.phase === "fading" ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
    >
      <span className="sr-only">Press any key to skip</span>

      <div className="flex flex-col gap-4">
        {LINES.map((line, i) => {
          const isVisible = i < state.visibleCount;
          const isActive = i === state.visibleCount - 1;

          return (
            <div
              key={line}
              className={cn(
                "font-mono text-2xl text-signal",
                "transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {line}
              {isActive && (
                <span
                  className="ml-1 inline-block animate-pulse text-signal"
                  aria-hidden
                >
                  ▍
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
