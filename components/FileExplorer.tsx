"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Lock } from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";
import type { ArchiveFolder, ArchiveFolderSlug } from "@/data/archive";

type Row = { folderSlug: ArchiveFolderSlug; id: string };

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

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filesByFolder = useMemo(() => {
    const map: Record<string, typeof archive.files> = {};
    for (const folder of archive.folders) {
      map[folder.slug] = archive.files.filter((f) => f.folder === folder.slug);
    }
    return map;
  }, [archive]);

  const archiveFolders = useMemo(
    () => archive.folders.filter((f) => f.section === "archive"),
    [archive.folders],
  );

  const linksFolders = useMemo(
    () => archive.folders.filter((f) => f.section === "links"),
    [archive.folders],
  );

  const activeFolderSlug = useMemo(() => {
    if (!activeSlug) return null;
    return archive.files.find((f) => f.slug === activeSlug)?.folder ?? null;
  }, [activeSlug, archive.files]);

  // Every folder holds exactly one overview file — clicking the folder opens
  // it directly, no expand-then-select step.
  const visibleRows = useMemo<Row[]>(
    () => archive.folders.map((folder) => ({ folderSlug: folder.slug, id: `folder:${folder.slug}` })),
    [archive.folders],
  );

  const openFolder = useCallback(
    (slug: ArchiveFolderSlug) => {
      const first = filesByFolder[slug]?.[0];
      if (first) openFile(first.slug);
    },
    [filesByFolder, openFile],
  );

  const focusRow = useCallback((id: string) => {
    setFocusedId(id);
    const el = containerRef.current?.querySelector<HTMLElement>(
      `[data-row-id="${CSS.escape(id)}"]`,
    );
    el?.focus();
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLElement>, row: Row) => {
      const idx = visibleRows.findIndex((r) => r.id === row.id);
      if (idx < 0) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const next = visibleRows[Math.min(idx + 1, visibleRows.length - 1)];
          if (next) focusRow(next.id);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prev = visibleRows[Math.max(idx - 1, 0)];
          if (prev) focusRow(prev.id);
          break;
        }
        case "Home": {
          e.preventDefault();
          const first = visibleRows[0];
          if (first) focusRow(first.id);
          break;
        }
        case "End": {
          e.preventDefault();
          const last = visibleRows[visibleRows.length - 1];
          if (last) focusRow(last.id);
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          openFolder(row.folderSlug);
          break;
        }
        default:
          break;
      }
    },
    [focusRow, openFolder, visibleRows],
  );

  return (
    <>
      {/* ── Desktop: vertical shard rail ── */}
      <nav
        ref={containerRef}
        aria-label="Archive"
        className="scroll-system hidden h-full overflow-y-auto px-5 py-6 md:block"
      >
        <RailHeader folderCount={archive.folders.length} />
        <div role="tree" aria-label="Archive entries" className="flex flex-col">
          {archiveFolders.map((folder) => (
            <FolderShard
              key={folder.slug}
              folder={folder}
              fileCount={filesByFolder[folder.slug]?.length ?? 0}
              isActive={folder.slug === activeFolderSlug}
              focusedId={focusedId}
              firstFolderSlug={archive.folders[0]?.slug}
              openFolder={openFolder}
              setFocusedId={setFocusedId}
              handleKey={handleKey}
            />
          ))}

          {linksFolders.length > 0 && (
            <>
              <div className="my-3 flex items-center gap-2 px-2">
                <div className="h-px flex-1 bg-signal/15" />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted/70">
                  UPLINKS
                </span>
                <div className="h-px flex-1 bg-signal/15" />
              </div>
              {linksFolders.map((folder) =>
                folder.slug === "contact_info" ? (
                  <ContactShard key={folder.slug} onOpen={openContact} />
                ) : (
                  <FolderShard
                    key={folder.slug}
                    folder={folder}
                    fileCount={filesByFolder[folder.slug]?.length ?? 0}
                    isActive={folder.slug === activeFolderSlug}
                    focusedId={focusedId}
                    firstFolderSlug={archive.folders[0]?.slug}
                    openFolder={openFolder}
                    setFocusedId={setFocusedId}
                    handleKey={handleKey}
                  />
                ),
              )}
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile: horizontal shard strip ── */}
      <nav aria-label="Archive" className="px-4 pb-4 pt-3.5 md:hidden">
        <RailHeader folderCount={archive.folders.length} compact />
        <div className="scroll-strip -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1">
          {archive.folders.map((folder) => {
            const fileCount = filesByFolder[folder.slug]?.length ?? 0;
            const isActive = folder.slug === activeFolderSlug;
            if (folder.slug === "contact_info") {
              return <ContactShard key={folder.slug} onOpen={openContact} mobile />;
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
    </>
  );
}

function RailHeader({ folderCount, compact }: { folderCount: number; compact?: boolean }) {
  return (
    <div className={compact ? "mb-2.5" : "mb-5"}>
      <div className="flex items-center gap-2.5 font-tech text-[12px] font-semibold uppercase tracking-[0.42em] text-muted">
        Memory Shards
        <span
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, rgba(61,212,200,0.35), transparent)" }}
        />
      </div>
      <div className="mt-1 font-mono text-[9px] tracking-[0.2em] text-muted/70">
        {folderCount} SECTORS RECOVERED · 1 DECRYPTING
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

interface FolderShardProps {
  folder: ArchiveFolder;
  fileCount: number;
  isActive: boolean;
  focusedId: string | null;
  firstFolderSlug: ArchiveFolderSlug | undefined;
  openFolder: (slug: ArchiveFolderSlug) => void;
  setFocusedId: (id: string) => void;
  handleKey: (e: KeyboardEvent<HTMLElement>, row: Row) => void;
}

function FolderShard({
  folder,
  fileCount,
  isActive,
  focusedId,
  firstFolderSlug,
  openFolder,
  setFocusedId,
  handleKey,
}: FolderShardProps) {
  const folderId = `folder:${folder.slug}`;
  const isFocused = focusedId === folderId;

  return (
    <button
      type="button"
      aria-label={`Open ${folder.displayName}`}
      title={folder.description}
      tabIndex={isFocused || (focusedId === null && folder.slug === firstFolderSlug) ? 0 : -1}
      data-row-id={folderId}
      onClick={() => openFolder(folder.slug)}
      onFocus={() => setFocusedId(folderId)}
      onKeyDown={(e) => handleKey(e, { folderSlug: folder.slug, id: folderId })}
      className={cn(
        "clip-shard relative mb-2 w-full border bg-panel p-3 text-left transition-colors",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
        isActive
          ? "border-info/50"
          : "border-border hover:border-border-hi hover:bg-panel-hi",
      )}
      style={isActive ? { background: "rgba(38,28,10,0.35)" } : undefined}
    >
      {isActive && (
        <span className="absolute right-4 top-1.5 font-mono text-[7px] tracking-[0.2em] text-info-hot">
          ▶ DECRYPTED
        </span>
      )}
      <ShardCardBody folder={folder} fileCount={fileCount} isActive={isActive} />
    </button>
  );
}

function ContactShard({ onOpen, mobile }: { onOpen: () => void; mobile?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open encrypted contact uplink"
      className={cn(
        "clip-shard group relative border border-info/40 p-3 text-left transition-colors hover:border-info/70",
        mobile ? "min-w-[11.5rem] shrink-0 snap-start" : "mb-2 w-full",
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
