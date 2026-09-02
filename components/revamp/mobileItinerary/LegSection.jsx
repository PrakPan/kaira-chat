import React from "react";
import * as T from "./designTokens";
import getModeAccent from "../common/components/bookingDetail/modeAccent";

// ─────────────────────────────────────────────────────────────────────────────
//  One leg of the trip: how you arrive, where you sleep, what each day holds.
//
//  There are no prices on any row. The trip is sold as a package, so the only
//  amount on this surface is the one total in the footer; a per-row price would
//  invite the user to audit a number that isn't separately payable.
//
//  Every mutating affordance here is a request to Kaira, not a drawer.
// ─────────────────────────────────────────────────────────────────────────────

// Only the GLYPH varies by mode — the row keeps the design's one transfer
// colour for every mode. Hardcoding a plane put one on trains, buses and
// ferries ("London Kings Cross → Edinburgh" is a train), but tinting each mode
// with its own accent is equally wrong here: the design draws every travel row
// in the same blue, so the colour says "transfer", not "which transfer".
const TRAVEL_INK = "#1a4fd6";
const modeIconFor = (modeKey) => getModeAccent(modeKey).Icon;


const Chevron = () => (
  <span className="flex-none text-[14px] leading-none text-[#b8becc]" aria-hidden>
    ›
  </span>
);

/**
 * Arrival into this city — flight, train, ferry, bus or car, or a COMBO of
 * them ("taxi to the airport, then fly").
 *
 * A combo shows one glyph per leg, chevron-separated. Showing only the first
 * leg's icon is an active misstatement, not a simplification: a taxi glyph on
 * a taxi+flight booking tells the traveller they are being driven the whole
 * way to another city.
 */
function TravelRow({ travel, cityName, onOpen, onChange, disabled }) {
  // De-duplicated by mode, in order — built with the journey in
  // lib/tripViewModel.js, so the detail sheet this row opens shows the same
  // run of glyphs rather than its own reading of the booking.
  const glyphKeys = travel.glyphKeys?.length
    ? travel.glyphKeys
    : [travel.modeKey];

  return (
    <div
      style={T.travelRow}
      className="flex items-center gap-[13px] px-[14px] py-[14px]"
    >
      <span className="flex flex-none items-center gap-[3px]" aria-hidden>
        {glyphKeys.map((key, i) => {
          const ModeIcon = modeIconFor(key);
          if (!ModeIcon) return null;
          return (
            <React.Fragment key={`${key}-${i}`}>
              {i > 0 ? (
                <span className="text-[10.5px] leading-none text-[#8fa8dd]">›</span>
              ) : null}
              <ModeIcon size={22} color={TRAVEL_INK} />
            </React.Fragment>
          );
        })}
      </span>
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
      >
        <div className="truncate font-inter text-[13.5px] font-[700] text-[#0b1220]">
          {travel.title || cityName}
        </div>
        {travel.meta ? (
          <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
            {travel.meta}
          </div>
        ) : null}
      </button>
      {!travel.isDraftLeg && (
        <button
          type="button"
          onClick={onChange}
          disabled={disabled}
          style={T.pillOnTint}
          className="flex-none px-[12px] py-[7px] font-mono text-[10px] font-[600] tracking-[0.06em] text-[#1a4fd6] disabled:opacity-40"
        >
          CHANGE
        </button>
      )}
    </div>
  );
}

/**
 * The leg of the route with nothing booked on it.
 *
 * This is NOT the same thing as a row that hasn't loaded, and not the same
 * thing as an optional extra the traveller skipped: the trip says it goes from
 * one city to the next, and how is unanswered. So it takes the travel row's
 * shape and says so plainly, rather than being left out — a leg that silently
 * disappears reads as "handled", which is the one thing it isn't.
 */
