import React, { useRef } from "react";
import getModeAccent from "../../common/components/bookingDetail/modeAccent";
import Sheet from "../../common/components/Sheet";

// ─────────────────────────────────────────────────────────────────────────────
//  DetailSheet — ONE sheet, one descriptor, every row on the surface.
//
//  The design has a single detail drawer that a stay, a flight, a taxi, a day
//  item and the visa/eSIM block all open into. It is deliberately not five
//  sheets: they carry identical chrome (image, kind, name, facts, cancellation,
//  map, footer) and differ only in what fills it, so a shared descriptor is
//  what keeps them from drifting apart.
//
//  Callers pass `detail`:
//    { kind, name, meta, imageUrl, blurb, facts: [{k, v}],
//      segments: [{modeLabel, modeKey, title, durationLabel}],
//      policy, hasMap, statusLabel, status, contextLabel,
//      canChange, changeLabel, changeMessage,
//      canRemove, removeLabel, removeMessage }
//
//  NO PRICE ever appears here. Reading about a booking must not turn into an
//  audit of a line item that isn't separately payable — the same rule that
//  keeps prices off the rows keeps them out of this sheet.
//
//  Both footer buttons hand over to Kaira. There is no edit control anywhere on
//  this surface; a change is a request, and she is the one who makes it.
// ─────────────────────────────────────────────────────────────────────────────

// Fallback cancellation copy by kind. Deliberately dateless: the design's
// "Free until 24 Sept" is real data in the prototype and would be an invention
// here, so each line says only what is true of every booking of that kind. A
// caller with the actual policy passes `policy` and overrides this.
const policyFor = (kind = "") => {
  const k = String(kind).toUpperCase();
  if (k.startsWith("BEFORE YOU FLY")) return null;
  if (k.startsWith("FLIGHT"))
    return "Changeable before departure — the fare difference applies.";
  if (k.startsWith("PLACE") || k.startsWith("RESTAURANT"))
    return "Nothing booked — skip it freely.";
  return "Ask Kaira for the cancellation terms on this booking.";
};

/**
 * One leg of a combo booking. A combo is a single booking made of several
 * journeys — "taxi to the airport, then fly, then a taxi at the other end" —
 * and the row above can only fit its glyphs. This is where the traveller finds
 * out which part is which, and how long each takes.
 */
