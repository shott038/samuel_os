"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronRight, FileText, X } from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";
import type { ArchiveFolder, ArchiveFile, ArchiveFolderSlug } from "@/data/archive";

type Row =
  | { kind: "folder"; folderSlug: ArchiveFolderSlug; id: string }
  | { kind: "file"; folderSlug: ArchiveFolderSlug; fileSlug: string; id: string };

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
  const { archive, activeSlug, openFile } = useArchive();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sheetFolder, setSheetFolder] = useState<ArchiveFolderSlug | null>(null);

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

  const visibleRows = useMemo<Row[]>(() => {
    const rows: Row[] = [];
    for (const folder of archive.folders) {
      rows.push({
        kind: "folder",
        folderSlug: folder.slug,
        id: `folder:${folder.slug}`,
      });
      if (expanded[folder.slug]) {
        for (const file of filesByFolder[folder.slug] ?? []) {
          rows.push({
            kind: "file",
            folderSlug: folder.slug,
            fileSlug: file.slug,
            id: `file:${file.slug}`,
          });
        }
      }
    }
    return rows;
  }, [archive.folders, expanded, filesByFolder]);

  // Auto-expand the folder containing the active file (e.g. when chat opens one
  // via tool-call) so the highlight is actually visible.
  useEffect(() => {
    if (!activeSlug) return;
    const file = archive.files.find((f) => f.slug === activeSlug);
    if (!file) return;
    setExpanded((prev) => (prev[file.folder] ? prev : { ...prev, [file.folder]: true }));
  }, [activeSlug, archive.files]);

  // Close the mobile sheet on Escape
  useEffect(() => {
    if (!sheetFolder) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setSheetFolder(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetFolder]);

  const toggleFolder = useCallback((slug: ArchiveFolderSlug) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }, []);

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
        case "ArrowRight": {
          if (row.kind === "folder") {
            e.preventDefault();
            if (!expanded[row.folderSlug]) {
              setExpanded((prev) => ({ ...prev, [row.folderSlug]: true }));
            } else {
              const firstChild = filesByFolder[row.folderSlug]?.[0];
              if (firstChild) focusRow(`file:${firstChild.slug}`);
            }
          }
          break;
        }
        case "ArrowLeft": {
          if (row.kind === "folder") {
            if (expanded[row.folderSlug]) {
              e.preventDefault();
              setExpanded((prev) => ({ ...prev, [row.folderSlug]: false }));
            }
          } else {
            e.preventDefault();
            focusRow(`folder:${row.folderSlug}`);
          }
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (row.kind === "folder") {
            toggleFolder(row.folderSlug);
          } else {
            openFile(row.fileSlug);
          }
          break;
        }
        default:
          break;
      }
    },
    [expanded, filesByFolder, focusRow, openFile, toggleFolder, visibleRows],
  );

  const sheetFiles = sheetFolder ? filesByFolder[sheetFolder] ?? [] : [];
  const sheetFolderData = sheetFolder
    ? archive.folders.find((f) => f.slug === sheetFolder)
    : null;

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
              files={filesByFolder[folder.slug] ?? []}
              isOpen={!!expanded[folder.slug]}
              isActive={folder.slug === activeFolderSlug}
              focusedId={focusedId}
              firstFolderSlug={archive.folders[0]?.slug}
              activeSlug={activeSlug}
              toggleFolder={toggleFolder}
              setFocusedId={setFocusedId}
              handleKey={handleKey}
              openFile={openFile}
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
              {linksFolders.map((folder) => (
                <FolderShard
                  key={folder.slug}
                  folder={folder}
                  files={filesByFolder[folder.slug] ?? []}
                  isOpen={!!expanded[folder.slug]}
                  isActive={folder.slug === activeFolderSlug}
                  focusedId={focusedId}
                  firstFolderSlug={archive.folders[0]?.slug}
                  activeSlug={activeSlug}
                  toggleFolder={toggleFolder}
                  setFocusedId={setFocusedId}
                  handleKey={handleKey}
                  openFile={openFile}
                />
              ))}
            </>
          )}
        </div>
      </nav>

      {/* ── Mobile: horizontal shard strip ── */}
      <nav aria-label="Archive" className="px-4 pb-4 pt-3.5 md:hidden">
        <RailHeader folderCount={archive.folders.length} compact />
        <div className="scroll-strip -mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1">
          {archive.folders.map((folder) => {
            const files = filesByFolder[folder.slug] ?? [];
            const isActive = folder.slug === activeFolderSlug;
            return (
              <button
                key={folder.slug}
                type="button"
                onClick={() => setSheetFolder(folder.slug)}
                className={cn(
                  "clip-shard relative min-w-[11.5rem] shrink-0 snap-start border bg-panel p-3 text-left backdrop-blur-sm transition-colors",
                  isActive
                    ? "border-info/50"
                    : "border-border active:border-border-hi",
                )}
                style={isActive ? { background: "rgba(38,28,10,0.35)" } : undefined}
              >
                <ShardCardBody folder={folder} fileCount={files.length} isActive={isActive} />
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Mobile: folder file sheet ── */}
      {sheetFolder && sheetFolderData && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setSheetFolder(null)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sheetFolderData.displayName}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[70dvh] flex-col border-t border-border-hi bg-bg-deep/95 backdrop-blur-md md:hidden"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
              <span className="font-tech text-base font-semibold tracking-wide text-info-hot">
                <span className="mr-2 text-signal">{FOLDER_GLYPH[sheetFolder] ?? "◆"}</span>
                {sheetFolderData.displayName}
              </span>
              <button
                type="button"
                onClick={() => setSheetFolder(null)}
                aria-label="Close"
                className="rounded-sm p-1.5 text-text/80 transition-colors hover:text-text"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="border-b border-border px-4 py-2 font-mono text-[10px] leading-relaxed text-muted">
              {sheetFolderData.description}
            </p>
            <div className="scroll-system min-h-0 flex-1 overflow-y-auto p-3">
              {sheetFiles.map((file) => (
                <button
                  key={file.slug}
                  type="button"
                  onClick={() => {
                    openFile(file.slug);
                    setSheetFolder(null);
                  }}
                  className={cn(
                    "mb-1.5 flex w-full items-center gap-2.5 border border-border bg-panel px-3 py-2.5 text-left",
                    file.slug === activeSlug && "border-signal/50 text-signal",
                  )}
                >
                  <FileText className="size-4 shrink-0 text-muted" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-sm text-text">
                      {file.filename}
                    </span>
                    <span className="block truncate font-mono text-[9px] uppercase tracking-wider text-muted">
                      {file.title}
                    </span>
                  </span>
                  <ChevronRight className="size-3.5 shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
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
  files: readonly ArchiveFile[];
  isOpen: boolean;
  isActive: boolean;
  focusedId: string | null;
  firstFolderSlug: ArchiveFolderSlug | undefined;
  activeSlug: string | null;
  toggleFolder: (slug: ArchiveFolderSlug) => void;
  setFocusedId: (id: string) => void;
  handleKey: (e: KeyboardEvent<HTMLElement>, row: Row) => void;
  openFile: (slug: string) => void;
}

function FolderShard({
  folder,
  files,
  isOpen,
  isActive,
  focusedId,
  firstFolderSlug,
  activeSlug,
  toggleFolder,
  setFocusedId,
  handleKey,
  openFile,
}: FolderShardProps) {
  const folderId = `folder:${folder.slug}`;
  const isFocused = focusedId === folderId;

  return (
    <div role="none" className="mb-2">
      <button
        type="button"
        role="treeitem"
        aria-expanded={isOpen}
        aria-label={`${folder.displayName} — ${files.length} entries`}
        title={folder.description}
        tabIndex={isFocused || (focusedId === null && folder.slug === firstFolderSlug) ? 0 : -1}
        data-row-id={folderId}
        onClick={() => toggleFolder(folder.slug)}
        onFocus={() => setFocusedId(folderId)}
        onKeyDown={(e) =>
          handleKey(e, { kind: "folder", folderSlug: folder.slug, id: folderId })
        }
        className={cn(
          "clip-shard relative w-full border bg-panel p-3 text-left backdrop-blur-sm transition-colors",
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
        <ShardCardBody folder={folder} fileCount={files.length} isActive={isActive} />
      </button>

      {isOpen && files.length > 0 && (
        <div role="group" className="mb-1 mt-1">
          {files.map((file) => {
            const fileId = `file:${file.slug}`;
            const isFileActive = file.slug === activeSlug;
            const fileFocused = focusedId === fileId;
            return (
              <button
                key={file.slug}
                type="button"
                role="treeitem"
                aria-selected={isFileActive}
                tabIndex={fileFocused ? 0 : -1}
                data-row-id={fileId}
                onClick={() => openFile(file.slug)}
                onFocus={() => setFocusedId(fileId)}
                onKeyDown={(e) =>
                  handleKey(e, {
                    kind: "file",
                    folderSlug: folder.slug,
                    fileSlug: file.slug,
                    id: fileId,
                  })
                }
                className={cn(
                  "flex w-full items-center gap-2 py-1.5 pl-11 pr-2 text-left transition-colors",
                  "motion-reduce:transition-none",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
                  isFileActive
                    ? "border-l-2 border-signal bg-bg-elev/60 pl-[calc(2.75rem-2px)] text-signal"
                    : "flicker-on-hover border-l-2 border-transparent text-muted hover:bg-bg-elev/40 hover:text-text",
                )}
              >
                <FileText
                  className={cn(
                    "size-3.5 shrink-0",
                    isFileActive ? "text-signal" : "text-muted",
                  )}
                />
                <span className="truncate font-mono text-[13px]">{file.filename}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
