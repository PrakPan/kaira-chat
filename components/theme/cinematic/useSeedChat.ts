// components/theme/cinematic/useSeedChat.ts
//
// Hands a prompt off to a fresh /chat session. Mirrors the homepage hero and
// GetInspiredSection handoff: the prompt is stashed via setPendingSeed (module
// memory + sessionStorage, survives the route change and a hard reload of
// /chat) and also passed as `?seed=` so a cold /chat load can still pick it up.
//
// A theme page may also pass the items the reader saved and a `slug` naming the
// theme. The /chatkit request body has no structured `items` field — it is the
// same shape every other chat surface sends — so the saved picks are folded
// into the seed TEXT here (see selectionText). The meta still rides along via
// setPendingSeedMeta, but only for in-app use: the mini-form's chips, the
// widget theme, and the mobile close button's way back to the theme page.

import { useCallback } from "react";
import { useRouter } from "next/router";
import {
  setPendingSeed,
  setPendingSeedMeta,
} from "../../../services/heroChatHandoff";
import type { CinematicSelectableItem } from "./types";
import { composeSelectionText } from "./selectionText";

export interface SeedChatMeta {
  items?: CinematicSelectableItem[];
  slug?: string;
}

export function useSeedChat() {
  const router = useRouter();

  return useCallback(
    (prompt: string, meta?: SeedChatMeta) => {
      // The saved picks are appended to the prompt itself — the request body
      // carries no `items`, so the text is the only place they survive.
      const selection = composeSelectionText(meta?.items);
      const base = (prompt || "").trim();
      const seed = selection ? `${base}\n\n${selection}`.trim() : base;
      if (seed) setPendingSeed(seed);
      // Always write (setPendingSeedMeta clears itself when empty) so a plain
      // seed after a themed one never inherits a stale selection.
      setPendingSeedMeta({ items: meta?.items ?? [], slug: meta?.slug ?? "" });
      router.push(seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat");
    },
    [router],
  );
}

// "Build this itinerary" — opens the themed mini-form on /chat rather than
// seeding an auto-sent prompt. The saved items + slug ride along via
// setPendingSeedMeta; /chat resolves the form by slug (?themeForm=) and injects
// it. Nothing fires to /chatkit until the reader submits the form.
//
// `note` is free text the reader typed into the docked ask-bar before hitting
// build. It travels with the handoff and is folded into the form's submission
// so the request carries it rather than dropping it at the route change.
export function useOpenThemeForm() {
  const router = useRouter();

  return useCallback(
    (slug: string, items?: CinematicSelectableItem[], note?: string) => {
      setPendingSeedMeta({
        items: items ?? [],
        slug: slug || "",
        note: note ?? "",
      });
      router.push(`/chat?themeForm=${encodeURIComponent(slug)}`);
    },
    [router],
  );
}
