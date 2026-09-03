import React, { useRef } from "react";
import getModeAccent from "../../common/components/bookingDetail/modeAccent";
import BookingDetailActions from "../../common/components/BookingDetailActions";
import Sheet from "../../common/components/Sheet";
import LiveDetailBody from "./LiveDetailBody";
import StarGlyph from "../../common/components/bookingDetail/StarGlyph";

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
//    { kind, name, meta, imageUrl, Icon | iconKeys, iconColor, blurb,
//      facts: [{k, v}],
//      segments: [{modeLabel, modeKey, title, durationLabel}],
//      policy, hasMap, contextLabel,
//      live: { … }  ← see below,
//      canChange, changeLabel, changeLabelShort, changeMessage,
//      canRemove, removeLabel, removeMessage }
//
//  `live` names a booking that has a detail endpoint behind it — a transfer, a
//  stay, a day element, a visa or eSIM. When it is present the BODY is the real
//  booking, fetched and rendered by LiveDetailBody off the same endpoints
//  desktop reads; the blurb/facts/map fallback below is what a row with nothing
//  to fetch shows instead (a POI the traveller has not booked, say). The header
//  and the footer are untouched either way — they are the same on every detail
//  sheet by design, and the only thing that changes between them is what sits
//  in between.
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
      className={`flex items-center gap-[11px] px-[11px] py-[11px] ${
        first ? "" : "border-t border-[#f1f2f4]"
      }`}
    >
      {Icon ? (
        <Icon size={18} color="#1a4fd6" className="flex-none" aria-hidden />
      ) : (
        <span className="h-[17px] w-[17px] flex-none" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-[700] text-[#0b1220]">
          {seg.title}
        </div>
        <div className="mt-[3px] truncate font-mono text-[9.5px] tracking-[0.06em] text-[#8a93a6]">
          {[seg.modeLabel, seg.durationLabel].filter(Boolean).join(" · ").toUpperCase()}
        </div>
      </div>
    </div>
  );
}

/**
 * The header's meta line, with the star drawn at a size you can read.
 *
 * A stay's meta is "2★ · 1 ROOM · 2 NIGHTS", set in the same 10px mono as every
 * other meta on the surface — and at that size, in a monospace face, the star
 * is a speck rather than a rating. It is a GLYPH, not a letter, so it is scaled
 * on its own instead of by raising the whole line, which would enlarge the
 * transfer and activity metas that have no glyph in them.
 *
 * It is a drawn star rather than the character: at 13px against a 10px numeral
 * the typed glyph rode low, and how low depended on which font on the device
 * owned "★" — StarGlyph centres it on the digit instead.
 */
function Meta({ text }) {
  const parts = String(text).split("★");
  if (parts.length === 1) return text;

  return parts.map((part, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 ? <StarGlyph size={11} textSize={10} style={{ marginLeft: 1 }} /> : null}
    </React.Fragment>
  ));
}

