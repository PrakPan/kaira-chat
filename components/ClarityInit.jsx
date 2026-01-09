// components/ClarityInit.jsx

import { useEffect } from "react";
import { initClaritySession, getJupiterSessionId } from "../utils/claritySession";
import { useAnalytics } from "../hooks/useAnalytics";

export default function ClarityInit() {
  const { isReady } = useAnalytics();

  useEffect(() => {
    // Only initialize Clarity once Jupiter Analytics is ready
    if (isReady) {
      initClaritySession();    
    }
  }, [isReady]);

  return null;
}