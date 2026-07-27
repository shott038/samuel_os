"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ARCHIVE,
  filePath,
  getFile,
  getOverview,
  resolvePath,
  type ArchiveFolderSlug,
  type ArchiveTree,
} from "@/data/archive";

interface ArchiveContextValue {
  activeSlug: string | null;
  activeFolderSlug: ArchiveFolderSlug | null;
  openFile: (slug: string) => void;
  openFolder: (slug: string) => void;
  closeFile: () => void;
  contactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
  archive: ArchiveTree;
  pendingPrompt: string | null;
  submitPrompt: (text: string) => void;
  consumePendingPrompt: () => void;
}

const ArchiveContext = createContext<ArchiveContextValue | null>(null);

/** Current form: `#/builds/tortbot`. */
const HASH_PREFIX = "#/";
/** Pre-folder form, still honored so old links resolve. */
const LEGACY_HASH_PREFIX = "#file-";

/** Read either hash form and return the file slug it points at. */
function slugFromHash(hash: string): string | null {
  if (hash.startsWith(LEGACY_HASH_PREFIX)) {
    const slug = hash.slice(LEGACY_HASH_PREFIX.length);
    return getFile(slug) ? slug : null;
  }
  if (hash.startsWith(HASH_PREFIX)) {
    return resolvePath(hash.slice(HASH_PREFIX.length))?.slug ?? null;
  }
  return null;
}

function hashForSlug(slug: string): string | null {
  const file = getFile(slug);
  return file ? `${HASH_PREFIX}${filePath(file)}` : null;
}

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const activeFolderSlug = useMemo(
    () => (activeSlug ? getFile(activeSlug)?.folder ?? null : null),
    [activeSlug],
  );

  const openFile = useCallback((slug: string) => {
    const next = hashForSlug(slug);
    if (!next) return;
    setActiveSlug(slug);
    if (typeof window !== "undefined" && window.location.hash !== next) {
      window.history.pushState(null, "", next);
    }
  }, []);

  /** Opening a folder means opening its overview — one click, no expand step. */
  const openFolder = useCallback(
    (slug: string) => {
      const overview = getOverview(slug);
      if (overview) openFile(overview.slug);
    },
    [openFile],
  );

  const closeFile = useCallback(() => {
    setActiveSlug(null);
    if (
      typeof window !== "undefined" &&
      (window.location.hash.startsWith(HASH_PREFIX) ||
        window.location.hash.startsWith(LEGACY_HASH_PREFIX))
    ) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const submitPrompt = useCallback((text: string) => {
    setPendingPrompt(text);
  }, []);

  const consumePendingPrompt = useCallback(() => {
    setPendingPrompt(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initial = slugFromHash(window.location.hash);
    if (initial) {
      setActiveSlug(initial);
      // Normalize a legacy `#file-<slug>` link to the folder-aware form.
      const canonical = hashForSlug(initial);
      if (canonical && window.location.hash !== canonical) {
        window.history.replaceState(null, "", canonical);
      }
    }
    const onPop = () => {
      setActiveSlug(slugFromHash(window.location.hash));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <ArchiveContext.Provider
      value={{
        activeSlug,
        activeFolderSlug,
        openFile,
        openFolder,
        closeFile,
        contactOpen,
        openContact,
        closeContact,
        archive: ARCHIVE,
        pendingPrompt,
        submitPrompt,
        consumePendingPrompt,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive(): ArchiveContextValue {
  const ctx = useContext(ArchiveContext);
  if (!ctx) throw new Error("useArchive must be used within <ArchiveProvider>");
  return ctx;
}
