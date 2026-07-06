"use client";

import { useCallback, useMemo } from "react";
import { Lock } from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";
import type { ArchiveFolder, ArchiveFolderSlug } from "@/data/archive";

const FOLDER_GLYPH: Record<string, string> = {
  wiring: "◇",
  builds: "◈",
  ai_agents: "⬡",
  finance: "◎",
  academics: "▤",
  writings: "✎",
  baseball: "◉",
  faith_roots: "✦",
  hobbies: "⬢",
  photography: "▣",
  references: "⇱",
  contact_info: "☍",
};

/** Deterministic per-folder "sector integrity" (62–96%) — pure lore. */
function integrityFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return 62 + (h % 35);
}

export default function FileExplorer() {
  const { archive, activeSlug, openFile, openContact } = useArchive();

  const filesByFolder = useMemo(() => {
    const map: Record<string, typeof archive.files> = {};
    for (const folder of archive.folders) {
      map[folder.slug] = archive.files.filter((f) => f.folder === folder.slug);
    }
    return map;
  }, [archive]);

  const activeFolderSlug = useMemo(() => {
    if (!activeSlug) return null;
    return archive.files.find((f) => f.slug === activeSlug)?.folder ?? null;
  }, [activeSlug, archive.files]);

  // Every folder holds exactly one overview file — tapping the shard opens
  // it directly, no expand-then-select step.
  const openFolder = useCallback(
    (slug: ArchiveFolderSlug) => {
      const first = filesByFolder[slug]?.[0];
      if (first) openFile(first.slug);
    },
    [filesByFolder, openFile],
  );

  return (
    <nav aria-label="Archive" className="px-4 pb-4 pt-3.5">
      <StripHeader />
      <div className="scroll-strip -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1">
        {archive.folders.map((folder) => {
          const fileCount = filesByFolder[folder.slug]?.length ?? 0;
          const isActive = folder.slug === activeFolderSlug;
          if (folder.slug === "contact_info") {
            return <ContactShard key={folder.slug} onOpen={openContact} />;
          }
          return (
            <button
              key={folder.slug}
              type="button"
              onClick={() => openFolder(folder.slug)}
              className={cn(
                "clip-shard relative min-w-[11.5rem] shrink-0 snap-start border bg-panel p-3 text-left transition-colors",
                isActive
                  ? "border-info/50"
                  : "border-border active:border-border-hi",
              )}
              style={isActive ? { background: "rgba(38,28,10,0.35)" } : undefined}
            >
              <ShardCardBody folder={folder} fileCount={fileCount} isActive={isActive} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function StripHeader() {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-2.5 font-tech text-[12px] font-semibold uppercase tracking-[0.42em] text-muted">
        Memory Shards
        <span
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, rgba(61,212,200,0.35), transparent)" }}
        />
      </div>
    </div>
  );
}

function ShardCardBody({
  folder,
  fileCount,
  isActive,
}: {
  folder: ArchiveFolder;
  fileCount: number;
  isActive: boolean;
}) {
  const integrity = integrityFor(folder.slug);
  const isLinks = folder.section === "links";
  return (
    <span className="grid grid-cols-[30px_1fr_auto] items-center gap-3">
      <span
        className={cn(
          "grid size-[30px] place-items-center border text-[13px]",
          isActive
            ? "border-info/50 bg-info/10 text-info-hot"
            : "border-signal/25 bg-signal/5 text-signal",
        )}
        aria-hidden
      >
        {FOLDER_GLYPH[folder.slug] ?? "◆"}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block truncate font-tech text-[15px] font-semibold tracking-wide",
            isActive ? "text-info-hot" : "text-text",
          )}
        >
          {folder.displayName}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[8.5px] tracking-[0.14em] text-muted">
          {isLinks ? (
            "DIRECT CHANNEL"
          ) : (
            <>
              INTEGRITY
              <span className="relative inline-block h-[3px] w-[52px] bg-signal/10" aria-hidden>
                <span
                  className={cn(
                    "absolute inset-y-0 left-0",
                    integrity < 70
                      ? "bg-info shadow-[0_0_5px_rgba(200,144,32,0.7)]"
                      : "bg-signal shadow-[0_0_5px_rgba(61,212,200,0.7)]",
                  )}
                  style={{ width: `${integrity}%` }}
                />
              </span>
            </>
          )}
        </span>
      </span>
      <span className="font-mono text-[10px] tabular-nums text-muted">
        {isLinks ? "→" : String(fileCount).padStart(2, "0")}
      </span>
    </span>
  );
}

function ContactShard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open encrypted contact uplink"
      className={cn(
        "clip-shard group relative min-w-[11.5rem] shrink-0 snap-start border border-info/40 p-3 text-left transition-colors hover:border-info/70",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-info/60",
      )}
      style={{ background: "rgba(38,28,10,0.30)" }}
    >
      {/* slow amber breathing glow — opacity-only, compositor-cheap */}
      <span
        className="anim-core-pulse pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 24px rgba(200,144,32,0.14)" }}
        aria-hidden
      />
      <span className="grid grid-cols-[30px_1fr_auto] items-center gap-3">
        <span
          className="grid size-[30px] place-items-center border border-info/50 bg-info/10 text-info-hot"
          aria-hidden
        >
          <Lock className="size-3.5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-tech text-[15px] font-semibold tracking-wide text-info-hot">
            Contact
          </span>
          <span className="anim-reconnect mt-0.5 block font-mono text-[8.5px] tracking-[0.14em] text-info/80">
            ENCRYPTED // ACCESS REQUIRED
          </span>
        </span>
        <span className="font-mono text-[10px] text-info-hot" aria-hidden>
          ⚿
        </span>
      </span>
    </button>
  );
}
