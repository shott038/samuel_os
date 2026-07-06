"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { getFile, type ArchiveSection } from "@/data/archive";
import { cn } from "@/lib/utils";

type OpenImage = (img: { src: string; alt: string; filename?: string; caption?: string }) => void;

function SectionBlock({ section, openImage }: { section: ArchiveSection; openImage: OpenImage }) {
  if (section.kind === "text") {
    return (
      <div className="mb-4">
        <p className="font-mono text-sm leading-relaxed text-text/90">{section.body}</p>
      </div>
    );
  }

  if (section.kind === "list") {
    return (
      <div className="mb-4">
        {section.heading && (
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
            {section.heading}
          </p>
        )}
        <ul className="space-y-1">
          {section.items.map((item, i) => (
            <li key={i} className="flex gap-2 font-mono text-sm text-text/90">
              <span className="shrink-0 text-signal">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.kind === "project") {
    return (
      <div className="mb-4 rounded-sm border border-border bg-bg-elev p-4">
        <p className="font-mono text-sm font-semibold text-signal">{section.title}</p>
        <p className="font-mono text-xs text-muted">{section.subtitle}</p>
        <p className="mt-2 font-mono text-sm leading-relaxed text-text/90">{section.body}</p>
        {section.tags && section.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {section.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (section.kind === "person") {
    return (
      <div className="mb-4 space-y-0.5">
        <p className="font-mono text-sm font-semibold text-text">{section.name}</p>
        <p className="font-mono text-xs text-muted">{section.role}</p>
        <p className="font-mono text-xs text-info">{section.contact}</p>
        {section.address && <p className="font-mono text-xs text-info">{section.address}</p>}
      </div>
    );
  }

  if (section.kind === "timeline") {
    return (
      <div className="mb-4 space-y-3">
        {section.entries.map((entry, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-16 shrink-0 font-mono text-xs text-signal">{entry.year}</span>
            <div>
              <p className="font-mono text-sm text-text">{entry.label}</p>
              {entry.detail && <p className="font-mono text-xs text-muted">{entry.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === "stat_row") {
    return (
      <div className="mb-4 flex flex-wrap gap-px">
        {section.stats.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col items-center px-4 py-2",
              i > 0 && "border-l border-border",
            )}
          >
            <span className="font-mono text-xs uppercase text-muted">{stat.label}</span>
            <span className="font-mono text-sm font-semibold text-signal">{stat.value}</span>
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === "image") {
    const aspectRatio =
      section.aspect === "portrait" ? "aspect-[3/4]" :
      section.aspect === "square"   ? "aspect-square" :
      "aspect-[4/3]";
    const size = section.size ?? (section.align === "center" ? "md" : "md");
    const widthClass =
      section.align === "right" || section.align === "left"
        ? (size === "xs" ? "w-1/5" : size === "sm" ? "w-1/4" : size === "lg" ? "w-2/5" : "w-1/3")
        : (size === "xs" ? "w-1/4" : size === "sm" ? "w-1/3" : size === "lg" ? "w-3/4" : "w-1/2");
    const floatClass =
      section.align === "right"  ? cn("float-right ml-5 mb-3", widthClass) :
      section.align === "left"   ? cn("float-left mr-5 mb-3", widthClass) :
      cn("mx-auto", widthClass);
    return (
      <figure className={cn("mb-5", floatClass)}>
        <button
          type="button"
          aria-label={`View ${section.alt} full size`}
          onClick={() =>
            openImage({ src: section.src, alt: section.alt, filename: section.filename, caption: section.caption })
          }
          className={cn(
            "group relative block w-full overflow-hidden rounded-sm border border-border bg-bg-deep cursor-zoom-in",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
            aspectRatio,
          )}
        >
          <img
            src={section.src}
            alt={section.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_60%,rgba(6,12,14,0.6)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(61,212,200,0.04)_2px,rgba(61,212,200,0.04)_3px)] mix-blend-overlay" />
          {section.filename && (
            <span className="absolute bottom-2 left-2 rounded-sm bg-bg-deep/85 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal/80">
              [ {section.filename} ]
            </span>
          )}
        </button>
        {section.caption && (
          <figcaption className="mt-2 font-mono text-xs text-muted">
            ▸ {section.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (section.kind === "image_gallery") {
    const maxW =
      section.size === "sm" ? "max-w-md" :
      section.size === "md" ? "max-w-2xl" :
      "";
    const cols = section.columns ?? 2;
    const colsClass =
      cols === 4 ? "grid-cols-4" :
      cols === 3 ? "grid-cols-3" :
      "grid-cols-2";
    return (
      <div className={cn("mb-6 clear-both", maxW)}>
        {section.heading && (
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
            {section.heading}
          </p>
        )}
        <div className={cn("grid gap-3", colsClass)}>
          {section.images.map((img, i) => {
            const cellAspect =
              img.aspect === "portrait" ? "aspect-[3/4]" :
              img.aspect === "square"   ? "aspect-square" :
              "aspect-[4/3]";
            return (
            <figure key={i} className="group">
              <button
                type="button"
                aria-label={`View ${img.alt} full size`}
                onClick={() => openImage({ src: img.src, alt: img.alt, filename: img.filename, caption: img.caption })}
                className={cn(
                  "relative block w-full overflow-hidden rounded-sm border border-border bg-bg-deep cursor-zoom-in",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
                  cellAspect,
                )}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_55%,rgba(6,12,14,0.7)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(61,212,200,0.04)_2px,rgba(61,212,200,0.04)_3px)] mix-blend-overlay" />
                {img.filename && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-bg-deep/85 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-signal/80">
                    {img.filename}
                  </span>
                )}
              </button>
              {img.caption && (
                <figcaption className="mt-1.5 font-mono text-xs text-muted">
                  ▸ {img.caption}
                </figcaption>
              )}
            </figure>
            );
          })}
        </div>
      </div>
    );
  }

  if (section.kind === "contact_block") {
    return (
      <div className="mb-4 space-y-2">
        {[
          { label: "EMAIL", value: section.email },
          { label: "LOCATION", value: section.location },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-3">
            <span className="w-20 shrink-0 font-mono text-xs uppercase text-muted">{label}</span>
            <span className="font-mono text-sm text-info">{value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function FileViewer() {
  const { activeSlug, closeFile, submitPrompt } = useArchive();
  const file = activeSlug ? getFile(activeSlug) : null;

  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    filename?: string;
    caption?: string;
  } | null>(null);

  const openImage = useCallback<OpenImage>((img) => setLightbox(img), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!activeSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox) {
        closeLightbox();
      } else {
        closeFile();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeSlug, closeFile, closeLightbox, lightbox]);

  // Closing the file should also dismiss any open lightbox.
  useEffect(() => {
    if (!activeSlug && lightbox) setLightbox(null);
  }, [activeSlug, lightbox]);

  return (
    <AnimatePresence>
      {file && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/75"
            onClick={closeFile}
            aria-hidden
          />

          <motion.div
            key={file.slug}
            initial={{ opacity: 0, scale: 0.72, y: "18%" }}
            animate={{ opacity: 1, scale: 1, y: "0%" }}
            exit={{ opacity: 0, scale: 0.72, y: "18%" }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={{ transformOrigin: "50% 100%" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="file-viewer-title"
            className="fixed inset-x-20 inset-y-8 z-50 flex flex-col overflow-hidden rounded-md border border-border bg-bg shadow-2xl"
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-border bg-bg-deep px-5 py-3">
              <button
                type="button"
                onClick={closeFile}
                aria-label="Close file"
                className={cn(
                  "rounded-sm p-1 text-crit transition-colors",
                  "hover:bg-bg-elev hover:text-crit",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-crit/60",
                )}
              >
                <X className="size-4" />
              </button>
              <span className="font-mono text-xs text-muted">
                /{file.folder}/{file.filename}
              </span>
            </div>

            <article className="viewer-scanline scroll-system flex-1 overflow-y-auto">
              <motion.div
                key={file.slug + "-content"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeOut", delay: 0.06 }}
                className="relative z-10 px-8 py-8"
              >
                <header
                  className="pb-5"
                  style={{ boxShadow: "0 1px 0 rgba(96,165,250,0.15)" }}
                >
                  <h1
                    id="file-viewer-title"
                    className="text-2xl font-semibold tracking-tight text-text"
                  >
                    {file.title}
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{file.description}</p>
                </header>

                <div className="mt-6 border-t border-border pt-2">
                  {file.sections.map((section, i) => (
                    <SectionBlock key={`${section.kind}-${i}`} section={section} openImage={openImage} />
                  ))}
                </div>

                {file.suggestedPrompts && file.suggestedPrompts.length > 0 && (
                  <footer className="mt-10 border-t border-border pt-5">
                    <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
                      SUGGESTED_QUERIES
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {file.suggestedPrompts.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            submitPrompt(p);
                            closeFile();
                          }}
                          className={cn(
                            "rounded-sm border border-border bg-bg-elev px-3 py-1.5 text-left",
                            "font-mono text-xs text-muted transition-colors",
                            "motion-reduce:transition-none",
                            "hover:border-signal/40 hover:text-signal",
                            "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
                            "flicker-on-hover",
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </footer>
                )}
              </motion.div>
            </article>
          </motion.div>

          <AnimatePresence>
            {lightbox && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                role="dialog"
                aria-modal="true"
                aria-label={lightbox.alt}
                onClick={closeLightbox}
                className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 p-8 cursor-zoom-out"
              >
                <motion.img
                  key={lightbox.src}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  src={lightbox.src}
                  alt={lightbox.alt}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[88vh] max-w-[92vw] rounded-sm border border-border object-contain shadow-[0_0_60px_rgba(61,212,200,0.12)] cursor-default"
                />

                {(lightbox.filename || lightbox.caption) && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 flex flex-col items-center gap-1 text-center"
                  >
                    {lightbox.filename && (
                      <span className="rounded-sm bg-bg-deep/85 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-signal/90">
                        [ {lightbox.filename} ]
                      </span>
                    )}
                    {lightbox.caption && (
                      <span className="font-mono text-xs text-muted">▸ {lightbox.caption}</span>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                  aria-label="Close image"
                  className={cn(
                    "absolute left-4 top-4 rounded-sm p-2 text-text/80 transition-colors",
                    "hover:bg-bg-elev hover:text-text",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
                  )}
                >
                  <X className="size-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
