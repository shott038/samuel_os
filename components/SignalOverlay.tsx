"use client";

import { useEffect, useRef, useState } from "react";

interface GlitchBar {
  top: number;
  height: number;
  offsetX: number;
  opacity: number;
  teal: boolean;
}

export default function SignalOverlay() {
  const [bars, setBars] = useState<GlitchBar[]>([]);
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fire = () => {
      const count = 2 + Math.floor(Math.random() * 5);
      const newBars: GlitchBar[] = Array.from({ length: count }, () => ({
        top: Math.random() * 88,
        height: 0.3 + Math.random() * 3.5,
        offsetX: (Math.random() - 0.5) * 28,
        opacity: 0.04 + Math.random() * 0.09,
        teal: Math.random() > 0.4,
      }));
      setBars(newBars);
      setActive(true);

      // Multi-frame flicker: on → brief off → on → off
      const totalMs = 120 + Math.random() * 220;
      setTimeout(() => {
        setActive(false);
        // Optional second burst
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setBars(prev => prev.map(b => ({
              ...b,
              top: b.top + (Math.random() - 0.5) * 8,
              offsetX: -b.offsetX * 0.6,
            })));
            setActive(true);
            setTimeout(() => setActive(false), 80 + Math.random() * 100);
          }, 40 + Math.random() * 60);
        }
      }, totalMs);
    };

    const schedule = () => {
      const delay = 18000 + Math.random() * 22000; // every 18-40s
      timer.current = setTimeout(() => {
        fire();
        schedule();
      }, delay);
    };

    schedule();
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  if (!active || bars.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: `${bar.top}%`,
            height: `${bar.height}%`,
            transform: `translateX(${bar.offsetX}px)`,
            background: bar.teal
              ? `rgba(61, 212, 200, ${bar.opacity})`
              : `rgba(200, 144, 32, ${bar.opacity * 0.6})`,
            backdropFilter: `brightness(${0.8 + Math.random() * 0.6}) saturate(${0.4 + Math.random()})`,
          }}
        />
      ))}
    </div>
  );
}
