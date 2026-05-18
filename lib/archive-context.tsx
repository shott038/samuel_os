"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ARCHIVE, getFile, type ArchiveTree } from "@/data/archive";

interface ArchiveContextValue {
  activeSlug: string | null;
  openFile: (slug: string) => void;
  closeFile: () => void;
  archive: ArchiveTree;
  pendingPrompt: string | null;
  submitPrompt: (text: string) => void;
  consumePendingPrompt: () => void;
}

const ArchiveContext = createContext<ArchiveContextValue | null>(null);

const HASH_PREFIX = "#file-";

export function ArchiveProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const openFile = useCallback((slug: string) => {
    if (!getFile(slug)) return;
    setActiveSlug(slug);
    if (typeof window !== "undefined") {
      const next = `${HASH_PREFIX}${slug}`;
      if (window.location.hash !== next) {
        window.history.pushState(null, "", next);
      }
    }
  }, []);

  const closeFile = useCallback(() => {
    setActiveSlug(null);
    if (typeof window !== "undefined" && window.location.hash.startsWith(HASH_PREFIX)) {
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
    const hash = window.location.hash;
    if (hash.startsWith(HASH_PREFIX)) {
      const slug = hash.slice(HASH_PREFIX.length);
      if (getFile(slug)) setActiveSlug(slug);
    }
    const onPop = () => {
      const h = window.location.hash;
      if (h.startsWith(HASH_PREFIX)) {
        const slug = h.slice(HASH_PREFIX.length);
        setActiveSlug(getFile(slug) ? slug : null);
      } else {
        setActiveSlug(null);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <ArchiveContext.Provider
      value={{
        activeSlug,
        openFile,
        closeFile,
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
