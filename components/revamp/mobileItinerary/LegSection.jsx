import React from "react";
import * as T from "./designTokens";
import getModeAccent from "../common/components/bookingDetail/modeAccent";

// ─────────────────────────────────────────────────────────────────────────────
//  One leg of the trip, as "Kaira E Bordered" draws it:
//
//    transfer card  → how you get here, with its taxi halves as chips
//    city cover     → the city in serif on its own gradient
//    stay card      → where you sleep, edged in the city's colour
//    day cards      → one per day, bordered in the city's colour, holding
//                     that day's activities and the cars that run on it
//    add taxi       → while this city is still missing a car
//
//  and, on the last leg, the journey home with its own "Fly home" cover.
//
//  There are no prices on any row. The trip is sold as a package, so the only
//  amount on this surface is the one total in the footer; a per-row price would
//  invite the user to audit a number that isn't separately payable.
//
//  Every mutating affordance here is a request to Kaira, not a drawer.
// ─────────────────────────────────────────────────────────────────────────────

// The design's own glyphs for the three modes it draws. Any other mode (bus,
// ferry, a two-wheeler) keeps its Font Awesome glyph from modeAccent, drawn in
// the same colour and size, rather than borrowing a plane or a car it isn't.
const PlaneGlyph = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" className="flex-none" aria-hidden>
    <path d="M17.8 19.2L16 11l3.5-3.5a2.1 2.1 0 00-3-3L13 8 4.8 6.2a.5.5 0 00-.5.8l3.5 3.5-2 2-2.3-.6a.5.5 0 00-.5.8L5 15l1.3 2.1a.5.5 0 00.8-.1l.6-2.3 2-2 3.5 3.5a.5.5 0 00.8-.5z" />
  </svg>
);

const RailGlyph = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden>
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3" />
    <circle cx="8" cy="15" r="1" />
    <circle cx="16" cy="15" r="1" />
  </svg>
);

const CarGlyph = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

function ModeGlyph({ modeKey, size, color }) {
  const key = getModeAccent(modeKey).key;
  if (key === "Flight") return <PlaneGlyph size={size} color={color} />;
  if (key === "Train") return <RailGlyph size={size} color={color} />;
  // Taxi only: a self-drive keeps modeAccent's steering wheel, which is also
  // what its detail sheet shows — who is driving is the whole distinction.
  if (key === "Taxi") return <CarGlyph size={size} color={color} />;
  const Icon = getModeAccent(modeKey).Icon;
  return Icon ? <Icon size={size} color={color} className="flex-none" aria-hidden /> : null;
}

/**
 * The taxi halves of a journey, under its transfer card — a green "✓" for a
 * half that is booked, a dashed chip that asks Kaira for one that isn't. The
 * chips come built from the view model; this only draws them.
 */
function TaxiChips({ chips, onChip, disabled }) {
  if (!chips?.length) return null;
  return (
    <div className="mt-[5px] flex flex-wrap gap-[5px]">
      {chips.map((chip) =>
        chip.tone === "add" ? (
          <button
            key={chip.label}
            type="button"
            onClick={() => onChip?.(chip)}
            disabled={disabled}
            style={T.chipAdd}
            className="px-[6px] py-[2px] font-mono text-[7.5px] font-[600] tracking-[0.06em] disabled:opacity-40"
          >
            {chip.label}
          </button>
        ) : (
          <span
            key={chip.label}
            style={T.chipIn}
            className="px-[6px] py-[2px] font-mono text-[7.5px] font-[600] tracking-[0.06em]"
          >
            {chip.label}
          </span>
        ),
      )}
    </div>
  );
}

/**
 * How you get into this city — flight, train, ferry, bus or car, or a COMBO of
 * them ("taxi to the airport, then fly").
 *
 * A combo shows one glyph per mode, chevron-separated. Showing only the first
 * leg's icon is an active misstatement, not a simplification: a taxi glyph on
 * a taxi+flight booking tells the traveller they are being driven the whole
 * way to another city.
 */
