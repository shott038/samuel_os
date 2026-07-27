import {
  ARCHIVE_FOLDERS,
  fileLabel,
  getFile,
  getFilesInFolder,
  getFolder,
  type ArchiveFile,
  type ArchiveFolder,
  type ArchiveFolderSlug,
} from "@/data/archive";

export { fileLabel };

/**
 * Selectors shared by the desktop and mobile shells. The JSX genuinely differs
 * between platforms; the navigation logic must not, or the two drift.
 */

export interface FolderEntry {
  folder: ArchiveFolder;
  files: readonly ArchiveFile[];
  /** True once a folder holds more than its overview — drives the expand UI. */
  hasSiblings: boolean;
}

export const FOLDER_ENTRIES: readonly FolderEntry[] = ARCHIVE_FOLDERS.map(({ folder, files }) => ({
  folder,
  files,
  hasSiblings: files.length > 1,
}));

export function folderEntries(section?: ArchiveFolder["section"]): readonly FolderEntry[] {
  return section ? FOLDER_ENTRIES.filter((e) => e.folder.section === section) : FOLDER_ENTRIES;
}

export function folderEntry(slug: string): FolderEntry | null {
  return FOLDER_ENTRIES.find((e) => e.folder.slug === slug) ?? null;
}

/** Which folder an active file slug belongs to. */
export function folderSlugOf(fileSlug: string | null): ArchiveFolderSlug | null {
  if (!fileSlug) return null;
  return getFile(fileSlug)?.folder ?? null;
}

/** Ordered siblings of a file — the tray/strip contents. Empty for unknowns. */
export function siblingsOf(fileSlug: string | null): readonly ArchiveFile[] {
  const folder = folderSlugOf(fileSlug);
  return folder ? getFilesInFolder(folder) : [];
}

export function fileCount(folderSlug: string): number {
  return folderEntry(folderSlug)?.files.length ?? 0;
}

/** `02` — the rail's record badge. */
export function recordBadge(count: number): string {
  return String(count).padStart(2, "0");
}

export function folderDisplayName(folderSlug: string): string {
  return getFolder(folderSlug)?.displayName ?? folderSlug;
}

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

/** Sector sigil for the rail and the viewer tray. */
export function folderGlyph(folderSlug: string): string {
  return FOLDER_GLYPH[folderSlug] ?? "◆";
}
