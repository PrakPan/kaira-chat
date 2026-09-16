// The trip planner form, opened over whatever page the reader is already on.
//
// /new-trip keeps rendering the form as a full page. This is the other way in:
// a hero CTA that shouldn't cost a navigation. The panel rises from the bottom
// of the screen — a sheet on a phone, a centred dialog on desktop — and slides
// back down on close.
//
// It carries its own overlay rather than reusing ModalWithBackdrop /
// BottomModal. Those mount and unmount on `show` with no from-state, so there
// is nothing to transition, and picking between them in JS put a viewport
// decision in JavaScript that CSS should own. Everything here is one element
// pair plus a media query — see `.ttw-formmodal` in styles/kaira-form.css.
//
// Loaded on demand by the caller: the form pulls in the route map,
// react-beautiful-dnd and the login modal behind it, and the homepage would
// otherwise ship all of that to every visitor whether or not they open it.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

const TailoredForm = dynamic(() => import("./Index"), { ssr: false });

// Kept in step with the transition in the stylesheet. The panel has to stay
// mounted for the whole exit or there is nothing on screen to slide away.
const EXIT_MS = 280;

const TailoredFormModal = ({ show, onHide }) => {
  // `mounted` is whether the panel is in the DOM at all; `open` is whether it
  // has been given its resting position. They differ for one frame on the way
  // in (so the browser has a from-state to animate from) and for the length of
  // the transition on the way out.
  const [mounted, setMounted] = useState(show);
  const [open, setOpen] = useState(false);
  const exitTimer = useRef(null);

  useEffect(() => {
    clearTimeout(exitTimer.current);

    if (show) {
      setMounted(true);
      // Two frames: one for React to commit the closed state, one for the
      // browser to paint it. Flipping the class in the same frame as the mount
      // gives it no start value and the panel simply appears.
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setOpen(true)),
      );
      return () => cancelAnimationFrame(raf);
    }

    setOpen(false);
    exitTimer.current = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(exitTimer.current);
  }, [show]);

  useEffect(() => () => clearTimeout(exitTimer.current), []);

  // The form fills the overlay and scrolls inside itself, so the page behind it
  // must not scroll too. Tied to `show` rather than `mounted` so the page is
  // handed back its scroll as the panel starts leaving, not after.
  useEffect(() => {
    if (!show || typeof document === "undefined") return undefined;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [show]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`ttw-formmodal${open ? " is-open" : ""}`}
      onClick={onHide}
      role="presentation"
    >
      {/* `tailoredFormModal` puts the card in its embedded variant: no backdrop
          of its own, no rounded shell, filling this panel — which is also what
          clips the card's square corners to the panel's radius. */}
      <div
        className="ttw-formmodal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Plan your trip"
        onClick={(e) => e.stopPropagation()}
      >
        <TailoredForm tailoredFormModal onHide={onHide} />
      </div>
    </div>,
    document.body,
  );
};

export default TailoredFormModal;
