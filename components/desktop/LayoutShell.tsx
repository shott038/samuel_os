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

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,20rem)_1fr_3.5rem]">
        {/* Archive: left rail */}
        <section
          className="min-h-0 border-r border-border"
          style={{ background: "linear-gradient(180deg, rgba(6,17,20,0.72), rgba(6,17,20,0.25))" }}
        >
          {left}
        </section>

        {/* Stage */}
        <section className="min-h-0 overflow-hidden">
          {right}
        </section>

        {/* Telemetry spine */}
        <aside
          className="flex flex-col items-center gap-4 border-l border-border py-5"
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
