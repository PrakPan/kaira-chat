import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { RxCross2 } from "react-icons/rx";

import useMediaQuery from "../../media";
import OtpCard from "./IntakeForm/OtpCard";

type BotLoginModalProps = {
  show: boolean;
  onhide: () => void;
  onSuccess?: () => void | Promise<void>;
  message?: string;
  /** Overrides the sign-in card's big title (e.g. "Sign In to modify this
   *  route"). Falls back to OtpCard's default "Sign In to Continue". */
  title?: string;
  itinary_id?: any;
  isTailored?: boolean;
  onSkipLogin?: () => void;
  zIndex?: number | string;
  hideloginclose?: boolean;
};

const SHEET_ANIM_MS = 280;

// ── Fallback for browsers that never report the on-screen keyboard ──
// In-app browsers (Instagram / Facebook / … on Android) host the page in a
// WebView the IME never resizes: when the keyboard opens neither
// `window.innerHeight` nor `visualViewport` moves, so a bottom-anchored sheet
// keeps sitting *behind* the keyboard with its input out of reach. There is no
// API left to measure with, so we assume a keyboard height instead. Biased a
// little generous on purpose — guessing high leaves a strip of backdrop under
// the sheet, guessing low puts the input back under the keyboard.
const ASSUMED_KEYBOARD_RATIO = 0.45;
// Never squeeze the sheet below this, whatever a keyboard measurement claims —
// past it the card is unusable and it's better to let it sit under the keyboard
// and scroll.
const MIN_SHEET_ROOM = 240;
const ASSUMED_KEYBOARD_MIN = 260;
const ASSUMED_KEYBOARD_MAX = 460;

/** Touch device, i.e. one that actually raises an on-screen keyboard on focus.
 *  Keeps the fallback away from a narrow desktop window, where nothing moving is
 *  the correct outcome. `pointer: coarse` is the honest answer, but a handful of
 *  in-app WebViews report `fine` (they inherit a desktop-ish pointer from their
 *  host app), and being wrong there costs us the whole fallback — so a touch
 *  digitiser counts too. This only ever runs on the phone bottom-sheet branch,
 *  so a touchscreen laptop would have to be under 768px wide to reach it. */
const hasSoftKeyboard = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(pointer: coarse)").matches) return true;
  if (window.matchMedia?.("(any-pointer: coarse)").matches) return true;
  return typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
};

/** Chromium's VirtualKeyboard API, when the browser has it. This is the only
 *  API that reports the keyboard's rectangle outright instead of leaving us to
 *  infer it from a viewport that moved — and since every Android in-app browser
 *  is a Chromium WebView, it covers exactly the population the inference-based
 *  paths get wrong. Absent on iOS (WKWebView), which doesn't need it: there the
 *  visual viewport is reported correctly. */
const getVirtualKeyboard = (): any =>
  typeof navigator !== "undefined" ? (navigator as any).virtualKeyboard : null;

/** Known app-embedded webviews. Only used to shorten the wait before we give up
 *  on a real measurement — the fallback itself is driven by the probe below, so
 *  an unrecognised in-app browser still gets rescued, just a beat later. */
const isEmbeddedBrowser = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (!/Android/i.test(ua)) return false;
  return (
    /Instagram|FBAN|FBAV|FB_IAB|FB4A|Line\/|Snapchat|MicroMessenger|GSA\//i.test(
      ua,
    ) || /;\s*wv\)/i.test(ua)
  );
};

/** `?kbdebug=1` switches on the on-device readout below — in-app browsers can't
 *  be attached to devtools, so the only way to see which of the geometry paths
 *  a given WebView actually lands in is to draw it on the page.
 *
 *  `?kbdebug=1&novk=1` additionally skips the VirtualKeyboard opt-in. On any
 *  modern Android WebView that API answers first and the inference tiers below
 *  it never run, so this is how you get to see what one of them *would* have
 *  done. Diagnostic only — never a path real traffic takes. */
const useKbDebug = () => {
  const [flags, setFlags] = useState({ on: false, noVk: false });
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const q = new URLSearchParams(window.location.search);
      setFlags({ on: q.get("kbdebug") === "1", noVk: q.get("novk") === "1" });
    } catch {
      /* malformed query string — leave it off */
    }
  }, []);
  return flags;
};

