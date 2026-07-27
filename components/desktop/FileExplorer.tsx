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
import { folderEntries, folderGlyph, recordBadge, type FolderEntry } from "@/lib/archive-nav";
import { cn } from "@/lib/utils";
import type { ArchiveFile, ArchiveFolder, ArchiveFolderSlug } from "@/data/archive";

type Row = { folderSlug: ArchiveFolderSlug; id: string; fileSlug?: string };

/** Deterministic per-folder "sector integrity" (62–96%) — pure lore. */
function integrityFor(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return 62 + (h % 35);
}

const folderRowId = (slug: string) => `folder:${slug}`;
const fileRowId = (folderSlug: string, fileSlug: string) => `file:${folderSlug}/${fileSlug}`;

export default function FileExplorer() {
  const { activeSlug, activeFolderSlug, openFile, openFolder, openContact } = useArchive();

  const [focusedId, setFocusedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const entries = folderEntries();
  const archiveEntries = useMemo(() => folderEntries("archive"), []);
  const linksEntries = useMemo(() => folderEntries("links"), []);

  // Only one sector is unpacked at a time. It follows the active folder, and
  // the keyboard tree can steer it elsewhere. Closing the viewer leaves the
  // last sector open: the modal covers the rail, so collapsing on close would
  // mean nobody ever sees the tree.
  const [expandedSlug, setExpandedSlug] = useState<ArchiveFolderSlug | null>(activeFolderSlug);
  const [syncedFolder, setSyncedFolder] = useState<ArchiveFolderSlug | null>(activeFolderSlug);
  if (activeFolderSlug && activeFolderSlug !== syncedFolder) {
    setSyncedFolder(activeFolderSlug);
    setExpandedSlug(activeFolderSlug);
  }

  const isExpanded = useCallback(
    (entry: FolderEntry) => entry.hasSiblings && entry.folder.slug === expandedSlug,
    [expandedSlug],
  );

  const visibleRows = useMemo<Row[]>(() => {
    const rows: Row[] = [];
    for (const entry of entries) {
      rows.push({ folderSlug: entry.folder.slug, id: folderRowId(entry.folder.slug) });
      if (!isExpanded(entry)) continue;
      for (const file of entry.files) {
        rows.push({
          folderSlug: entry.folder.slug,
          id: fileRowId(entry.folder.slug, file.slug),
          fileSlug: file.slug,
        });
      }
    }
    return rows;
  }, [entries, isExpanded]);

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
        case "ArrowRight": {
          e.preventDefault();
          if (row.fileSlug) break;
          const entry = entries.find((en) => en.folder.slug === row.folderSlug);
          if (entry?.hasSiblings) setExpandedSlug(row.folderSlug);
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (row.fileSlug) {
            setExpandedSlug(null);
            focusRow(folderRowId(row.folderSlug));
          } else if (expandedSlug === row.folderSlug) {
            setExpandedSlug(null);
          }
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
          if (row.fileSlug) openFile(row.fileSlug);
          else openFolder(row.folderSlug);
          break;
        }
        default:
          break;
      }
    },
    [entries, expandedSlug, focusRow, openFile, openFolder, visibleRows],
  );

  const firstFolderSlug = entries[0]?.folder.slug;

  const renderEntry = (entry: FolderEntry) => (
    <FolderShard
      key={entry.folder.slug}
      entry={entry}
      isActive={entry.folder.slug === activeFolderSlug}
      expanded={isExpanded(entry)}
      activeSlug={activeSlug}
      focusedId={focusedId}
      firstFolderSlug={firstFolderSlug}
      openFile={openFile}
      openFolder={openFolder}
      setFocusedId={setFocusedId}
      handleKey={handleKey}
    />
  );

  return (
    <nav
      ref={containerRef}
      aria-label="Archive"
      className="scroll-system h-full overflow-y-auto px-5 py-6"
    >
      <RailHeader folderCount={entries.length} />
      <div role="tree" aria-label="Archive entries" className="flex flex-col">
        {archiveEntries.map(renderEntry)}

        {linksEntries.length > 0 && (
          <>
            <div className="my-3 flex items-center gap-2 px-2">
              <div className="h-px flex-1 bg-signal/15" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted/70">
                UPLINKS
              </span>
              <div className="h-px flex-1 bg-signal/15" />
            </div>
            {linksEntries.map((entry) =>
              entry.folder.slug === "contact_info" ? (
                <ContactShard key={entry.folder.slug} onOpen={openContact} />
              ) : (
                renderEntry(entry)
              ),
            )}
          </>
        )}
      </div>
    </nav>
  );
}