function TravelCard({ travel, onOpen, onChange, onChip, disabled }) {
  // De-duplicated by mode, in order — built with the journey in
  // lib/tripViewModel.js, so the detail sheet this card opens shows the same
  // run of glyphs rather than its own reading of the booking.
  const glyphKeys = travel.glyphKeys?.length ? travel.glyphKeys : [travel.modeKey];

  return (
    <div style={T.travelRow} className="flex items-center gap-[12px] px-[14px] py-[13px]">
      <span className="flex flex-none items-center gap-[3px]" aria-hidden>
        {glyphKeys.map((key, i) => (
          <React.Fragment key={`${key}-${i}`}>
            {i > 0 ? (
              <span className="text-[10px] leading-none text-[#8fa8dd]">›</span>
            ) : null}
            <ModeGlyph modeKey={key} size={20} color={T.TRANSFER_INK} />
          </React.Fragment>
        ))}
      </span>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpen}
          style={T.bare}
          className="block w-full p-0 text-left"
        >
          <div className="font-inter text-[12.5px] font-[700] text-[#0b1220]">
            {travel.title}
          </div>
          {travel.rowMeta ? (
            <div className="mt-[4px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
              {travel.rowMeta}
            </div>
          ) : null}
        </button>
        <TaxiChips chips={travel.chips} onChip={onChip} disabled={disabled} />
      </div>
      {!travel.isDraftLeg && (
        <button
          type="button"
          onClick={onChange}
          disabled={disabled}
          style={T.pillOnTint}
          className="flex-none px-[12px] py-[7px] font-mono text-[8.5px] font-[600] tracking-[0.06em] text-[#1a4fd6] disabled:opacity-40"
        >
          CHANGE
        </button>
      )}
    </div>
  );
}

/**
 * A leg of the route with nothing booked on it — the design's T6 card: the
 * transfer card's own tint, "TRANSFER NOT ADDED YET" in yellow, and any taxis
 * already bought for it still shown green.
 *
 * This is NOT the same thing as a row that hasn't loaded, and not the same
 * thing as an optional extra the traveller skipped: the trip says it goes from
 * one city to the next, and how is unanswered. A leg that silently disappears
 * reads as "handled", which is the one thing it isn't.
 */
