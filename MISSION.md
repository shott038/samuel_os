# Mission: Rebuild archive sectors as real multi-file folders

**Started:** 2026-07-27
**Branch:** claude/sector-folders
**Parent:** main
**Model:** opus

## Goal
Today every "sector" in the archive is really a folder with exactly one overview file. Clicking a shard opens `filesByFolder[slug][0]` — literally whatever happens to be first in a flat array — and a bolted-on `SECTOR_FILES` pill row appears only when a folder happens to have siblings. TortBot already broke that assumption; it works only because it was appended last.

Make folders real. A folder holds an overview file (opens by default) plus any number of additional files. Samuel wants to keep adding files to folders (more case studies under /builds, writings, etc.), so the end state must make "add a file to /builds" a one-object edit in one module that automatically shows up in the rail, the viewer, and the chatbot's context.

This is pure plumbing — do NOT rewrite, reword, or trim any existing archive copy. Every section body, list item, prompt, image and video currently in `data/archive.ts` must survive byte-identical.

## Key files
- `data/archive.ts` (696 lines) — the flat `FOLDERS` + `FILES` arrays, `ARCHIVE`, `getFile`, `getFilesInFolder`
- `lib/archive-context.tsx` — `activeSlug`, `openFile`, `#file-<slug>` hash routing, popstate handling
- `components/desktop/FileExplorer.tsx` — shard rail, `openFolder` takes `[0]`, `Row` type + keyboard tree nav
- `components/mobile/FileExplorer.tsx` — horizontal shard strip, same `[0]` assumption
- `components/desktop/FileViewer.tsx` — modal, `siblings.length > 1` SECTOR_FILES pill row (lines ~272-400), `SectionBlock` renderer
- `components/mobile/FileViewer.tsx` — same, mobile modal
- `lib/system-prompt.ts` — `serializeArchive` iterates `archive.files` flat; `buildSystemPrompt` takes activeFile{Title,Slug,Folder}
- `app/api/chat/route.ts` — imports `ARCHIVE`, `getFile`
- `components/desktop/StatusBar.tsx` — `SHARD_COUNT = ARCHIVE.folders.length`

Desktop and mobile components are fully duplicated with zero shared code — every UI change is two files.

## Phases

### 1. Data layer — folders become containers
Split `data/archive.ts` into a `data/archive/` directory, one module per folder:
```
data/archive/
  types.ts     ArchiveSection / ArchiveFolder / ArchiveFile / ArchiveTree
  index.ts     assembles ARCHIVE in display order, exports helpers
  wiring.ts    builds.ts  ai-agents.ts  finance.ts  academics.ts
  baseball.ts  faith-roots.ts  hobbies.ts  references.ts  contact-info.ts
```
Each folder module exports `{ folder, files }` so folder metadata sits next to its contents.

Schema additions:
- `ArchiveFolder.overviewSlug: string` — explicit, kills the index-0 guess
- `ArchiveFile.order?: number` — sort within folder; the overview is always pinned first regardless
- `ArchiveFile.label?: string` — short tray/tab label (e.g. `TORTBOT`) distinct from `filename` (`tortbot_case_study`)
- `ArchiveFile.badge?: string` — optional tray tag ("CASE STUDY")

Helpers in `index.ts`: `getFolder(slug)`, `getOverview(folderSlug)`, `getFilesInFolder(folderSlug)` (ordered, overview first), `resolvePath("builds/tortbot")`. Keep `ARCHIVE`, `getFile`, `getFilesInFolder` exported with today's signatures, and keep `@/data/archive` resolving (directory index) so existing imports don't churn.

Give TortBot `label: "TORTBOT"` and `badge: "CASE STUDY"`; every overview file gets label `"OVERVIEW"`.

### 2. Navigation state — `lib/archive-context.tsx`
- Expose `activeFolderSlug` (derived from activeSlug) and `openFolder(slug)` → opens that folder's `overviewSlug`
- Hash becomes folder-aware: `#/builds/tortbot`. Keep a back-compat reader so old `#file-<slug>` links still resolve (read them, then normalize the URL).
- Leave pendingPrompt / contact behavior untouched.

### 3. Desktop rail — expandable shards (`components/desktop/FileExplorer.tsx`)
- Clicking a shard still opens the overview immediately — do not lose the one-click feel.
- Folders with more than one file ALSO expand in place, showing indented child rows beneath the shard in terminal style (`├─ builds_overview`, `└─ tortbot_case_study`). Active folder auto-expands; others collapse.
- Finish the keyboard tree: up/down walk visible rows including children, Right expands, Left collapses, Enter opens. The `Row` type already anticipates this — extend it with an optional `fileSlug`.
- The `02` count badge now means something; keep it.

### 4. Desktop viewer — left file tray (`components/desktop/FileViewer.tsx`)
Remove the `SECTOR_FILES` pill row. Replace with a persistent ~200px left tray inside the modal: folder glyph + `/builds` + record count at the top, folder description at the bottom, file list in between with the overview pinned first and the active file marked. Content pane sits to the right.
Switching files must swap ONLY the content pane (keep the existing content fade; do not re-mount or re-animate the whole modal — today the modal keys off `file.slug`, so rework the keys).
Tray, not tabs — tabs die past ~4 files and more files are coming.

### 5. Mobile (`components/mobile/FileExplorer.tsx`, `components/mobile/FileViewer.tsx`)
- Rail: horizontal shard strip stays as-is (no inline expansion — it would fight the swipe). Multi-file folders show a `02 RECORDS` chip instead of the bare count.
- Viewer: the tray becomes a horizontally scrollable segmented file strip pinned directly under the modal header, ABOVE the scroll region so it stays visible while reading. Overview first, active pill highlighted. Tap targets >= 44px tall.

### 6. Chatbot awareness (`lib/system-prompt.ts`)
`serializeArchive` groups output by folder so the model knows which files live where:
```
## FOLDER /builds — What I've shipped (2 records)
=== /builds/builds_overview ===
...
=== /builds/tortbot_case_study ===
```
Keep the contact_info exclusion exactly as it is. Extend viewer context to include the active folder and its sibling file list so the bot can point at a specific file. Do NOT touch the guardrails or voice sections of SYSTEM_PROMPT.

### 7. Shared selectors
Add a thin `lib/archive-nav.ts` holding the selectors both platforms need (ordered files for a folder, active folder resolution, sibling list, file counts) so desktop and mobile cannot drift. JSX stays separate — the layouts genuinely differ.

## Verify with
- `npm run build` — TypeScript is strict; it must pass clean with zero new warnings.
- `npx eslint .` if the build does not already cover lint.
- Visual check with the `agent-browser` CLI (global npm) against `npm run dev`:
  `agent-browser open http://localhost:3000 && agent-browser screenshot shot.png`, then Read the png.
  Check BOTH a desktop viewport and a ~390x844 mobile viewport. Verify: rail shard opens the overview; /builds expands to show both files; the desktop tray switches files without re-animating the modal; the mobile file strip is reachable and readable; an old `#file-tortbot` URL still resolves.
- Confirm no archive copy changed: `git diff main -- data/ | grep '^-'` should show only structural/type lines, never prose.

## Out of scope
- Any change to archive copy, images, video, or the TortBot case study text.
- New content or new folders — Samuel adds those himself after this lands.
- The `[[OPEN:folder/file]]` chat deep-link marker — explicitly deferred.
- Contact terminal / breach flow, boot sequence, HoloCore, StatusBar visuals (a `SHARD_COUNT` fix is fine if the export moves).
- Pushing, rebasing, or opening a PR — the operator handles landing.

## Status
Status: in-progress