function RailHeader({ folderCount }: { folderCount: number }) {
  return (
    <div className="mb-5">
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
        {folderGlyph(folder.slug)}
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
        {isLinks ? "→" : recordBadge(fileCount)}
      </span>
    </span>
  );
}

interface FolderShardProps {
  entry: FolderEntry;
  isActive: boolean;
  expanded: boolean;
  activeSlug: string | null;
  focusedId: string | null;
  firstFolderSlug: ArchiveFolderSlug | undefined;
  openFile: (slug: string) => void;
  openFolder: (slug: ArchiveFolderSlug) => void;
  setFocusedId: (id: string) => void;
  handleKey: (e: KeyboardEvent<HTMLElement>, row: Row) => void;
}

function FolderShard({
  entry,
  isActive,
  expanded,
  activeSlug,
  focusedId,
  firstFolderSlug,
  openFile,
  openFolder,
  setFocusedId,
  handleKey,
}: FolderShardProps) {
  const { folder, files, hasSiblings } = entry;
  const folderId = folderRowId(folder.slug);
  const isFocused = focusedId === folderId;

  return (
    <div className="mb-2">
      <button
        type="button"
        role="treeitem"
        aria-label={`Open ${folder.displayName}`}
        aria-selected={isActive}
        aria-expanded={hasSiblings ? expanded : undefined}
        title={folder.description}
        tabIndex={isFocused || (focusedId === null && folder.slug === firstFolderSlug) ? 0 : -1}
        data-row-id={folderId}
        onClick={() => openFolder(folder.slug)}
        onFocus={() => setFocusedId(folderId)}
        onKeyDown={(e) => handleKey(e, { folderSlug: folder.slug, id: folderId })}
        className={cn(
          "clip-shard relative w-full border bg-panel p-3 text-left transition-colors",
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

      {hasSiblings && expanded && (
        <div role="group" className="mt-1 pl-[18px]">
          {files.map((file, i) => (
            <FileRow
              key={file.slug}
              file={file}
              folderSlug={folder.slug}
              isLast={i === files.length - 1}
              isActive={file.slug === activeSlug}
              focusedId={focusedId}
              openFile={openFile}
              setFocusedId={setFocusedId}
              handleKey={handleKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileRowProps {
  file: ArchiveFile;
  folderSlug: ArchiveFolderSlug;
  isLast: boolean;
  isActive: boolean;
  focusedId: string | null;
  openFile: (slug: string) => void;
  setFocusedId: (id: string) => void;
  handleKey: (e: KeyboardEvent<HTMLElement>, row: Row) => void;
}

function FileRow({
  file,
  folderSlug,
  isLast,
  isActive,
  focusedId,
  openFile,
  setFocusedId,
  handleKey,
}: FileRowProps) {
  const rowId = fileRowId(folderSlug, file.slug);
  return (
    <button
      type="button"
      role="treeitem"
      aria-selected={isActive}
      aria-label={`Open ${file.title}`}
      title={file.description}
      tabIndex={focusedId === rowId ? 0 : -1}
      data-row-id={rowId}
      onClick={() => openFile(file.slug)}
      onFocus={() => setFocusedId(rowId)}
      onKeyDown={(e) => handleKey(e, { folderSlug, id: rowId, fileSlug: file.slug })}
      className={cn(
        "flex w-full items-center gap-2 py-[3px] pl-1 pr-2 text-left transition-colors",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
        isActive ? "text-info-hot" : "text-muted hover:text-text",
      )}
    >
      <span className="shrink-0 font-mono text-[10px] text-signal/40" aria-hidden>
        {isLast ? "└─" : "├─"}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] tracking-tight">
        {file.filename}
      </span>
      {file.badge && (
        <span className="shrink-0 border border-signal/25 px-1 font-mono text-[7.5px] uppercase tracking-[0.16em] text-signal/70">
          {file.badge}
        </span>
      )}
    </button>
  );
}

function ContactShard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open encrypted contact uplink"
      className={cn(
        "clip-shard group relative mb-2 w-full border border-info/40 p-3 text-left transition-colors hover:border-info/70",
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
