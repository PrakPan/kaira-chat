import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import RangeCalendar, {
  earliestDate,
} from "../tailoredform/kaira/RangeCalendar";
import { IconX } from "../tailoredform/kaira/icons";
import { diffDays, fmtDayMon, fromYMD } from "../tailoredform/kaira/dateUtils";

/**
 * The Settings date picker: the tailored form's two-month range calendar on
 * its own, without the "I have dates / Flexible / Not sure" tabs — an
 * itinerary being re-priced always has fixed dates.
 *
 * Centred dialog on desktop, bottom sheet on a phone; the stylesheet decides
 * which (`.kform-datesheet` in styles/kaira-form.css), so the markup is the
 * same at both widths.
 *
 * Portalled to <body>. Settings itself lives inside a sheet whose `transform`
 * makes it the containing block for any `position: fixed` descendant, so a
 * picker nested inside it was laid out against — and clipped by — the
 * Settings sheet instead of the viewport. That is what hid the month
 * navigation on phones.
 *
 * Everything picked here is a draft. Done commits it and is only enabled on a
 * complete range, so a half-picked or cleared calendar can never wipe the
 * dates the itinerary already has; Clear only resets the draft, and closing
 * any other way (the X, the scrim, Escape) discards it.
 *
 * When Done saves straight to the server (UpdateItineraryDates), the caller
 * passes `busy` while the request runs and `closeOnApply={false}`: the sheet
 * stays up with a spinner, locked, and the caller closes it once the save has
 * gone through — or leaves it open, draft intact, to retry after an error.
 */
const DateRangeSheet = ({
  start,
  end,
  onApply,
  onClose,
  busy = false,
  closeOnApply = true,
}) => {
  const earliest = earliestDate();
  // A range that has already started (the "your dates have passed" flow) is
  // not a valid answer, so the picker opens empty rather than pre-selecting it.
  const committedStart = fromYMD(start);
  const committedEnd = fromYMD(end);
  const valid = committedStart && committedEnd && committedStart >= earliest;
  const [ds, setDs] = useState(valid ? committedStart : null);
  const [de, setDe] = useState(valid ? committedEnd : null);

  // Closing mid-save would hide the request without stopping it, so every way
  // out is shut until it settles.
  const dismiss = () => {
    if (!busy) onClose();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const complete = !!(ds && de);
  const nights = complete ? diffDays(ds, de) : 0;
  const status = complete
    ? `${nights} night${nights === 1 ? "" : "s"} · ${fmtDayMon(ds)} - ${fmtDayMon(de)} ${de.getFullYear()}`
    : ds
      ? "Now pick an end date"
      : "Pick a start date";

  const clear = () => {
    setDs(null);
    setDe(null);
  };

  const done = () => {
    if (!complete || busy) return;
    onApply({ start: ds, end: de });
    if (closeOnApply) onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`kform kform-datesheet${busy ? " is-busy" : ""}`}
      onClick={dismiss}
      role="presentation"
    >
      <div
        className="kform-datesheet-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Pick your travel dates"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kform-panel">
          <div className="kform-datesheet-grab" aria-hidden="true" />
          <div className="kform-datesheet-head">
            <div className="kform-datesheet-title">
              Pick your <span className="kform-serif">travel</span> dates
            </div>
            <button
              type="button"
              className="kform-iconbtn kform-iconbtn--sm"
              onClick={dismiss}
              disabled={busy}
              aria-label="close"
            >
              <IconX size={12} />
            </button>
          </div>

          <div className="kform-panel-scroll">
            <RangeCalendar
              start={ds}
              end={de}
              onChange={({ start: s, end: e }) => {
                setDs(s);
                setDe(e);
              }}
            />
          </div>

          <div className="kform-panel-foot">
            <div className="kform-panel-foot-text">
              {busy ? "Updating your dates…" : status}
            </div>
            <button
              type="button"
              className="kform-linkbtn"
              onClick={clear}
              disabled={!ds || busy}
            >
              Clear
            </button>
            <button
              type="button"
              className="kform-btn-ink"
              onClick={done}
              disabled={!complete || busy}
              aria-busy={busy}
            >
              {busy ? <span className="kform-spin" /> : null}
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DateRangeSheet;
