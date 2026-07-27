export type ArchiveSection =
  | { kind: "text"; body: string }
  | { kind: "list"; heading?: string; items: string[] }
  | { kind: "project"; title: string; subtitle: string; body: string; tags?: string[] }
  | { kind: "person"; name: string; role: string; contact: string; address?: string }
  | { kind: "timeline"; entries: Array<{ year: string; label: string; detail?: string }> }
  | { kind: "stat_row"; stats: Array<{ label: string; value: string }> }
  | { kind: "contact_block"; email: string; phone: string; location: string }
  | { kind: "image"; src: string; alt: string; caption?: string; filename?: string; aspect?: "portrait" | "landscape" | "square"; align?: "left" | "right" | "center"; size?: "xs" | "sm" | "md" | "lg" }
  | { kind: "image_gallery"; heading?: string; size?: "sm" | "md" | "lg"; columns?: 2 | 3 | 4; images: Array<{ src: string; alt: string; filename?: string; caption?: string; aspect?: "portrait" | "landscape" | "square" }> }
  | { kind: "video"; src: string; poster?: string; caption?: string; filename?: string; size?: "sm" | "md" | "lg" | "full" };

export type ArchiveFolderSlug =
  | "wiring"
  | "builds"
  | "ai_agents"
  | "finance"
  | "academics"
  | "baseball"
  | "faith_roots"
  | "hobbies"
  | "references"
  | "contact_info";

export interface ArchiveFolder {
  slug: ArchiveFolderSlug;
  displayName: string;
  description: string;
  section: "archive" | "links";
  /**
   * Slug of the file that opens when the folder itself is opened. Explicit so
   * nothing depends on array order.
   */
  overviewSlug: string;
}

export interface ArchiveFile {
  slug: string;
  filename: string;
  title: string;
  description: string;
  folder: ArchiveFolderSlug;
  sections: ArchiveSection[];
  suggestedPrompts?: string[];
  /** Short tray/tab label, e.g. "TORTBOT". Falls back to the filename. */
  label?: string;
  /** Optional tray tag, e.g. "CASE STUDY". */
  badge?: string;
  /** Sort weight within the folder. The overview is always pinned first. */
  order?: number;
}

/**
 * A folder plus everything it holds. One of these per module in `data/archive/`
 * — adding a file to a sector is a one-object edit in one place.
 */
export interface ArchiveFolderModule {
  folder: ArchiveFolder;
  files: ArchiveFile[];
}

export interface ArchiveTree {
  folders: readonly ArchiveFolder[];
  files: readonly ArchiveFile[];
}