function Fact({ k, v }) {
  if (!v) return null;
  return (
    <div className="flex items-center justify-between gap-[13px] border-b border-[#f1f2f4] pb-[9px]">
      <span className="flex-none font-mono text-[10px] tracking-[0.07em] text-[#8a93a6]">
        {k}
      </span>
      <span className="text-right text-[13px] font-[600] text-[#0b1220]">{v}</span>
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
  // The tile's stand-in for a photo. `iconKeys` is a journey's run of modes
  // (see LegSection's TravelRow); `Icon` is the single glyph everything else
  // passes. Either way the tile is never left as a bare grey square.
  const glyphs = d.iconKeys?.length
    ? d.iconKeys.map((key) => ({ key, Icon: getModeAccent(key).Icon }))
    : d.Icon
      ? [{ key: "icon", Icon: d.Icon }]
      : [];
  const policy =
    d.policy !== undefined ? d.policy : policyFor(d.kind);

  const act = (message) => () => {
    if (message) onAskKaira?.(message, d.contextLabel || d.name);
    onClose?.();
  };

  return (
    <Sheet open={open} onClose={onClose} height="95dvh" zIndex={1610}>
      <div className="flex h-full flex-col">
        <div className="flex-none px-[14px]">
          <div className="flex items-start gap-[12px] border-b border-[#e6e8ec] pb-[11px]">
            {/* The photo, or — for the rows that never have one, every journey
                and the visa/eSIM block — the same glyph their row in the trip
                carries, so opening one doesn't swap its identity for a blank
                tile. A combo keeps the row's whole run ("car › plane"): one
                glyph for a taxi+flight booking would say the traveller is being
                driven the entire way. */}
            <div
              className="flex h-[58px] w-[58px] flex-none items-center justify-center gap-[2px] rounded-[11px] bg-[#eef0f4] bg-cover bg-center"
              style={
                d.imageUrl
                  ? { backgroundImage: `url("${d.imageUrl}")` }
                  : undefined
              }
            >
              {!d.imageUrl && glyphs.length ? (
                glyphs.map(({ key, Icon }, i) => (
                  <React.Fragment key={`${key}-${i}`}>
                    {i > 0 ? (
                      <span
                        className="text-[9px] leading-none text-[#8fa8dd]"
                        aria-hidden
                      >
                        ›
                      </span>
                    ) : null}
                    {/* Two or three glyphs have to share the tile the single
                        one had to itself. */}
                    <Icon
                      size={glyphs.length > 1 ? 17 : 22}
                      color={d.iconColor || "#6b7280"}
                      aria-hidden
                    />
                  </React.Fragment>
                ))
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              {/* A descriptor may leave the kicker off (a booked activity
                  does) — rendered conditionally so the header closes up
                  instead of holding an empty mono line above the name. */}
              {d.kind ? (
                <div className="font-mono text-[9.5px] tracking-[0.08em] text-[#8a93a6]">
                  {d.kind}
                </div>
              ) : null}
              <div
                className={`text-[16px] font-[800] leading-[1.2] tracking-[-0.02em] text-[#0b1220] ${
                  d.kind ? "mt-[4px]" : ""
                }`}
              >
                {d.name}
              </div>
              {d.meta ? (
                <div className="mt-[5px] font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
                  <Meta text={d.meta} />
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
                width: 26,
                height: 26,
                color: "#6b7280",
                fontSize: 13,
                lineHeight: 1,
                padding: 0,
              }}
              className="flex flex-none items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto ${
            d.live ? "" : "px-[14px] py-[12px]"
          }`}
        >
          {d.live ? (
            // Keyed on the booking so opening a second row refetches instead of
            // showing the first one's detail under the new header.
            <LiveDetailBody
              key={`${d.live.kind}:${d.live.bookingId || d.live.id}`}
              live={d.live}
            />
          ) : (
            <div className="flex flex-col gap-[12px]">
              {d.blurb ? (
                <div className="text-[13.5px] leading-[1.5] text-[#445069]">
                  {d.blurb}
                </div>
              ) : null}

              {d.segments && d.segments.length > 1 ? (
                <div>
                  <div className="mb-[7px] font-mono text-[9.5px] tracking-[0.07em] text-[#8a93a6]">
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
                  className="flex flex-col gap-[4px] p-[12px]"
                >
                  <div className="font-mono text-[9.5px] tracking-[0.07em] text-[#8a93a6]">
                    CANCELLATION
                  </div>
                  <div className="text-[13px] text-[#0b1220]">{policy}</div>
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
                  className="grid h-[104px] w-full place-items-center font-mono text-[10px] tracking-[0.08em] text-[#8a93a6] disabled:opacity-70"
                >
                  MAP
                </button>
              ) : null}
            </div>
          )}
        </div>

        {/* The same two pills every booking drawer on the site ends with —
            outlined red "Remove" on the left, yellow "Change …" on the right —
            rather than this sheet's own pair of square buttons.

            The status column they used to share the bar with is gone: it said
            "IN YOUR PACKAGE / Included" on nearly every booking, which is the
            one thing a traveller already knows about anything in their
            itinerary, and it was taking the width that let the pills be pills.
            The one row with something else to say (a held activity ticket)
            still says it in its STATUS fact.

            Removing here is not the desktop's immediate cancellation — it hands
            the request to Kaira like every other action on this surface — so it
            skips BookingDetailActions' confirm modal: there is nothing yet to
            confirm, and the message she is asked is visible in the thread the
            sheet closes into. */}
        {d.canChange || d.canRemove ? (
          <div className="flex-none border-t border-[#e6e8ec] px-[14px] pb-[14px] pt-[11px]">
            <BookingDetailActions
              onDelete={d.canRemove ? act(d.removeMessage) : undefined}
              deleteLabel={d.removeLabel || "Remove from Itinerary"}
              deleteDisabled={disabled}
              confirmDelete={false}
              onChange={d.canChange ? act(d.changeMessage) : undefined}
              changeLabel={d.changeLabel || "Change"}
              // A label too long for a phone's half of the bar hands in a short
              // form that swaps in under 520px, the way the POI drawer's
              // "Replace with something else" becomes "Replace".
              changeLabelShort={d.changeLabelShort || undefined}
              changeDisabled={disabled}
            />
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}