function TravelGapRow({ meta, onAdd, disabled }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      disabled={disabled}
      style={T.travelGapRow}
      className="flex w-full items-center gap-[13px] px-[14px] py-[14px] text-left disabled:opacity-40"
    >
      <span className="flex flex-none items-center text-[#b67b10]" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4.5 2.8 20h18.4L12 4.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-inter text-[13.5px] font-[700] text-[#5c4405]">
          No transfer added
        </span>
        {meta ? (
          <span className="mt-[4px] block truncate font-mono text-[10px] tracking-[0.06em] text-[#9c7a22]">
            {meta}
          </span>
        ) : null}
      </span>
      {/* A span, not a button: the whole row is the target, and a button inside
          a button is invalid markup that Safari resolves by dropping one. */}
      <span
        style={T.pillOnAmber}
        className="flex-none px-[12px] py-[7px] font-mono text-[10px] font-[600] tracking-[0.06em] text-[#b67b10]"
      >
        + ADD
      </span>
    </button>
  );
}

/** Where you sleep — or the gap where a stay should be. */
function StayRow({ stay, showGap, gapMeta, cityName, onOpen, onChange, disabled }) {
  if (showGap) {
    return (
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        style={T.dashed}
        className="flex w-full items-center gap-[11px] p-[13px] text-left disabled:opacity-40"
      >
        <div className="h-[32px] w-[32px] flex-none rounded-[7px] border-[1.5px] border-dashed border-[#cfd3da]" />
        <div className="min-w-0 flex-1">
          <div className="font-inter text-[13.5px] font-[700] text-[#0b1220]">
            Add a stay
          </div>
          <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
            {gapMeta || `IN ${cityName.toUpperCase()}`}
          </div>
        </div>
        <span className="flex-none font-mono text-[10px] tracking-[0.06em] text-[#6b7280]">
          ASK KAIRA ›
        </span>
      </button>
    );
  }

  if (!stay) return null;

  return (
    <div style={T.card}
      className="flex items-center gap-[11px] px-[12px] py-[12px]">
      {/* ── The hotel thumbnail ──────────────────────────────────────────
          A plain <img>, deliberately — NOT the shared <ImageLoader>, which
          could not load on this surface:

           • It wraps every image in react-lazyload, which listens for SCROLL
             ON THE WINDOW. This page's scroller is a nested pane (the window
             never scrolls), so after the one check it makes when it mounts,
             nothing ever re-checks: a thumbnail below the fold stayed an empty
             grey box no matter how far you scrolled.
           • Its styled-components are declared INSIDE its render, so every
             re-render is a new component type — React unmounts and remounts
             the <img>, which is what made the ones that did load flicker and
             re-fetch on every trip update.

          None of that machinery buys anything for a 42px thumbnail. `loading`
          is the native attribute, which — unlike the library — understands the
          scroll container it is actually in.

          The two inline resets are load-bearing: styles.css and Bootstrap both
          set bare `img {}` rules with margins and `max-width`, which otherwise
          push this out of the row. */}
      <div className="h-[46px] w-[46px] flex-none overflow-hidden rounded-[10px] bg-[#eef0f4]">
        {stay.imageUrl ? (
          <img
            src={stay.imageUrl}
            alt=""
            width={46}
            height={46}
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
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
      >
        <div className="truncate font-inter text-[13.5px] font-[700] text-[#0b1220]">
          {stay.name}
        </div>
        {stay.meta ? (
          <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
            {stay.meta}
          </div>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        style={T.pill}
        className="flex-none px-[11px] py-[6px] font-mono text-[10px] tracking-[0.06em] text-[#6b7280] disabled:opacity-40"
      >
        CHANGE
      </button>
    </div>
  );
}

/** A day, collapsed to what it costs you in attention: what's booked, what's loose. */
function DayRow({ day, onOpen, changed }) {
  const freeParts = [
    day.freeIdeaCount ? `${day.freeIdeaCount} IDEAS` : null,
    day.mealCount ? `${day.mealCount} ${day.mealCount === 1 ? "MEAL" : "MEALS"}` : null,
  ].filter(Boolean);

  const freeLabel =
    freeParts.length > 0
      ? freeParts.join(" · ")
      : day.paidActivityCount
        ? ""
        : "NOTHING ELSE PLANNED";

  return (
    <button
      type="button"
      onClick={onOpen}
      style={T.dayRow}
      className="flex w-full items-center gap-[12px] px-[12px] py-[12px] text-left"
    >
      {/* The trip's day INDEX in serif, as the design draws it — "01", "02".
          Fixed width so the title column stays aligned all the way down; a
          ragged left edge on a list this long reads as broken. */}
      <span className="flex w-[28px] flex-none items-center justify-center">
        <span className="ttw-type-serif text-[21px] leading-none text-[#0b1220]">
          {day.dayNumber}
        </span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <div className="truncate font-inter text-[13.5px] font-[700] text-[#0b1220]">
          {day.title || "Free day"}
        </div>
        <div className="flex items-center gap-[7px]">
          {day.paidActivityCount > 0 && (
            <span className="flex-none rounded-[4px] bg-[#f7e700] px-[8px] py-[4px] font-mono text-[10px] font-[600] tracking-[0.07em] text-[#0b1220]">
              {day.paidActivityCount === 1
                ? "1 PAID ACTIVITY"
                : `${day.paidActivityCount} PAID ACTIVITIES`}
            </span>
          )}
          {freeLabel ? (
            <span className="truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
              {freeLabel}
            </span>
          ) : null}
        </div>
      </div>
      {/* The day Kaira just touched. On a scroll this long a change made in
          the chat otherwise lands invisibly — the badge is what lets the user
          confirm the thing they asked for happened HERE. */}
      {changed ? (
        <span
          style={{
            border: "1px solid #0b1220",
            borderRadius: 3,
            background: "#f7e700",
            boxShadow: "none",
          }}
          className="flex-none px-[6px] py-[3px] font-mono text-[9.5px] tracking-[0.07em] text-[#0b1220]"
        >
          CHANGED
        </span>
      ) : null}
      <Chevron />
    </button>
  );
}

/**
 * The city's taxi, as the last row of the day list.
 *
 * A booked intracity car is a JOURNEY, not an extra you bolted on, so it takes
 * the arrival row's tint and glyph — the same blue every travel row on this
 * surface is drawn in — rather than the white card with a BOOKED tag it used
 * to get. It also earns a CHANGE, for the same reason every other booked row
 * has one: "BOOKED" states a fact and then offers nothing to do about it.
 *
 * The glyph sits in a 28px slot so its title lines up with the day titles
 * above, which are offset by the serif day number.
 */
function TaxiRow({ extra, onOpen, onChange, disabled }) {
  const TaxiIcon = modeIconFor(extra.modeKey);

  return (
    <div
      style={T.taxiRow}
      className="flex w-full items-center gap-[12px] px-[12px] py-[11px]"
    >
      <span
        className="flex w-[28px] flex-none items-center justify-center"
        aria-hidden
      >
        {TaxiIcon ? <TaxiIcon size={19} color={TRAVEL_INK} /> : null}
      </span>
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
      >
        <div className="truncate font-inter text-[13.5px] font-[700] text-[#0b1220]">
          {extra.name}
        </div>
        {extra.meta ? (
          <div className="mt-[4px] truncate font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
            {extra.meta}
          </div>
        ) : null}
      </button>
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        style={T.pillOnTint}
        className="flex-none px-[12px] py-[7px] font-mono text-[10px] font-[600] tracking-[0.06em] text-[#1a4fd6] disabled:opacity-40"
      >
        CHANGE
      </button>
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
  onAddTaxi,
  onOpenExtra,
  onChangeExtra,
  onChangeReturn,
  onAddReturn,
}) {
  return (
    <section id={leg.anchor} className="flex flex-col gap-[12px]">
      {/* Eyebrow — leg number, city, dates */}
      <div className="flex items-center gap-[8px] pt-[3px]">
        <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-[#8a93a6]">
          {leg.eyebrow}
        </span>
        <div className="h-px flex-1 bg-[#e6e8ec]" />
        <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-[#8a93a6]">
          {leg.datesLabel}
        </span>
      </div>

      {leg.inboundTravel ? (
        <TravelRow
          travel={leg.inboundTravel}
          cityName={leg.city}
          disabled={disabled}
          onOpen={() => onOpenTravel?.(leg, leg.inboundTravel)}
          onChange={() => onChangeTravel?.(leg)}
        />
      ) : leg.travelGap ? (
        <TravelGapRow
          meta={leg.travelGap.meta}
          disabled={disabled}
          onAdd={() => onAddTravel?.(leg)}
        />
      ) : null}

      <StayRow
        stay={leg.stay}
        showGap={leg.showStayGap}
        gapMeta={leg.stayGapMeta}
        cityName={leg.city}
        disabled={disabled}
        onOpen={() => onOpenStay?.(leg)}
        onChange={() => onChangeStay?.(leg)}
      />

      {/* The days, and under them the ONE taxi slot for this city.
          `leg.extras` is intracity taxis — the sightseeing car, the day-hire —
          which is exactly what "Add taxi in …" offers to book. So they are the
          same slot in two states, and rendering the taxi as a card above the
          list while the empty invitation sat below it asked the reader to work
          out that the two were about the same thing.
          The box renders for a leg with taxis but no days too — otherwise the
          booking would have nowhere left to appear. */}
      {(leg.days.length > 0 || leg.extras.length > 0) && (
        <div style={T.dayList}>
          {leg.days.map((day) => (
            <DayRow
              key={day.key}
              day={day}
              changed={!!changedDayKey && day.key === changedDayKey}
              onOpen={() => onOpenDay?.(leg, day)}
            />
          ))}
          {leg.extras.length > 0 ? (
            leg.extras.map((x) => (
              <TaxiRow
                key={x.bookingId || x.name}
                extra={x}
                disabled={disabled}
                onOpen={() => onOpenExtra?.(leg, x)}
                onChange={() => onChangeExtra?.(leg, x)}
              />
            ))
          ) : (
            <button
              type="button"
              onClick={() => onAddTaxi?.(leg)}
              disabled={disabled}
              style={T.addRow}
              className="flex w-full items-center gap-[8px] px-[12px] py-[11px] text-left disabled:opacity-40"
            >
              <span className="text-[14px] leading-none text-[#6b7280]">+</span>
              <span className="font-inter text-[12.5px] font-[600] text-[#6b7280]">
                Add taxi in {leg.city}
              </span>
            </button>
          )}
        </div>
      )}

      {/* ── Flying home ────────────────────────────────────────────────────
          The return journey is folded onto the last stop by the view model,
          but it is not part of that city — it is how the trip ENDS. The design
          gives it its own block, with its own rule, after everything else. */}
      {leg.outboundTravel || leg.outboundGap ? (
        <>
          <div className="flex items-center gap-[8px] pt-[3px]">
            <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-[#8a93a6]">
              {`FLY HOME${
                (leg.outboundTravel || leg.outboundGap).destName
                  ? ` · ${(leg.outboundTravel || leg.outboundGap).destName.toUpperCase()}`
                  : ""
              }`}
            </span>
            <div className="h-px flex-1 bg-[#e6e8ec]" />
            <span className="flex-none font-mono text-[10.5px] tracking-[0.08em] text-[#8a93a6]">
              {leg.outboundTravel?.departLabel || ""}
            </span>
          </div>
          {leg.outboundTravel ? (
            <TravelRow
              travel={leg.outboundTravel}
              cityName={leg.outboundTravel.destName || leg.city}
              disabled={disabled}
              onOpen={() => onOpenTravel?.(leg, leg.outboundTravel)}
              onChange={() => onChangeReturn?.(leg)}
            />
          ) : (
            <TravelGapRow
              meta={leg.outboundGap.meta}
              disabled={disabled}
              onAdd={() => onAddReturn?.(leg)}
            />
          )}
        </>
      ) : null}
    </section>
  );
}
