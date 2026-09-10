// Full-screen search, for a phone.
//
// The pattern every shopping and travel app uses for a field with suggestions:
// tapping it hands the whole screen over to the search — the query pinned to
// the top, the results filling everything under it — instead of dropping a list
// under a field that is already halfway down a form.
//
// It exists because the inline dropdown cannot win on a phone. The keyboard
// takes roughly the bottom half of the screen, and the field it belongs to can
// sit anywhere in a scrolling form, so the list has to fit in whatever gap is
// left. Handing over the whole screen removes the constraint rather than
// negotiating with it: the sheet is sized to the visible viewport, so the list
// gets every pixel the keyboard is not using.
//
// Rendered through a portal to <body>: the form is itself inside a modal with
// its own stacking and `overflow: hidden`, and this has to sit over all of it.
//
// The caller owns the rows — each field's results look different (a pin and a
// name for a departure city, a photo tile and a country for a destination) —
// so they come in as children and this component only owns the chrome.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconArrowLeft, IconSearch, IconX } from "./icons";

const SearchSheet = ({
  open,
  onClose,
  placeholder,
  value,
  onChange,
  onClear,
  label,
  loading,
  empty,
  children,
}) => {
  // Held in a ref, and deliberately NOT a dependency of the effect below.
  // Callers pass an inline arrow, so a new identity arrives on every render —
  // as a dependency it re-ran the effect on each keystroke, and the cleanup's
  // history.back() then closed the sheet the moment anyone typed.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // The list refuses taps for a moment after the sheet appears.
  //
  // Belt and braces behind the caller opening this on `click` rather than
  // `pointerdown`: a full-screen overlay that materialises under a finger is
  // one stray synthetic event away from picking a row nobody chose, and in-app
  // webviews are inconsistent about which events a tap still has left. A
  // quarter-second is under the time it takes to read the first result, so it
  // costs nothing and cannot be felt.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!open) {
      setArmed(false);
      return undefined;
    }
    const t = setTimeout(() => setArmed(true), 250);
    return () => clearTimeout(t);
  }, [open]);

  // Escape closes, and so does the hardware/gesture back on Android — the
  // history entry means "back" dismisses the search rather than leaving the
  // page, which is what the pattern leads people to expect.
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    window.history.pushState({ ttwSearchSheet: true }, "");
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      // Only unwind the entry we added — if this cleanup is running *because*
      // of a popstate, it is already gone.
      if (window.history.state?.ttwSearchSheet) window.history.back();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="ksheet" role="dialog" aria-modal="true">
      <div className="ksheet-bar">
        <button
          type="button"
          className="ksheet-back"
          onClick={onClose}
          aria-label="Back"
        >
          <IconArrowLeft size={20} />
        </button>
        <span className="ksheet-bar-icon" aria-hidden="true">
          <IconSearch size={16} />
        </span>
        <input
          className="ksheet-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-label={placeholder}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          // Submitting does nothing — the list is live — so keep the keyboard's
          // return key from reloading the page it is nested in.
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        />
        {value ? (
          <button
            type="button"
            className="ksheet-clear"
            onClick={onClear}
            aria-label="Clear search"
          >
            <IconX size={14} />
          </button>
        ) : null}
      </div>

      <div className={`ksheet-list${armed ? " is-armed" : ""}`}>
        {label ? <div className="ksheet-label">{label}</div> : null}
        {children}
        {loading ? <div className="ksheet-empty">Searching…</div> : null}
        {!loading && empty ? <div className="ksheet-empty">{empty}</div> : null}
      </div>
    </div>,
    document.body,
  );
};

export default SearchSheet;
