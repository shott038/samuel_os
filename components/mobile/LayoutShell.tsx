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

      <div className="flex min-h-0 flex-1 flex-col">
        {/* Stage */}
        <section className="min-h-0 flex-1 overflow-hidden">
          {right}
        </section>

        {/* Archive: bottom strip */}
        <section
          className="min-h-0 shrink-0 border-t border-border"
          style={{ background: "linear-gradient(180deg, rgba(6,17,20,0.72), rgba(6,17,20,0.25))" }}
        >
          {left}
        </section>
      </div>
    </div>
  );
}
