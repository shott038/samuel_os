# Mission: Rebuild archive sectors as real multi-file folders

**Started:** 2026-07-27
**Branch:** claude/sector-folders
**Parent:** main
**Model:** opus

## Goal
Today every "sector" in the archive is really a folder with exactly one overview file. Clicking a shard opens `filesByFolder[slug][0]` — literally whatever happens to be first in a flat array — and a bolted-on `SECTOR_FILES` pill row appears only when a folder happens to have siblings. TortBot already broke that assumption; it works only because it was appended last.

Make folders real. A folder holds an overview file (opens by default) plus any number of additional files. Samuel wants to keep adding files to folders (more case studies under /builds, writings, etc.), so the end state must make "add a file to /builds" a one-object edit in one module that automatically shows up in the rail, the viewer, and the chatbot's context.

This is pure plumbing — do NOT rewrite, reword, or trim any existing archive copy. Every section body, list item, prompt, image and video currently in `data/archive.ts` must survive byte-identical.

## Key files (as landed)
- `data/archive/` — replaces the old flat `data/archive.ts`. `types.ts`, `index.ts` (assembles `ARCHIVE`, exports `getFile`/`getFolder`/`getOverview`/`getFilesInFolder`/`resolvePath`/`filePath`/`fileLabel`/`ARCHIVE_FOLDERS`), plus one module per folder each exporting `{ folder, files }`. `@/data/archive` still resolves via the directory index, so no import churn.
- `lib/archive-nav.ts` — NEW. Shared selectors: `FOLDER_ENTRIES`, `folderEntries(section?)`, `folderEntry`, `siblingsOf`, `recordBadge`, `fileLabel`, `folderGlyph`. Both platforms read from here.
- `lib/archive-context.tsx` — adds `activeFolderSlug` + `openFolder`; hash is now `#/builds/tortbot` with a back-compat reader for `#file-<slug>` that normalizes the URL in place.
- `components/desktop/FileExplorer.tsx` — expandable shards, child rows, full keyboard tree (`Row` gained `fileSlug`). Expansion state is derived during render (no effect) to stay off the `set-state-in-effect` lint rule.
- `components/mobile/FileExplorer.tsx` — `02 RECORDS` chip on multi-file shards; strip layout untouched.
- `components/desktop/FileViewer.tsx` — SECTOR_FILES pill row gone, replaced by the `FileTray` left rail. Modal keys off `"viewer"`, content pane keys off `file.slug`.
- `components/mobile/FileViewer.tsx` — segmented file strip between header and scroll region; same key rework.
- `lib/system-prompt.ts` — `serializeArchive` groups by folder under `## FOLDER` headers; viewer context lists the active folder's siblings. contact_info excluded in both places.
- Untouched: `app/api/chat/route.ts`, `components/desktop/StatusBar.tsx` (both imports still resolve).

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
Status: ready-to-merge

## Verification
- Build: pass (`npm run build`, TypeScript strict, clean)
- Tests: n/a (no test suite in this project) — lint run instead: `npx eslint .` reports 18 errors / 6 warnings, byte-for-byte the same rule+file set as `main`. Zero new lint problems.
- Scope kept: yes, with two judgment calls noted below.
- Summary: sectors are real folders; per-folder data modules, expandable desktop rail, desktop left tray, mobile file strip, and folder-grouped chatbot context all landed with archive copy unchanged.

### Copy integrity
Proven, not assumed: before deleting `data/archive.ts` I diffed the new `ARCHIVE` against the old one field-by-field (ignoring only the new `label`/`badge`/`order`/`overviewSlug` keys) — 11 files and 10 folders identical. `git diff main -- data/` shows only the file-move churn.

### Verified in the browser (agent-browser against `npm run dev`)
Desktop 1600x1000 and mobile via an iPhone UA (platform detection is server-side UA sniffing, not viewport — `lib/platform.ts`):
- Rail shard opens the overview in one click and expands in place: `├─ builds_overview` / `└─ tortbot_case_study` with the CASE STUDY badge.
- Keyboard tree: Down walks rows, Right expands, Down×2 reaches the child, Enter opens it, Left collapses and returns focus to the parent.
- Desktop tray switches files without re-mounting the modal — confirmed by stamping the dialog node and checking identity survives the switch.
- Mobile viewer shows `/BUILDS 02 RECORDS` + OVERVIEW/TORTBOT pills pinned under the header, outside the scroll region.
- `#file-tortbot` and `#file-how-i-think-overview` resolve and rewrite to `#/builds/tortbot` / `#/wiring/how-i-think-overview`. Back button restores the previous file and closes on the no-hash entry.
- Chatbot serialization verified by running `serializeArchive` directly: folders grouped, `/builds` reports 2 records, contact_info absent.

### Judgment calls (flagging, not hiding)
1. **Rail expansion persists after the viewer closes.** The mission says "active folder auto-expands; others collapse". Collapsing on close made the feature invisible — the desktop modal is `inset-x-20` and covers the rail, so the tree could only ever be seen while nothing was covering it. The expanded sector now stays open after Escape. Easy to revert if you want strict collapse.
2. **`folderGlyph` moved into `lib/archive-nav.ts`.** The glyph map was duplicated across both explorers and the new viewer tray needed it too — a fourth copy was worse than one shared lookup. Not JSX, so it doesn't violate "layouts stay separate".

## Final notes
- `@/data/archive` resolves to `data/archive/index.ts`; `data/archive.ts` is deleted. Any branch that edits the old flat file will conflict as a delete/modify — reapply the change to the relevant `data/archive/<folder>.ts` module instead.
- Both FileViewers changed the modal's `key` from `file.slug` to a constant. A branch touching viewer animation needs to keep that or the tray/strip starts replaying the open animation on every file switch.
- `[[OPEN:folder/file]]` chat deep-links stayed out of scope as specified — `resolvePath("builds/tortbot")` is already in place for whoever picks that up.