type KbDiag = {
  tier: string;
  base: number;
  baseVisual: number;
  h: number;
  vh: number;
  offsetTop: number | null;
  inset: number;
  windowShrink: number;
  vkHeight: number;
  lift: number;
  room: number;
  measured: boolean;
  focused: boolean;
};

/**
 * Live geometry readout for the keyboard paths. Its reason for existing is the
 * one line it prints last: whether a `position: fixed` layer pinned to
 * `bottom: 0` actually followed the window when the browser resized it.
 *
 * That is the whole question behind tier 4. If the layer follows, `bottom: 0`
 * is already above the keyboard and lifting would shove the sheet into empty
 * space. If it stays put, the resize is a keyboard height nobody applied, and
 * lifting by it is the only thing that rescues the field.
 */
const KeyboardDebugOverlay: React.FC<{
  diagRef: React.MutableRefObject<KbDiag | null>;
  layerRef: React.RefObject<HTMLDivElement>;
  zIndex: number;
}> = ({ diagRef, layerRef, zIndex }) => {
  const [, tick] = useState(0);
  useEffect(() => {
    let raf = 0;
    // Sampled on a frame loop rather than off events, on purpose: "this browser
    // fires no events" is precisely the failure being diagnosed, so an
    // event-driven readout would go blank exactly when it matters most.
    const loop = () => {
      tick((n) => (n + 1) % 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const d = diagRef.current;
  if (typeof window === "undefined") return null;
  const vv = window.visualViewport;
  const h = window.innerHeight;
  const rect = layerRef.current?.getBoundingClientRect();
  // The layer is `bottom: 0` shifted up by `lift`, so adding the lift back
  // gives where its containing block — the fixed viewport — actually ends.
  const fixedBottom =
    rect && d ? Math.round(rect.bottom + d.lift) : rect ? Math.round(rect.bottom) : null;

  let verdict = "focus the phone field to test";
  if (d && d.windowShrink > 80 && fixedBottom != null) {
    verdict =
      Math.abs(fixedBottom - h) <= 4
        ? "FOLLOWS window — tier 4 must NOT lift"
        : "STUCK at rest height — tier 4 lift is correct";
  } else if (d && d.vkHeight > 80) {
    verdict = "VirtualKeyboard API answered — tier 4 unused";
  } else if (d && d.inset > 80) {
    verdict = "visualViewport answered — tier 4 unused";
  }

  const rows: [string, string | number][] = [
    ["tier", d?.tier ?? "—"],
    ["innerHeight h / base", `${h} / ${d?.base ?? "—"}`],
    ["vv.height / baseVisual", `${vv ? Math.round(vv.height) : "n/a"} / ${d?.baseVisual ?? "—"}`],
    ["vv.offsetTop", d?.offsetTop ?? "n/a"],
    ["inset / windowShrink", `${d?.inset ?? "—"} / ${d?.windowShrink ?? "—"}`],
    ["vkHeight", d?.vkHeight ?? "—"],
    ["lift / room", `${d?.lift ?? "—"} / ${d?.room ?? "—"}`],
    ["measured / focused", `${d?.measured ?? "—"} / ${d?.focused ?? "—"}`],
    ["fixed viewport bottom", fixedBottom ?? "—"],
    ["pointer coarse", String(!!window.matchMedia?.("(pointer: coarse)").matches)],
    ["maxTouchPoints", navigator.maxTouchPoints],
    ["virtualKeyboard", getVirtualKeyboard() ? "yes" : "no"],
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex,
        pointerEvents: "none",
        background: "rgba(0,0,0,0.82)",
        color: "#7CFFB2",
        font: "10px/1.45 ui-monospace, Menlo, monospace",
        padding: "6px 8px",
        maxWidth: "100%",
        whiteSpace: "pre",
      }}
    >
      {rows.map(([k, v]) => `${k.padEnd(23)} ${v}\n`).join("")}
      <span style={{ color: "#FFE600" }}>{`verdict${" ".repeat(17)} ${verdict}`}</span>
      <span style={{ color: "#8FA3BF", display: "block", marginTop: 2 }}>
        {(navigator.userAgent || "").slice(0, 96)}
      </span>
    </div>
  );
};

/**
 * Login popup shell. Renders the shared {@link OtpCard} sign-in flow (phone →
 * WhatsApp/SMS OTP → new-user details) inside a lightbox on wide screens and a
 * drag-to-close bottom sheet on phones. All auth logic lives in OtpCard (it
 * talks to the `auth`/`getotp` thunks directly); this component only owns the
 * chrome, the open/close transition, and the mobile keyboard handling.
 */
const BotLoginModal: React.FC<BotLoginModalProps> = (props) => {
  const isPageWide = useMediaQuery("(min-width: 768px)");
  const [layoutReady, setLayoutReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") setLayoutReady(true);
  }, []);

  // Entrance / exit transition. `entered` flips on the frame after mount so the
  // sheet slides up from translateY(100%); `closing` plays the reverse before
  // the parent unmounts us (we hold the node for SHEET_ANIM_MS so the slide-down
  // is visible instead of a hard cut).
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);

  const [keyboardInset, setKeyboardInset] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  // Screen height with no keyboard up — the yardstick for the assumed-keyboard
  // fallback, and what we subtract it from to cap the sheet.
  const [baseHeight, setBaseHeight] = useState<number | null>(null);
  // Flipped on when a field inside the sheet has focus (so a keyboard is up)
  // but nothing ever reported it. See `isEmbeddedBrowser`.
  const [keyboardOverlay, setKeyboardOverlay] = useState(false);
  // Whether the current lift arrived as one discrete jump (a single resize
  // event, or our own guess) rather than as a stream we should track frame for
  // frame. Only decides whether the lift animates — see the layer's `style`.
  const [liftEased, setLiftEased] = useState(false);
  const focusedRef = useRef(false);
  // Last keyboard height from the VirtualKeyboard API, 0 when it's closed or
  // the browser doesn't have the API.
  const vkHeightRef = useRef(0);
  // True once we've seen a real keyboard signal — stops the probe from guessing
  // over a measurement that's simply still on its way.
  const measuredRef = useRef(false);
  const probeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateRef = useRef<(() => void) | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  // `?kbdebug=1` only — see KeyboardDebugOverlay.
  const { on: kbDebug, noVk: kbDebugNoVk } = useKbDebug();
  const liftLayerRef = useRef<HTMLDivElement>(null);
  const diagRef = useRef<KbDiag | null>(null);

  // Drag-to-close for the mobile bottom sheet
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStartY = useRef<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play the slide-up on open, and reset the transition flags so a modal that's
  // hidden and later reshown animates in again.
  useEffect(() => {
    if (!props.show) {
      setEntered(false);
      setClosing(false);
      return;
    }
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [props.show]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const clearProbe = useCallback(() => {
    if (probeTimer.current) clearTimeout(probeTimer.current);
    probeTimer.current = null;
  }, []);

  // Track the on-screen keyboard so the mobile bottom sheet stays above it.
  useEffect(() => {
    if (!props.show || typeof window === "undefined") return;
    const vv = window.visualViewport;
    const visualHeight = () => (vv ? vv.height : window.innerHeight);
    const rawInset = () =>
      vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
    let base = window.innerHeight;
    let baseInset = rawInset();
    let baseVisual = visualHeight();

    const update = () => {
      const h = window.innerHeight;
      const vh = visualHeight();
      // Nothing focused ⇒ no keyboard ⇒ whatever we measure now is the
      // keyboard-free resting state (this also re-syncs after a rotate or after
      // the browser chrome collapses).
      if (!focusedRef.current) {
        base = h;
        baseInset = rawInset();
        baseVisual = vh;
      }
      // Only the *change* since that resting state can be a keyboard. Several
      // in-app browsers report a permanent gap between `innerHeight` and the
      // visual viewport (their own chrome), and reading that as a keyboard both
      // shifts the sheet at rest and — much worse — convinces us we have a
      // working measurement when we have nothing, which is what kept the
      // fallback below from ever engaging.
      const inset = Math.max(0, rawInset() - baseInset);
      const windowShrink = Math.max(0, base - h);
      const vkHeight = vkHeightRef.current;

      // ── The four shapes a browser can present, in order of trust ──
      // Whatever the shape, it has to come out the other side as the same two
      // numbers: how far to lift the sheet off `bottom: 0`, and how much room
      // it has left. `room` is what gives the card body overflow to scroll —
      // without it a short sheet simply runs off under the keyboard with
      // nothing to scroll to, which is half of what this bug looked like.
      let lift = 0;
      let room = Math.min(h, vh);
      let eased = false;
      let tier = "0 · no keyboard reported";

      if (vkHeight > 80) {
        // 1. The keyboard told us its own rectangle. Nothing to infer.
        tier = "1 · virtualKeyboard rect";
        lift = vkHeight;
        room = Math.max(MIN_SHEET_ROOM, base - vkHeight);
      } else if (inset > 80) {
        // 2. The visual viewport shrank under a keyboard drawn on top of the
        //    page — iOS Safari and every iOS in-app browser, plus Chrome on
        //    Android. Lift by exactly what it lost; it streams frame by frame.
        tier = "2 · visual viewport inset";
        lift = inset;
        room = vh;
      } else if (baseVisual - vh > 80) {
        // 3. Window and visual viewport shrank together: the browser reflowed
        //    the page around the keyboard, so `bottom: 0` is already above it
        //    and only the cap is left to apply.
        tier = "3 · window+visual reflow";
        room = vh;
      } else if (windowShrink > 80) {
        // 4. `window.innerHeight` shrank but the visual viewport did not.
        //    Instagram's Android WebView does this: it reports the window
        //    resize while leaving the visual viewport — and with it the
        //    containing block this `position: fixed` sheet is laid out against
        //    — at full screen height, so the sheet never followed. The shrink
        //    is still an exact keyboard height, we just have to apply it
        //    ourselves. This used to be read as "the browser handled it", which
        //    zeroed the lift AND cancelled the probe below, so neither rescue
        //    path ran.
        tier = "4 · window-only shrink";
        lift = windowShrink;
        room = Math.max(MIN_SHEET_ROOM, h);
        eased = true;
      }

      // Anything above is a real measurement and outranks the guess. Only a
      // browser that reported none of them falls through to the probe.
      measuredRef.current = vkHeight > 80 || inset > 80 || baseVisual - vh > 80 || windowShrink > 80;
      if (measuredRef.current) {
        clearProbe();
        setKeyboardOverlay(false);
      }
      setKeyboardInset(lift);
      setViewportHeight(room);
      setBaseHeight(base);
      setLiftEased(eased);
      diagRef.current = {
        tier,
        base,
        baseVisual: Math.round(baseVisual),
        h,
        vh: Math.round(vh),
        offsetTop: vv ? Math.round(vv.offsetTop) : null,
        inset: Math.round(inset),
        windowShrink,
        vkHeight: Math.round(vkHeight),
        lift: Math.round(lift),
        room: Math.round(room),
        measured: measuredRef.current,
        focused: focusedRef.current,
      };
    };

    // Re-measuring is otherwise purely event-driven, and the keyboard closing
    // is exactly the case where some browsers send no event at all — so the
    // blur path calls this directly to re-take the resting baseline.
    updateRef.current = update;
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [props.show, clearProbe]);

  // ── VirtualKeyboard API (in-app browsers only) ──
  // Where it exists this replaces all the inference above with the keyboard's
  // actual rectangle. It has to be opted into: `overlaysContent = true` tells
  // the browser to stop resizing anything on our behalf and send
  // `geometrychange` instead. That's a page-level switch, so we hold it only
  // for as long as the sheet is open and put back whatever it was on close —
  // the page behind us is scroll-locked and unfocusable for that whole window,
  // so nothing else is relying on the viewport moving meanwhile.
  //
  // If the opt-in were to leave us with neither resizes nor geometry events,
  // the focus probe below still catches it and falls back to the guess, so the
  // downside of asking is bounded.
  useEffect(() => {
    if (!props.show || isPageWide || kbDebugNoVk) return;
    // Embedded WebViews only. Opting in switches off the browser's own
    // viewport handling, and on a standalone mobile browser that handling
    // already works — swapping a path that works for one that should is a bad
    // trade when the reported breakage is in-app-only. `isEmbeddedBrowser`
    // matches a bare `; wv)` too, so an unrecognised in-app browser still
    // lands here; anything that slips past falls to the tiers below, which is
    // where standalone browsers were already being served correctly.
    if (!isEmbeddedBrowser()) return;
    const vk = getVirtualKeyboard();
    if (!vk) return;
    const previous = vk.overlaysContent;
    const onGeometryChange = () => {
      vkHeightRef.current = vk.boundingRect?.height || 0;
      updateRef.current?.();
    };
    try {
      vk.overlaysContent = true;
    } catch {
      return; // read-only in some embeddings — leave the other tiers to it
    }
    vk.addEventListener("geometrychange", onGeometryChange);
    return () => {
      vk.removeEventListener("geometrychange", onGeometryChange);
      vkHeightRef.current = 0;
      try {
        vk.overlaysContent = previous;
      } catch {
        /* best effort — the modal is going away regardless */
      }
    };
  }, [props.show, isPageWide, kbDebugNoVk]);

  useEffect(
    () => () => {
      if (probeTimer.current) clearTimeout(probeTimer.current);
      if (blurTimer.current) clearTimeout(blurTimer.current);
    },
    [],
  );

  // Bring the focused field high up *inside the sheet's own scroller*. We never
  // call `input.scrollIntoView()`: the sheet header (yellow strip + drag handle
  // + title) is pinned outside the scroll container, and the native scroll can
  // drag the whole document — moving `scrollTop` by hand keeps the effect
  // contained. Aiming for the top quarter rather than "just barely visible"
  // leaves the field on screen even when the assumed keyboard height below
  // undershoots the real one, and keeps its CTA (Send OTP / Continue) with it.
  const revealFocusedField = useCallback(() => {
    const box = scrollBodyRef.current;
    const el = typeof document !== "undefined" ? document.activeElement : null;
    if (!box || !(el instanceof HTMLElement) || !box.contains(el)) return;
    const boxRect = box.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const target = boxRect.top + boxRect.height * 0.25;
    // Only ever scroll the field *up* — pushing it down would bury it under the
    // keyboard we're trying to clear.
    const by = Math.min(elRect.top - target, box.scrollHeight - box.clientHeight - box.scrollTop);
    if (by > 0) box.scrollTop += by;
    else if (elRect.top < boxRect.top) box.scrollTop -= boxRect.top - elRect.top + 12;
  }, []);

  // ── Keyboard probe ──
  // Focus is the one reliable "the keyboard is opening" signal every browser
  // gives us. If neither the visual viewport nor the window has moved shortly
  // after it, this browser is never going to tell us (Android in-app WebViews),
  // so switch to the assumed-height fallback. Any real measurement that lands
  // later wins — `update()` above clears the flag.
  // Bound natively on `document` rather than through React's onFocus/onBlur:
  // the sheet is portaled out of the React root, and focusin/focusout on the
  // document is the one delivery path that can't be affected by that.
  useEffect(() => {
    if (!props.show || isPageWide || typeof document === "undefined") return;

    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || !sheetRef.current?.contains(el)) return;
      if (!/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (blurTimer.current) clearTimeout(blurTimer.current);
      focusedRef.current = true;
      // Deliberately does NOT restart a probe that's already pending. Several
      // WebViews blur and refocus the field while the IME animates in, and
      // resetting the clock on every hop can hold the fallback off for as long
      // as the churn lasts — which is exactly the window it exists to cover.
      if (hasSoftKeyboard() && !probeTimer.current) {
        probeTimer.current = setTimeout(
          () => {
            probeTimer.current = null;
            if (focusedRef.current && !measuredRef.current)
              setKeyboardOverlay(true);
          },
          isEmbeddedBrowser() ? 250 : 500,
        );
      }
      // Re-run once the sheet has finished lifting/resizing around the keyboard.
      requestAnimationFrame(revealFocusedField);
      setTimeout(revealFocusedField, 320);
    };

    const onFocusOut = () => {
      // The probe is left running on purpose: a blur that's really just the IME
      // handing focus back gets re-armed by `onFocusIn` above, and one that
      // isn't is caught by the `focusedRef` check when it fires.
      if (blurTimer.current) clearTimeout(blurTimer.current);
      // Focus hops between fields (phone → the auto-focused OTP box), and blur
      // lands before the next focus — wait a beat so the sheet doesn't drop and
      // re-lift in between.
      blurTimer.current = setTimeout(() => {
        focusedRef.current = false;
        setKeyboardOverlay(false);
        updateRef.current?.();
      }, 150);
    };

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [props.show, isPageWide, revealFocusedField]);

  // Every one of the paths above caps the sheet as it lifts, which can leave
  // the focused field below the fold of the now-shorter scroller.
  useEffect(() => {
    if (!keyboardOverlay && !keyboardInset) return;
    const raf = requestAnimationFrame(revealFocusedField);
    return () => cancelAnimationFrame(raf);
  }, [keyboardOverlay, keyboardInset, viewportHeight, revealFocusedField]);

  // Lock body scroll while the modal is open. iOS ignores `overflow: hidden`
  // for its native focus-scroll — when the phone input is focused it scrolls
  // the document up to reveal the field, and on keyboard close that residual
  // document scroll leaves our `position: fixed` sheet shifted up (title
  // clipped). Pinning the body with `position: fixed` at the current scroll
  // offset stops the focus-scroll entirely; we restore the offset on close.
  useEffect(() => {
    if (!props.show || typeof document === "undefined") return;
    const { style } = document.body;
    const scrollY = window.scrollY;
    const prev = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };
    style.overflow = "hidden";
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    return () => {
      style.overflow = prev.overflow;
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [props.show]);

  // Animate out, then hand control back to the parent (which unmounts us).
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setDragY(0);
    closeTimer.current = setTimeout(() => {
      props.onhide();
    }, SHEET_ANIM_MS);
  }, [closing, props]);

  const handleClose = () => {
    if (props.hideloginclose) return;
    requestClose();
  };

  const handleBackdropClick = () => {
    if (!props.hideloginclose) requestClose();
  };

  const handleVerified = useCallback(() => {
    // Fire the caller's post-login hook (attach itinerary, resume a pending
    // action, …), then close. onSuccess owns its own async; we don't block the
    // close on it so the sheet dismisses promptly on success.
    try {
      const r = props.onSuccess?.();
      if (r && typeof (r as Promise<void>).then === "function") {
        (r as Promise<void>).catch(() => {});
      }
    } catch {
      /* swallow — a failing hook shouldn't trap the user in the modal */
    }
    requestClose();
  }, [props, requestClose]);

  // ── Bottom-sheet drag-to-close (mobile) ──
  const onSheetTouchStart = (e: React.TouchEvent) => {
    if (props.hideloginclose) return;
    dragStartY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const onSheetTouchMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragY(delta > 0 ? delta : 0); // only track downward drags
  };

  const onSheetTouchEnd = () => {
    setDragging(false);
    dragStartY.current = null;
    // Close if dragged far enough, otherwise snap back.
    if (dragY > 120 && !props.hideloginclose) {
      requestClose();
    } else {
      setDragY(0);
    }
  };

  if (!props.show) return null;
  if (typeof document === "undefined") return null;
  if (!layoutReady) return null;

  const z = props.zIndex || 3300;
  const backdropZ = Number(z) - 1;
  const open = entered && !closing;

  // Keyboard is up but unmeasurable — lift the sheet by an assumed keyboard
  // height and cap it to what's left, so the fields land in the strip of screen
  // the keyboard can't be covering.
  const assumedKeyboard = Math.round(
    Math.min(
      ASSUMED_KEYBOARD_MAX,
      Math.max(ASSUMED_KEYBOARD_MIN, (baseHeight ?? 0) * ASSUMED_KEYBOARD_RATIO),
    ),
  );
  const assumeKeyboard = !isPageWide && keyboardOverlay;
  const liftBy = assumeKeyboard ? assumedKeyboard : keyboardInset;
  // Height of the strip left above the assumed keyboard. The sheet takes all of
  // it rather than just capping at it: pinned to the top of the screen, a short
  // card (the OTP step) can't come to rest right on the guessed keyboard line,
  // where a keyboard even slightly taller than assumed would swallow it.
  const assumedRoom = baseHeight
    ? Math.max(240, baseHeight - assumedKeyboard)
    : null;
  const sheetMaxHeight =
    assumeKeyboard && assumedRoom
      ? `${assumedRoom}px`
      : viewportHeight
        ? `${viewportHeight}px`
        : "92vh";

  const otpCard = (
    <OtpCard
      bare
      heading="Sign in to continue"
      title={props.title}
      submitLabel="Send OTP"
      itineraryId={props.itinary_id}
      onVerified={handleVerified}
    />
  );

  const closeButton = props.hideloginclose ? null : (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Close"
      style={{
        position: "absolute",
        top: isPageWide ? 14 : 18,
        right: 14,
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#ffffff",
        border: "1px solid #ECEAE1",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#5C5A55",
        zIndex: 10,
        boxShadow: "0 2px 8px rgba(15,27,45,0.06)",
      }}
    >
      <RxCross2 />
    </button>
  );

  const yellowStrip = (
    <div
      style={{
        height: 6,
        background: "linear-gradient(90deg, #FFE600, #F2D700)",
        flexShrink: 0,
      }}
    />
  );

  const node = (
    <>
      <div
        onClick={handleBackdropClick}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 26, 46, 0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: backdropZ,
          opacity: open ? 1 : 0,
          transition: `opacity ${SHEET_ANIM_MS}ms ease`,
        }}
      />

      {isPageWide ? (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: open
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -46%) scale(0.98)",
            opacity: open ? 1 : 0,
            background: "#ffffff",
            borderRadius: 20,
            width: "min(420px, 95vw)",
            maxHeight: "92vh",
            // Clip to the rounded corners (so the yellow strip curves with the
            // top edge) without a scrollbar — the card content fits within cap.
            overflow: "hidden",
            zIndex: z as number,
            boxShadow: "0 12px 40px rgba(15, 27, 45, 0.16)",
            transition: `opacity ${SHEET_ANIM_MS}ms ease, transform ${SHEET_ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        >
          {yellowStrip}
          {closeButton}
          {/* Desktop has no drag handle, so give the content breathing room
              below the yellow strip / close button. */}
          <div style={{ paddingTop: 14 }}>{otpCard}</div>
        </div>
      ) : (
        <div
          ref={liftLayerRef}
          // ── Keyboard-lift layer ──
          // Rides the sheet above the on-screen keyboard by exactly the
          // visualViewport inset. Deliberately has NO transition: it tracks the
          // keyboard frame-for-frame where the browser streams resize events
          // (Android) and snaps in sync where the inset is reported only once the
          // keyboard has settled (iOS). A timed transition here is what made the
          // lift lag/stutter — the keyboard's own animation and ours desynced.
          // The exceptions are the lifts that arrive as one discrete jump — our
          // own guess, and the single resize event of the window-only shape.
          // Neither has a stream to stay in sync with, so they ease instead of
          // snapping.
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: z as number,
            transform: `translateY(${-liftBy}px)`,
            willChange: "transform",
            transition:
              assumeKeyboard || liftEased
                ? `transform 220ms cubic-bezier(0.22, 1, 0.36, 1)`
                : "none",
          }}
        >
          <div
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
              // Rounded all round while it floats above an assumed keyboard —
              // if the guess ran long, the strip of backdrop below it should
              // read as a card, not a clipped sheet.
              borderRadius: assumeKeyboard ? 20 : "20px 20px 0 0",
              // Only while it's resting on the screen edge: lifted clear of a
              // keyboard there's no home indicator under it to avoid.
              paddingBottom: liftBy > 0 ? 0 : "env(safe-area-inset-bottom, 0px)",
              maxHeight: sheetMaxHeight,
              ...(assumeKeyboard && assumedRoom
                ? { height: `${assumedRoom}px` }
                : null),
              // Clip to the rounded top (so the yellow strip curves with the
              // edge). The yellow strip + drag handle stay pinned; the card
              // body below scrolls internally, so keyboard focus-scroll can
              // never push the title out of view.
              overflow: "hidden",
              boxShadow: "0 -16px 40px rgba(0,0,0,0.18)",
              // Open slide + drag-to-close only — kept on its own layer so the
              // entrance/exit eases while the keyboard tracking above stays
              // instant. `dragging` kills the transition so the sheet follows the
              // touch 1:1.
              willChange: "transform",
              transform: open
                ? dragY
                  ? `translateY(${dragY}px)`
                  : "translateY(0)"
                : "translateY(100%)",
              transition: dragging
                ? "none"
                : `transform ${SHEET_ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            {yellowStrip}
            {/* Drag handle — grab zone for the pull-to-dismiss gesture. */}
            <div
              onTouchStart={onSheetTouchStart}
              onTouchMove={onSheetTouchMove}
              onTouchEnd={onSheetTouchEnd}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px 0 6px",
                flexShrink: 0,
                cursor: "grab",
                touchAction: "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 5,
                  borderRadius: 3,
                  background: "#D1D5DB",
                }}
              />
            </div>
            {closeButton}
            {/* Scrollable card body — the header above stays pinned. `flex: 1`
                fills the sheet when content is short (no scroll); when the
                keyboard shrinks the sheet, only this region scrolls (scrollbar
                hidden) so the focused field stays reachable without hiding the
                title. */}
            <div
              ref={scrollBodyRef}
              className="hide-scrollbar"
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              {otpCard}
            </div>
          </div>
        </div>
      )}

      {kbDebug && !isPageWide ? (
        <KeyboardDebugOverlay
          diagRef={diagRef}
          layerRef={liftLayerRef}
          zIndex={Number(z) + 10}
        />
      ) : null}
    </>
  );

  return createPortal(node, document.body);
};

export default BotLoginModal;
