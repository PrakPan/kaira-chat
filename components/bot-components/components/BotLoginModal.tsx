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

  // Track the on-screen keyboard so the mobile bottom sheet stays above it.
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => {
      setKeyboardInset(
        Math.max(0, window.innerHeight - vv.height - vv.offsetTop),
      );
      setViewportHeight(vv.height);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  const scrollFocusIntoView = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 300);
  }, []);

  // When the keyboard opens/closes, re-scroll the active input into view.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const active = document.activeElement;
    if (
      active instanceof HTMLInputElement ||
      active instanceof HTMLTextAreaElement
    ) {
      scrollFocusIntoView(active);
    }
  }, [viewportHeight, scrollFocusIntoView]);

  // Lock body scroll while the modal is open so iOS doesn't auto-scroll the
  // document and push the sheet behind the keyboard.
  useEffect(() => {
    if (!props.show || typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    const prevPosition = document.body.style.position;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.position = prevPosition;
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
            overflowY: "auto",
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
          // ── Keyboard-lift layer ──
          // Rides the sheet above the on-screen keyboard by exactly the
          // visualViewport inset. Deliberately has NO transition: it tracks the
          // keyboard frame-for-frame where the browser streams resize events
          // (Android) and snaps in sync where the inset is reported only once the
          // keyboard has settled (iOS). A timed transition here is what made the
          // lift lag/stutter — the keyboard's own animation and ours desynced.
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: z as number,
            transform: `translateY(${-keyboardInset}px)`,
            willChange: "transform",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#ffffff",
              borderRadius: "20px 20px 0 0",
              maxHeight: viewportHeight ? `${viewportHeight}px` : "92vh",
              overflowY: "auto",
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
            {otpCard}
          </div>
        </div>
      )}
    </>
  );

  return createPortal(node, document.body);
};

export default BotLoginModal;