function Segment({ seg, first }) {
  const Icon = getModeAccent(seg.modeKey).Icon;
  return (
    <div
      className={`flex items-center gap-[10px] px-[11px] py-[10px] ${
        first ? "" : "border-t border-[#f1f2f4]"
      }`}
    >
      {Icon ? (
        <Icon size={17} color="#1a4fd6" className="flex-none" aria-hidden />
      ) : (
        <span className="h-[17px] w-[17px] flex-none" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-[700] text-[#0b1220]">
          {seg.title}
        </div>
        <div className="mt-[3px] truncate font-mono text-[8px] tracking-[0.06em] text-[#8a93a6]">
          {[seg.modeLabel, seg.durationLabel].filter(Boolean).join(" · ").toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function Fact({ k, v }) {
  if (!v) return null;
  return (
    <div className="flex items-center justify-between gap-[12px] border-b border-[#f1f2f4] pb-[9px]">
      <span className="flex-none font-mono text-[8.5px] tracking-[0.07em] text-[#8a93a6]">
        {k}
      </span>
      <span className="text-right text-[12px] font-[600] text-[#0b1220]">{v}</span>
    </div>
  );
}

export default function DetailSheet({
  open,
  onClose,
  detail,
  disabled,
  onAskKaira,
}) {
  // Hold the last descriptor so the sheet still has something to draw while it
  // slides out. The single sheet slot is cleared the instant it closes, and
  // rendering null on that tick empties the panel mid-animation — the sheet
  // appears to blink out rather than travel down.
  const lastRef = useRef(null);
  if (detail) lastRef.current = detail;
  const d = detail || lastRef.current;
  if (!d) return null;

  const facts = (d.facts || []).filter((f) => f && f.v);
  const policy =
    d.policy !== undefined ? d.policy : policyFor(d.kind);

  const act = (message) => () => {
    if (message) onAskKaira?.(message, d.contextLabel || d.name);
    onClose?.();
  };

  return (
    <Sheet open={open} onClose={onClose} height="78dvh" zIndex={1610}>
      <div className="flex h-full flex-col">
        <div className="flex-none px-[14px]">
          <div className="flex items-start gap-[11px] border-b border-[#e6e8ec] pb-[11px]">
            <div
              className="h-[54px] w-[54px] flex-none rounded-[11px] bg-[#eef0f4] bg-cover bg-center"
              style={
                d.imageUrl
                  ? { backgroundImage: `url("${d.imageUrl}")` }
                  : undefined
              }
            />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[8px] tracking-[0.08em] text-[#8a93a6]">
                {d.kind}
              </div>
              <div className="mt-[4px] text-[15px] font-[800] leading-[1.2] tracking-[-0.02em] text-[#0b1220]">
                {d.name}
              </div>
              {d.meta ? (
                <div className="mt-[5px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                  {d.meta}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                border: "1px solid #dcdfe5",
                background: "#ffffff",
                borderRadius: 999,
                boxShadow: "none",
                width: 24,
                height: 24,
                color: "#6b7280",
                fontSize: 12,
                lineHeight: 1,
                padding: 0,
              }}
              className="flex flex-none items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[14px] py-[12px]">
          <div className="flex flex-col gap-[11px]">
            {d.blurb ? (
              <div className="text-[12.5px] leading-[1.5] text-[#445069]">
                {d.blurb}
              </div>
            ) : null}

            {d.segments && d.segments.length > 1 ? (
              <div>
                <div className="mb-[7px] font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]">
                  THIS JOURNEY
                </div>
                <div
                  style={{
                    border: "1px solid #dcdfe5",
                    borderRadius: 11,
                    overflow: "hidden",
                    boxShadow: "none",
                  }}
                >
                  {d.segments.map((seg, i) => (
                    <Segment
                      key={seg.bookingId || `${seg.title}-${i}`}
                      seg={seg}
                      first={i === 0}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {facts.map((f) => (
              <Fact key={f.k} k={f.k} v={f.v} />
            ))}

            {policy ? (
              <div
                style={{
                  border: "1px solid #dcdfe5",
                  borderRadius: 11,
                  boxShadow: "none",
                }}
                className="flex flex-col gap-[4px] p-[11px]"
              >
                <div className="font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]">
                  CANCELLATION
                </div>
                <div className="text-[12px] text-[#0b1220]">{policy}</div>
              </div>
            ) : null}

            {/* The design reserves a map block on everything with a location.
                Rendered only when the caller says there is one to show, so it
                is never an empty grey box promising a map that never loads. */}
            {d.hasMap ? (
              <button
                type="button"
                onClick={d.onOpenMap}
                disabled={!d.onOpenMap}
                style={{
                  border: "1px solid #dcdfe5",
                  borderRadius: 11,
                  background: "#eef0f4",
                  boxShadow: "none",
                }}
                className="grid h-[104px] w-full place-items-center font-mono text-[8.5px] tracking-[0.08em] text-[#8a93a6] disabled:opacity-70"
              >
                MAP
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex-none border-t border-[#e6e8ec] px-[14px] pb-[14px] pt-[11px]">
          <div className="flex items-center gap-[8px]">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]">
                {d.statusLabel || "IN YOUR PACKAGE"}
              </div>
              <div className="mt-[3px] text-[12.5px] font-[700] text-[#0b1220]">
                {d.status || "Included · nothing extra to pay"}
              </div>
            </div>
            {d.canChange ? (
              <button
                type="button"
                disabled={disabled}
                onClick={act(d.changeMessage)}
                style={{
                  border: "none",
                  background: "#f7e700",
                  borderRadius: 10,
                  boxShadow: "0 8px 20px -10px rgba(247,231,0,0.5)",
                }}
                className="flex-none whitespace-nowrap px-[18px] py-[11px] text-[12.5px] font-[800] text-[#0b1220] disabled:opacity-40"
              >
                {d.changeLabel || "Change"}
              </button>
            ) : null}
            {d.canRemove ? (
              <button
                type="button"
                disabled={disabled}
                onClick={act(d.removeMessage)}
                style={{
                  border: "1px solid #dcdfe5",
                  background: "#ffffff",
                  borderRadius: 10,
                  boxShadow: "none",
                }}
                className="flex-none whitespace-nowrap px-[14px] py-[10px] text-[12.5px] font-[600] text-[#6b7280] disabled:opacity-40"
              >
                {d.removeLabel || "Remove"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
