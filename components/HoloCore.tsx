import { cn } from "@/lib/utils";

interface Props {
  /** Diameter of the ring system in px */
  size?: number;
  /** Show the NEURAL MAP / RECONSTRUCTION side callouts (desktop hero only) */
  labels?: boolean;
  className?: string;
}

/**
 * The hologram centerpiece: Samuel's head inside a rotating HUD ring system
 * with an amber integrity-arc gauge. Pure CSS/SVG — safe to render anywhere.
 */
export default function HoloCore({ size = 300, labels = false, className }: Props) {
  // 87% integrity arc: circumference of r=46 viewBox circle ≈ 289
  const ARC_CIRCUMFERENCE = 289;
  const ARC_OFFSET = ARC_CIRCUMFERENCE * 0.13;

  const holoWidth = size * 0.62;
  const holoHeight = size * 0.68;

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size * 0.88 }}
      aria-hidden
    >
      {/* outer dashed orbit */}
      <span className="ring-spin-slow absolute inset-0 rounded-full border border-dashed border-signal/30" />
      {/* counter-rotating tick ring */}
      <span className="ring-ticks ring-spin-reverse absolute rounded-full opacity-70" style={{ inset: size * 0.04 }} />
      {/* integrity arc gauge */}
      <span className="absolute" style={{ inset: size * 0.08 }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(61,212,200,0.10)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--brand-info)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={ARC_CIRCUMFERENCE}
            strokeDashoffset={ARC_OFFSET}
            style={{ filter: "drop-shadow(0 0 4px rgba(200,144,32,0.8))" }}
          />
        </svg>
      </span>

      {/* the reconstructed head */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hologram.png"
        alt=""
        className="hologram-idle object-cover object-top"
        style={{
          width: holoWidth,
          height: holoHeight,
          mixBlendMode: "screen",
          maskImage: "linear-gradient(180deg, black 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, black 78%, transparent 100%)",
        }}
      />

      {/* scanlines over the head */}
      <span
        className="holo-scanlines pointer-events-none absolute rounded-full"
        style={{ inset: `${size * 0.13}px ${size * 0.2}px` }}
      />

      {labels && (
        <>
          <span className="absolute -left-16 top-[48%] hidden text-right font-mono text-[8px] uppercase tracking-[0.22em] text-muted lg:block">
            NEURAL MAP
            <b className="mt-0.5 block text-[11px] font-normal text-info-hot">87.2%</b>
            <span
              className="absolute left-full top-[55%] ml-1.5 h-px w-12"
              style={{ background: "linear-gradient(90deg, rgba(200,144,32,0.6), transparent)" }}
            />
          </span>
          <span className="absolute -right-20 top-[34%] hidden font-mono text-[8px] uppercase tracking-[0.22em] text-muted lg:block">
            RECONSTRUCTION
            <b className="mt-0.5 block text-[11px] font-normal text-info-hot">ACTIVE</b>
            <span
              className="absolute right-full top-[55%] mr-1.5 h-px w-14"
              style={{ background: "linear-gradient(270deg, rgba(61,212,200,0.5), transparent)" }}
            />
          </span>
        </>
      )}
    </div>
  );
}
