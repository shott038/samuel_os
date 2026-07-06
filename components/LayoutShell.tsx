import type { ReactNode } from "react";

interface Props {
  left: ReactNode;
  right: ReactNode;
  status?: ReactNode;
}

export default function LayoutShell({ left, right, status }: Props) {
  return (
    <div className="terminal-glow relative z-[5] flex h-dvh flex-col">
      {status}

      <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[minmax(0,20rem)_1fr_3.5rem]">
        {/* Stage first in DOM for mobile order; grid places it via md:order */}
        <section className="order-1 min-h-0 flex-1 overflow-hidden md:order-2">
          {right}
        </section>

        {/* Archive: desktop = left rail; mobile = bottom strip */}
        <section
          className="order-2 min-h-0 shrink-0 border-t border-border md:order-1 md:block md:border-r md:border-t-0"
          style={{ background: "linear-gradient(180deg, rgba(6,17,20,0.72), rgba(6,17,20,0.25))" }}
        >
          {left}
        </section>

        {/* Telemetry spine (desktop only) */}
        <aside
          className="order-3 hidden flex-col items-center gap-4 border-l border-border py-5 md:flex"
          style={{ background: "linear-gradient(180deg, rgba(6,17,20,0.7), rgba(6,17,20,0.3))" }}
          aria-hidden
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-muted [writing-mode:vertical-rl]">
            LAT <b className="font-normal text-signal">32.36N</b> · LON{" "}
            <b className="font-normal text-signal">86.30W</b>
          </span>
          <span
            className="relative w-px flex-1"
            style={{
              background:
                "repeating-linear-gradient(180deg, rgba(61,212,200,0.4) 0 1px, transparent 1px 12px)",
            }}
          >
            <span className="anim-spine-slide absolute -left-[2.5px] size-1.5 rounded-full bg-info shadow-[0_0_10px_var(--brand-info)]" />
          </span>
          <span className="font-mono text-[8px] tracking-[0.3em] text-muted/60 [writing-mode:vertical-rl]">
            SECTOR 07 // PBA_UPLINK // EST. 2028
          </span>
        </aside>
      </div>
    </div>
  );
}
