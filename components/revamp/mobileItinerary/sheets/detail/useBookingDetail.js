import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
//  One fetch, one state machine, for every detail body in the sheet.
//
//  The desktop drawers each grew their own copy of this — a `loading` flag, a
//  `data` slot, an `error` string and a try/catch that sets all three — and
//  each got it slightly wrong somewhere (a `finally` that clears loading after
//  an unmount, an error that leaves the previous booking's data on screen).
//  The sheet asks for one booking at a time, so it needs exactly one of these.
//
//  `url` doubles as the identity of the request: when it changes the hook
//  re-fetches, and a reply that arrives for a URL that is no longer the current
//  one is dropped rather than painted under the wrong header.
// ─────────────────────────────────────────────────────────────────────────────

export default function useBookingDetail(url, { pick } = {}) {
  const [state, setState] = useState({
    loading: !!url,
    data: null,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);
  const liveRef = useRef(null);
  const pickRef = useRef(pick);
  pickRef.current = pick;

  useEffect(() => {
    if (!url) {
      setState({ loading: false, data: null, error: null });
      return undefined;
    }

    liveRef.current = url;
    setState({ loading: true, data: null, error: null });

    let cancelled = false;
    axios
      .get(url, {
        headers: (() => {
          // The itinerary endpoints read the booking without a token; sending
          // one when it exists is what the desktop drawers do, and it is what
          // returns the traveller's own rates rather than the public ones.
          const token =
            typeof window !== "undefined"
              ? window.localStorage?.getItem("access_token")
              : null;
          return token ? { Authorization: `Bearer ${token}` } : undefined;
        })(),
      })
      .then((res) => {
        if (cancelled || liveRef.current !== url) return;
        const picked = pickRef.current ? pickRef.current(res?.data) : res?.data;
        setState({ loading: false, data: picked ?? null, error: null });
      })
      .catch((err) => {
        if (cancelled || liveRef.current !== url) return;
        setState({
          loading: false,
          data: null,
          error:
            err?.response?.data?.errors?.[0]?.message?.[0] ||
            err?.message ||
            "Something went wrong",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}
