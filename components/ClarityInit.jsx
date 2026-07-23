import { useEffect } from "react";
import { initClaritySession } from "../utils/claritySession";
import { useAnalytics } from "../hooks/useAnalytics";

export default function ClarityInit() {
  const { isReady, track } = useAnalytics();

  useEffect(() => {
    // Once Jupiter Analytics is ready, link the sessions. Pass `track` so the
    // Clarity <-> Jupiter session link is stored as a Jupiter event.
    if (isReady) {
      initClaritySession(track);
    }
  }, [isReady, track]);

  return null;
}