function TravelGapCard({ gap, onAdd, disabled }) {
  const TransferIcon = getModeAccent("Transfer").Icon;
  return (
    <div style={T.travelRow} className="flex items-center gap-[12px] px-[14px] py-[13px]">
      <span
        className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full"
        style={{ background: "#ffffff", color: "#93a3bd" }}
        aria-hidden
      >
        {TransferIcon ? <TransferIcon size={13} color="currentColor" /> : null}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-inter text-[12.5px] font-[700] text-[#0b1220]">
          {gap.title}
        </div>
        <div className="mt-[4px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
          {gap.dateLabel ? `${gap.dateLabel} · ` : ""}
          <span
            className="font-[600] text-[#0b1220]"
            style={{ background: T.YELLOW, padding: "1px 5px", borderRadius: 3 }}
          >
            TRANSFER NOT ADDED YET
          </span>
        </div>
        <TaxiChips chips={gap.chips} />
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        style={T.pillOnTint}
        className="flex-none px-[12px] py-[7px] font-mono text-[8.5px] font-[600] tracking-[0.06em] text-[#1a4fd6] disabled:opacity-40"
      >
        ADD ›
      </button>
    </div>
  );
}

/**
 * The city in serif on its gradient — or "Fly home" on ink.
 */
function CityCover({ name, meta, tone, isHome }) {
  return (
    <div style={T.cover(tone, isHome)} className="flex items-center gap-[10px] px-[17px] py-[15px]">
      {/* No `truncate`: at line-height 1 its overflow clip cuts the serif's
          descenders and italic overhang ("Fly home" loses the tail of its y). */}
      <span
        className="ttw-type-serif min-w-0 text-[23px] leading-none text-white"
        style={{ letterSpacing: "normal" }}
      >
        {name}
      </span>
      <span
        className="ml-auto flex-none font-mono text-[8.5px] tracking-[0.12em]"
        style={{ color: "rgba(255,255,255,.8)" }}
      >
        {meta}
      </span>
      {isHome ? (
        <span className="flex-none text-[20px] leading-none" aria-hidden>
          ✈️
        </span>
      ) : null}
    </div>
  );
}

/** Where you sleep — or the gap where a stay should be. */
function StayCard({ stay, tone, showGap, gapMeta, cityName, onOpen, onChange, disabled }) {
  if (showGap) {
    return (
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        style={T.dashed}
        className="flex w-full items-center gap-[10px] p-[12px] text-left disabled:opacity-40"
      >
        <div
          className="h-[30px] w-[30px] flex-none"
          style={{ border: "1.5px dashed #cfd3da", borderRadius: 7 }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-inter text-[12.5px] font-[700] text-[#0b1220]">
            Add a stay
          </div>
          <div className="mt-[4px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
            {gapMeta || `IN ${cityName.toUpperCase()}`}
          </div>
        </div>
        <span className="flex-none font-mono text-[8.5px] tracking-[0.06em] text-[#6b7280]">
          ASK KAIRA ›
        </span>
      </button>
    );
  }

  if (!stay) return null;

  return (
    <div style={T.stayCard(tone)} className="flex items-center gap-[10px] px-[12px] py-[11px]">
      {/* A plain <img>, deliberately — NOT the shared <ImageLoader>. Its
          react-lazyload listens for scroll on the WINDOW (so a thumbnail in a
          nested scroller never loads), and its styled-components are declared
          inside render (so every re-render remounts and re-fetches the image).
          `loading` is native and understands the scroller it is actually in.

          The two inline resets are load-bearing: styles.css and Bootstrap both
          set bare `img {}` rules with margins and `max-width`, which otherwise
          push this out of the row. */}
      <div
        className="h-[42px] w-[42px] flex-none overflow-hidden"
        style={{ borderRadius: 10, background: "#eef0f4" }}
      >
        {stay.imageUrl ? (
          <img
            src={stay.imageUrl}
            alt=""
            width={42}
            height={42}
            loading="lazy"
            decoding="async"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              margin: 0,
              maxWidth: "none",
            }}
          />
        ) : null}
      </div>
      <button
        type="button"
        onClick={onOpen}
        style={T.bare}
        className="min-w-0 flex-1 p-0 text-left"
      >
        <div className="font-inter text-[12.5px] font-[700] text-[#0b1220]">
          {stay.name}
        </div>
        {stay.meta ? (
          <div className="mt-[4px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
            {stay.meta}
          </div>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        style={T.pill}
        className="flex-none px-[11px] py-[6px] font-mono text-[8.5px] tracking-[0.06em] text-[#6b7280] disabled:opacity-40"
      >
        CHANGE
      </button>
    </div>
  );
}

/**
 * The car this day is driven around in, as one quiet line of its day card —
 * glyph and fact, nothing else. The booking's own name ("Sedan, 8h") and its
 * dates are in the sheet it opens; on the card the only thing the traveller is
 * checking is whether a car is there.
 */
function DayTaxiRow({ taxis, onOpen }) {
  if (!taxis.length) return null;
  return (
    <button
      type="button"
      onClick={() => onOpen?.(taxis[0])}
      style={T.dayCardRow}
      className="flex w-full items-center gap-[9px] px-[13px] py-[10px] text-left"
    >
      {/* Green, like every other "this is in your package" mark on the
          surface (the ✓ chips) — it states a fact, it doesn't ask for
          anything. */}
      <span className="flex-none" style={{ color: T.GREEN }} aria-hidden>
        <ModeGlyph modeKey={taxis[0].modeKey} size={16} color="currentColor" />
      </span>
      <span
        className="min-w-0 flex-1 font-inter text-[12px] font-[600]"
        style={{ color: T.GREEN }}
      >
        {taxis.length > 1 ? "Sightseeing taxis included" : "Sightseeing taxi included"}
      </span>
    </button>
  );
}

/**
 * A car booked inside the city that lands on no day of it — the fallback row,
 * so a booking never renders nowhere. Tapping it opens the booking, whose
 * sheet is where it is changed or removed.
 */
function TaxiCard({ extra, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      style={T.taxiCard}
      className="flex w-full items-center gap-[10px] px-[12px] py-[11px] text-left"
    >
      <span
        className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full"
        style={{ background: T.PAPER_2, color: "#445069" }}
        aria-hidden
      >
        <ModeGlyph modeKey={extra.modeKey} size={13} color="currentColor" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-inter text-[12.5px] font-[700] text-[#0b1220]">
          {extra.name}
        </div>
        {extra.meta ? (
          <div className="mt-[4px] font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
            {extra.meta}
          </div>
        ) : null}
      </div>
      <span
        style={T.chipIn}
        className="flex-none px-[6px] py-[3px] font-mono text-[8px] tracking-[0.07em]"
      >
        ✓ INCLUDED
      </span>
    </button>
  );
}

/**
 * An activity on the day card.
 *
 * `included` is an activity that is in the package: the city's colour strip,
 * its pickup chip, "✓ INCLUDED". An activity that isn't (yet) — the cart hasn't
 * priced, which happens on every reprice, or it isn't selected — keeps the same
 * row without those claims. Dropping it would leave its day reading "at
 * leisure" while it is plainly planned.
 *
 * The row is a plain container, not a button: the "NO PICKUP · ADD ›" chip is
 * a button of its own, and a button inside a button (or a role="button") is
 * nested interactive content. The photo and the text column are the open
 * target instead, the way TravelCard pairs its title button with its chips.
 */
function ActivityRow({ item, tone, included, disabled, onOpen, onAddPickup }) {
  const tod = item.timeOfDay ? String(item.timeOfDay).toUpperCase() : null;
  const rest = [item.durationLabel, item.rating ? `${item.rating}★` : null, item.category]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

  return (
    <div
      style={included ? T.paidRow(tone) : T.dayCardRow}
      className={`flex items-center gap-[10px] py-[10px] pr-[13px] ${
        included ? "pl-[10px]" : "pl-[13px]"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        style={T.bare}
        className="h-[38px] w-[38px] flex-none p-0"
        aria-label={item.name}
      >
        <span
          className="block h-full w-full"
          style={{
            borderRadius: 8,
            background: item.imageUrl
              ? `#eef0f4 center/cover no-repeat url("${item.imageUrl}")`
              : "#eef0f4",
          }}
        />
      </button>
      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={onOpen}
          style={T.bare}
          className="block w-full truncate p-0 text-left font-inter text-[12.5px] font-[700] text-[#0b1220]"
        >
          {item.name}
        </button>
        <div className="mt-[4px] flex flex-wrap items-center gap-[5px]">
          {tod ? (
            <span
              style={T.chipTod}
              className="px-[6px] py-[2px] font-mono text-[7.5px] font-[600] tracking-[0.08em]"
            >
              {tod}
            </span>
          ) : null}
          {/* Only an explicit answer from an included booking earns a pickup
              chip. */}
          {included && item.pickup === true ? (
            <span
              style={T.chipIn}
              className="px-[6px] py-[2px] font-mono text-[7.5px] font-[600] tracking-[0.06em]"
            >
              ✓ HOTEL PICKUP
            </span>
          ) : null}
          {included && item.pickup === false ? (
            <button
              type="button"
              onClick={() => onAddPickup?.()}
              disabled={disabled}
              style={T.chipAdd}
              className="px-[6px] py-[2px] font-mono text-[7.5px] font-[600] tracking-[0.06em] disabled:opacity-40"
            >
              NO PICKUP · ADD ›
            </button>
          ) : null}
          {rest ? (
            <span className="font-mono text-[7.5px] tracking-[0.06em] text-[#8a93a6]">
              {rest}
            </span>
          ) : null}
        </div>
      </div>
      {included ? (
        <span
          style={T.chipIn}
          className="flex-none px-[6px] py-[3px] font-mono text-[8px] tracking-[0.07em]"
        >
          ✓ INCLUDED
        </span>
      ) : null}
    </div>
  );
}

/**
 * Kaira's whisper under a day: the free places and meals planned around it, in
 * one serif line. "All free, no booking" is only true of those two kinds, so an
 * activity that isn't in the cart stays out of it — it is in the full day.
 */
const whisperFor = (day, activityCount) => {
  const recos = day.items.filter(
    (x) => (x.kind === "poi" || x.kind === "food") && x.name,
  );
  if (!recos.length) return null;
  const lead = activityCount
    ? "Around it: "
    : day.dayNumber === "01"
      ? "Ease in: "
      : "Go see: ";
  const parts = recos.map((x) => (x.kind === "food" ? `eat at ${x.name}` : x.name));
  return `${lead}${parts.join(", ")} · all free, no booking.`;
};

/** One day of the trip, as its own card. */
function DayCard({
  day,
  tone,
  taxis = [],
  changed,
  disabled,
  onOpen,
  onOpenItem,
  onOpenTaxi,
  onAddToDay,
  onAddPickup,
}) {
  // Included activities first, then any the cart hasn't confirmed.
  const activities = [
    ...day.items.filter((x) => x.kind === "booked"),
    ...day.items.filter((x) => x.kind === "activity"),
  ];
  const whisper = whisperFor(day, activities.length);
  const isTravel = !!day.isTravelDay;

  return (
    <div style={T.dayCard(tone)}>
      <button
        type="button"
        onClick={onOpen}
        style={T.bare}
        className="flex w-full items-center gap-[11px] px-[13px] pb-[10px] pt-[12px] text-left"
      >
        <span
          className="grid h-[36px] w-[36px] flex-none place-items-center"
          style={{ borderRadius: 10, background: T.PAPER_2 }}
        >
          <span
            className="ttw-type-serif text-[19px] leading-none text-[#0b1220]"
            style={{ letterSpacing: "normal" }}
          >
            {day.dayNumber}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-inter text-[13px] font-[700] text-[#0b1220]">
            {day.title || "Free day"}
          </div>
          <div className="mt-[3px] font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]">
            {day.dateMeta}
          </div>
        </div>
        {/* The day Kaira just touched. On a scroll this long a change made in
            the chat otherwise lands invisibly. */}
        {changed ? (
          <span
            className="flex-none px-[6px] py-[3px] font-mono text-[8px] tracking-[0.08em]"
            style={{ background: T.INK, color: "#ffffff", borderRadius: 3 }}
          >
            CHANGED
          </span>
        ) : null}
        <span className="flex-none font-mono text-[8px] tracking-[0.06em] text-[#8a93a6]">
          FULL DAY ›
        </span>
      </button>

      {activities.map((item, idx) => (
        <ActivityRow
          key={item.id || `${item.name}-${idx}`}
          item={item}
          tone={tone}
          included={item.kind === "booked"}
          disabled={disabled}
          onOpen={() => onOpenItem?.(item)}
          onAddPickup={() => onAddPickup?.(item)}
        />
      ))}

      {activities.length === 0 && !isTravel ? (
        <button
          type="button"
          onClick={onAddToDay}
          disabled={disabled}
          style={{
            ...T.leisure,
            width: "calc(100% - 26px)",
            boxSizing: "border-box",
            margin: "2px 13px 4px",
          }}
          className="flex items-center gap-[9px] px-[11px] py-[9px] text-left disabled:opacity-40"
        >
          <span className="flex-none text-[13px] text-[#6b7280]">+</span>
          <span className="min-w-0 flex-1 font-inter text-[11.5px] font-[600] text-[#6b7280]">
            Day at leisure · ask Kaira
          </span>
          <span className="flex-none font-mono text-[8px] tracking-[0.06em] text-[#8a93a6]">
            3 FIT ›
          </span>
        </button>
      ) : null}

      {/* The day's car, under the plan and above Kaira's suggestions. */}
      <DayTaxiRow taxis={taxis} onOpen={onOpenTaxi} />

      {whisper ? (
        <button
          type="button"
          onClick={onOpen}
          style={T.dayCardRow}
          className="flex gap-[9px] px-[13px] pb-[13px] pt-[11px] text-left"
        >
          <span
            className="mt-[1px] block h-[20px] w-[20px] flex-none rounded-full"
            style={{ background: '#cfe4f0 center/cover no-repeat url("/KairaInsta.png")' }}
            aria-hidden
          />
          <span className="block min-w-0 flex-1">
            <span
              className="ttw-type-serif block truncate text-[13.5px] text-[#445069]"
              style={{ letterSpacing: "normal", lineHeight: 1.5 }}
            >
              {whisper}
            </span>
            <span className="mt-[5px] block font-mono text-[8px] tracking-[0.06em] text-[#0b1220]">
              PLAN ›
            </span>
          </span>
        </button>
      ) : null}

      {/* The fly-home day: no leisure invitation. It says "nothing planned"
          only when that is true. */}
      {isTravel && activities.length === 0 && !whisper ? (
        <div
          style={{ borderTop: `1px solid ${T.HAIRLINE}` }}
          className="px-[13px] py-[10px] font-mono text-[8px] tracking-[0.07em] text-[#8a93a6]"
        >
          TRAVEL DAY · NOTHING PLANNED
        </div>
      ) : null}
    </div>
  );
}

export default function LegSection({
  leg,
  disabled,
  // The key of the day Kaira's last change landed on, or null.
  changedDayKey = null,
  onChangeStay,
  onChangeTravel,
  onAddTravel,
  onOpenTravel,
  onOpenStay,
  onOpenDay,
  onOpenDayItem,
  onAddToDay,
  onAddActivityPickup,
  onAddTaxi,
  onAddJourneyTaxi,
  onOpenExtra,
  onChangeReturn,
  onAddReturn,
}) {
  const hasReturn = !!(leg.outboundTravel || leg.outboundGap);

  // The cars booked inside this city. Each one belongs to the day (or days) it
  // runs on — `dates` is its check-in → check-out range, so a multi-day hire
  // appears on each of them.
  //
  // The airport/station pickup and drop are not here at all: each belongs to a
  // journey, and the transfer card already states it ("✓ PICKUP & DROP
  // INCLUDED"), which is where the design puts it too.
  const cityTaxis = leg.extras.filter((x) => !x.airportRole);
  const taxisOn = (day) =>
    cityTaxis.filter((x) => day.date && (x.dates || []).includes(day.date));
  // A car whose dates land on no day of this city still has to appear
  // somewhere — a booking that renders nowhere reads as one that isn't there.
  const strandedTaxis = cityTaxis.filter(
    (x) => !leg.days.some((day) => day.date && (x.dates || []).includes(day.date)),
  );

  return (
    // `leading-[normal]`: the design sets no line-height, and Bootstrap's body
    // 1.5 would otherwise open up every one of these small mono lines.
    <section id={leg.anchor} className="flex flex-col gap-[11px] leading-[normal]">
      {leg.inboundTravel ? (
        <TravelCard
          travel={leg.inboundTravel}
          disabled={disabled}
          onOpen={() => onOpenTravel?.(leg, leg.inboundTravel)}
          onChange={() => onChangeTravel?.(leg)}
          onChip={(chip) => onAddJourneyTaxi?.(leg, leg.inboundTravel, chip, false)}
        />
      ) : leg.travelGap ? (
        <TravelGapCard
          gap={leg.travelGap}
          disabled={disabled}
          onAdd={() => onAddTravel?.(leg)}
        />
      ) : null}

      <CityCover name={leg.city} meta={leg.coverMeta} tone={leg.tone} />

      <StayCard
        stay={leg.stay}
        tone={leg.tone}
        showGap={leg.showStayGap}
        gapMeta={leg.stayGapMeta}
        cityName={leg.city}
        disabled={disabled}
        onOpen={() => onOpenStay?.(leg)}
        onChange={() => onChangeStay?.(leg)}
      />

      {strandedTaxis.map((x) => (
        <TaxiCard
          key={x.bookingId || x.name}
          extra={x}
          onOpen={() => onOpenExtra?.(leg, x)}
        />
      ))}

      {leg.days.map((day) => (
        <DayCard
          key={day.key}
          day={day}
          tone={leg.tone}
          taxis={taxisOn(day)}
          disabled={disabled}
          changed={!!changedDayKey && day.key === changedDayKey}
          onOpen={() => onOpenDay?.(leg, day)}
          onOpenItem={(item) => onOpenDayItem?.(leg, day, item)}
          onOpenTaxi={(taxi) => onOpenExtra?.(leg, taxi)}
          onAddToDay={() => onAddToDay?.(leg, day)}
          onAddPickup={(item) => onAddActivityPickup?.(leg, item)}
        />
      ))}

      {/* "Add taxi in …" stands for whichever car this city is still missing —
          the airport pickup, the airport drop, the sightseeing car — so it goes
          only once there is nothing left to add. `taxiSlots.complete` is that
          question answered in the view model, where it can also tell that a
          city reached and left by road can hold no airport pair at all. */}
      {(leg.days.length > 0 || leg.extras.length > 0) && !leg.taxiSlots?.complete ? (
        <button
          type="button"
          onClick={() => onAddTaxi?.(leg)}
          disabled={disabled}
          style={T.dashed}
          className="flex w-full items-center justify-center gap-[8px] p-[11px] disabled:opacity-40"
        >
          <span className="text-[13px] text-[#6b7280]">+</span>
          <span className="font-inter text-[11.5px] font-[600] text-[#6b7280]">
            Add taxi in {leg.city}
          </span>
        </button>
      ) : null}

      {/* ── Flying home ────────────────────────────────────────────────────
          The return journey is folded onto the last stop by the view model,
          but it is not part of that city — it is how the trip ENDS. The design
          draws it as a leg of its own: the journey, then a "Fly home" cover. */}
      {leg.outboundTravel ? (
        <TravelCard
          travel={leg.outboundTravel}
          disabled={disabled}
          onOpen={() => onOpenTravel?.(leg, leg.outboundTravel)}
          onChange={() => onChangeReturn?.(leg)}
          onChip={(chip) => onAddJourneyTaxi?.(leg, leg.outboundTravel, chip, true)}
        />
      ) : leg.outboundGap ? (
        <TravelGapCard
          gap={leg.outboundGap}
          disabled={disabled}
          onAdd={() => onAddReturn?.(leg)}
        />
      ) : null}
      {hasReturn ? <CityCover name="Fly home" meta={leg.homeCoverMeta} isHome /> : null}
    </section>
  );
}
