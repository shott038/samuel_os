"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Folder, X } from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";

interface Props {
  left: ReactNode;
  right: ReactNode;
  status?: ReactNode;
}

export default function LayoutShell({ left, right, status }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { activeSlug } = useArchive();
  const prevSlug = useRef<string | null>(activeSlug);

  // Auto-close the drawer when a file actually opens (activeSlug changes
  // from null → something, or to a different file).
  useEffect(() => {
    if (activeSlug && activeSlug !== prevSlug.current) {
      setDrawerOpen(false);
    }
    prevSlug.current = activeSlug;
  }, [activeSlug]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="terminal-glow relative flex h-dvh flex-col bg-bg">
      {status}

      {/* Mobile toolbar — visible below md */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-bg-deep px-3 py-2.5 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open archive"
          className="flex items-center gap-2 rounded-sm border border-info/40 bg-bg-elev px-4 py-2.5 font-mono text-sm uppercase tracking-widest text-info transition-colors hover:border-signal hover:text-signal active:bg-bg-deep"
        >
          <Folder className="size-5" />
          Archive
        </button>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
          SOS_v1
        </span>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-1 md:grid-cols-[minmax(0,18rem)_1fr]">
        {/* Desktop-only inline left panel */}
        <section className="hidden min-h-0 overflow-hidden border-border md:block md:border-r">
          {left}
        </section>

        {/* Right panel is always visible */}
        <section className="min-h-0 overflow-hidden">{right}</section>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Archive"
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col",
              "border-r border-border bg-bg shadow-2xl md:hidden",
            )}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-bg-deep px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-info">
                ARCHIVE_SYSTEM
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close archive"
                className="rounded-sm p-1 text-text/80 transition-colors hover:bg-bg-elev hover:text-text focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              {left}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
