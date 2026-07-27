import { wiring } from "./wiring";
import { builds } from "./builds";
import { aiAgents } from "./ai-agents";
import { finance } from "./finance";
import { academics } from "./academics";
import { baseball } from "./baseball";
import { faithRoots } from "./faith-roots";
import { hobbies } from "./hobbies";
import { references } from "./references";
import { contactInfo } from "./contact-info";

import type {
  ArchiveFile,
  ArchiveFolder,
  ArchiveFolderModule,
  ArchiveFolderSlug,
  ArchiveTree,
} from "./types";

export type {
  ArchiveSection,
  ArchiveFolderSlug,
  ArchiveFolder,
  ArchiveFile,
  ArchiveFolderModule,
  ArchiveTree,
} from "./types";

/**
 * Display order of the sectors in the rail. Adding a folder means adding a
 * module above and dropping it into this list — nothing else.
 */
const MODULES: readonly ArchiveFolderModule[] = [
  wiring,
  builds,
  aiAgents,
  finance,
  academics,
  baseball,
  faithRoots,
  hobbies,
  references,
  contactInfo,
];

/** Overview pinned first, then `order` (unset sorts last), then source order. */
function orderFiles(module: ArchiveFolderModule): ArchiveFile[] {
  const overviewSlug = module.folder.overviewSlug;
  return module.files
    .map((file, index) => ({ file, index }))
    .sort((a, b) => {
      const aOverview = a.file.slug === overviewSlug;
      const bOverview = b.file.slug === overviewSlug;
      if (aOverview !== bOverview) return aOverview ? -1 : 1;
      const aOrder = a.file.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.file.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.index - b.index;
    })
    .map((entry) => entry.file);
}

const FILES_BY_FOLDER = new Map<ArchiveFolderSlug, readonly ArchiveFile[]>(
  MODULES.map((m) => [m.folder.slug, orderFiles(m)] as const),
);

const FOLDERS: readonly ArchiveFolder[] = MODULES.map((m) => m.folder);

const FILES: readonly ArchiveFile[] = MODULES.flatMap((m) => FILES_BY_FOLDER.get(m.folder.slug) ?? []);

export const ARCHIVE: ArchiveTree = { folders: FOLDERS, files: FILES };

/** Every folder paired with its ordered contents, in display order. */
export const ARCHIVE_FOLDERS: ReadonlyArray<{
  folder: ArchiveFolder;
  files: readonly ArchiveFile[];
}> = MODULES.map((m) => ({ folder: m.folder, files: FILES_BY_FOLDER.get(m.folder.slug) ?? [] }));

export function getFile(slug: string): ArchiveFile | null {
  return FILES.find((f) => f.slug === slug) ?? null;
}

export function getFolder(slug: string): ArchiveFolder | null {
  return FOLDERS.find((f) => f.slug === slug) ?? null;
}

/** Ordered contents of a folder — overview always first. */
export function getFilesInFolder(folder: ArchiveFolderSlug): readonly ArchiveFile[] {
  return FILES_BY_FOLDER.get(folder) ?? [];
}

export function getOverview(folderSlug: string): ArchiveFile | null {
  const folder = getFolder(folderSlug);
  if (!folder) return null;
  return getFile(folder.overviewSlug) ?? getFilesInFolder(folder.slug)[0] ?? null;
}

/** The folder a file lives in, or null for an unknown slug. */
export function getFolderOfFile(fileSlug: string): ArchiveFolder | null {
  const file = getFile(fileSlug);
  return file ? getFolder(file.folder) : null;
}

/** Short label for a tray/tab row. */
export function fileLabel(file: ArchiveFile): string {
  return file.label ?? file.filename;
}

/**
 * Resolve a `folder/file` path (either form of the file segment: slug or
 * filename). A bare `folder` resolves to that folder's overview.
 */
export function resolvePath(path: string): ArchiveFile | null {
  const [folderSegment, fileSegment] = path.replace(/^\/+|\/+$/g, "").split("/");
  if (!folderSegment) return null;
  const folder = getFolder(folderSegment);
  if (!folder) return null;
  if (!fileSegment) return getOverview(folder.slug);
  const files = getFilesInFolder(folder.slug);
  return (
    files.find((f) => f.slug === fileSegment) ??
    files.find((f) => f.filename === fileSegment) ??
    null
  );
}

/** Canonical `folder/file` path for a file — the hash route's payload. */
export function filePath(file: ArchiveFile): string {
  return `${file.folder}/${file.slug}`;
}
