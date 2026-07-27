// components/theme/cinematic/useSeedChat.ts
//
// Hands a prompt off to a fresh /chat session. Mirrors the homepage hero and
// GetInspiredSection handoff: the prompt is stashed via setPendingSeed (module
// memory + sessionStorage, survives the route change and a hard reload of
// /chat) and also passed as `?seed=` so a cold /chat load can still pick it up.

import { useCallback } from "react";
import { useRouter } from "next/router";
import { setPendingSeed } from "../../../services/heroChatHandoff";

export function useSeedChat() {
  const router = useRouter();

  return useCallback(
    (prompt: string) => {
      const seed = (prompt || "").trim();
      if (seed) setPendingSeed(seed);
      router.push(seed ? `/chat?seed=${encodeURIComponent(seed)}` : "/chat");
    },
    [router],
  );
}
