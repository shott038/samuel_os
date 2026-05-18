"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useArchive } from "@/lib/archive-context";
import { cn } from "@/lib/utils";
import type { ArchiveFolder, ArchiveFile, ArchiveFolderSlug } from "@/data/archive";

type Row =
  | { kind: "folder"; folderSlug: ArchiveFolderSlug; id: string }
  | { kind: "file"; folderSlug: ArchiveFolderSlug; fileSlug: string; id: string };

export default function FileExplorer() {
  const { archive, activeSlug, openFile } = useArchive();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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

  return (
    <nav
      ref={containerRef}
      aria-label="Archive"
      className="scroll-system h-full overflow-y-auto bg-bg-deep px-3 py-4"
    >
      <div className="mb-4 px-2 font-mono text-sm uppercase tracking-wider text-muted">
        ARCHIVE_SYSTEM
      </div>
      <div role="tree" aria-label="Archive entries" className="flex flex-col">
        {archiveFolders.map((folder) => (
          <FolderRow
            key={folder.slug}
            folder={folder}
            files={filesByFolder[folder.slug] ?? []}
            isOpen={!!expanded[folder.slug]}
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
              <div className="h-px flex-1 bg-muted/20" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                [ LINKS ]
              </span>
              <div className="h-px flex-1 bg-muted/20" />
            </div>
            {linksFolders.map((folder) => (
              <FolderRow
                key={folder.slug}
                folder={folder}
                files={filesByFolder[folder.slug] ?? []}
                isOpen={!!expanded[folder.slug]}
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
  );
}

interface FolderRowProps {
  folder: ArchiveFolder;
  files: readonly ArchiveFile[];
  isOpen: boolean;
  focusedId: string | null;
  firstFolderSlug: ArchiveFolderSlug | undefined;
  activeSlug: string | null;
  toggleFolder: (slug: ArchiveFolderSlug) => void;
  setFocusedId: (id: string) => void;
  handleKey: (e: KeyboardEvent<HTMLElement>, row: Row) => void;
  openFile: (slug: string) => void;
}

function FolderRow({
  folder,
  files,
  isOpen,
  focusedId,
  firstFolderSlug,
  activeSlug,
  toggleFolder,
  setFocusedId,
  handleKey,
  openFile,
}: FolderRowProps) {
  const folderId = `folder:${folder.slug}`;
  const isFocused = focusedId === folderId;

  return (
    <div role="none" className="mb-1">
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
          "group flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left",
          "text-info hover:bg-bg-elev focus:bg-bg-elev",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
        )}
      >
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-150",
            "motion-reduce:transition-none",
            isOpen && "rotate-90",
          )}
        />
        {isOpen ? (
          <FolderOpen className="size-5 shrink-0" />
        ) : (
          <Folder className="size-5 shrink-0" />
        )}
        <span className="flex-1 truncate font-mono text-base">{folder.displayName}</span>
        <span className="font-mono text-xs tabular-nums text-muted">
          {files.length}
        </span>
      </button>

      {isOpen && files.length > 0 && (
        <div role="group" className="mt-0.5">
          {files.map((file) => {
            const fileId = `file:${file.slug}`;
            const isActive = file.slug === activeSlug;
            const fileFocused = focusedId === fileId;
            return (
              <button
                key={file.slug}
                type="button"
                role="treeitem"
                aria-selected={isActive}
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
                  "flex w-full items-center gap-2 rounded-sm py-1.5 pl-9 pr-2 text-left transition-colors",
                  "motion-reduce:transition-none",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-signal/60",
                  isActive
                    ? "border-l-2 border-signal bg-bg-elev pl-[calc(2.25rem-2px)] text-signal"
                    : "border-l-2 border-transparent text-muted hover:bg-bg-elev hover:text-text flicker-on-hover",
                )}
              >
                <FileText
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-signal" : "text-muted",
                  )}
                />
                <span className="truncate font-mono text-sm">{file.filename}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
