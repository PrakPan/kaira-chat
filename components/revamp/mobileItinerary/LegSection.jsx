import React from "react";
import ImageLoader from "../../ImageLoader";
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
  <span className="flex-none text-[13px] leading-none text-[#b8becc]" aria-hidden>
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
  // De-duplicated by mode, in order: a taxi-flight-taxi combo is a plane
  // journey with transfers either end, and drawing the car twice says nothing
  // the first one didn't.
  const glyphKeys = (() => {
    if (!travel.segments || travel.segments.length < 2) return [travel.modeKey];
    const seen = new Set();
    const keys = [];
    for (const seg of travel.segments) {
      const k = seg.modeKey || null;
      if (k && !seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }
    return keys.length ? keys : [travel.modeKey];
  })();

  return (
    <div
      style={T.travelRow}
      className="flex items-center gap-[12px] px-[14px] py-[13px]"
    >
      <span className="flex flex-none items-center gap-[3px]" aria-hidden>
        {glyphKeys.map((key, i) => {
          const ModeIcon = modeIconFor(key);
          if (!ModeIcon) return null;
          return (
            <React.Fragment key={`${key}-${i}`}>
              {i > 0 ? (
                <span className="text-[9px] leading-none text-[#8fa8dd]">›</span>
              ) : null}
              <ModeIcon size={20} color={TRAVEL_INK} />
            </React.Fragment>
          );
        })}
      </span>
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
      >
        <div className="truncate font-inter text-[12.5px] font-[700] text-[#0b1220]">
          {travel.title || cityName}
        </div>
        {travel.meta ? (
          <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
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
          className="flex-none px-[12px] py-[7px] font-mono text-[8.5px] font-[600] tracking-[0.06em] text-[#1a4fd6] disabled:opacity-40"
        >
          CHANGE
        </button>
      )}
    </div>
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
        className="flex w-full items-center gap-[10px] p-[12px] text-left disabled:opacity-40"
      >
        <div className="h-[30px] w-[30px] flex-none rounded-[7px] border-[1.5px] border-dashed border-[#cfd3da]" />
        <div className="min-w-0 flex-1">
          <div className="font-inter text-[12.5px] font-[700] text-[#0b1220]">
            Add a stay
          </div>
          <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
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
    <div style={T.card}
      className="flex items-center gap-[10px] px-[12px] py-[11px]">
      <div className="h-[42px] w-[42px] flex-none overflow-hidden rounded-[10px] bg-[#eef0f4]">
        {stay.imageKey ? (
          <ImageLoader
            url={stay.imageKey}
            dimensions={{ width: 84, height: 84 }}
            alt=""
          />
        ) : null}
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
      >
        <div className="truncate font-inter text-[12.5px] font-[700] text-[#0b1220]">
          {stay.name}
        </div>
        {stay.meta ? (
          <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
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
      className="flex w-full items-center gap-[11px] px-[12px] py-[11px] text-left"
    >
      {/* The trip's day INDEX in serif, as the design draws it — "01", "02".
          Fixed width so the title column stays aligned all the way down; a
          ragged left edge on a list this long reads as broken. */}
      <span className="flex w-[26px] flex-none items-center justify-center">
        <span className="ttw-type-serif text-[20px] leading-none text-[#0b1220]">
          {day.dayNumber}
        </span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <div className="truncate font-inter text-[12.5px] font-[700] text-[#0b1220]">
          {day.title || "Free day"}
        </div>
        <div className="flex items-center gap-[7px]">
          {day.paidActivityCount > 0 && (
            <span className="flex-none rounded-[4px] bg-[#f7e700] px-[8px] py-[4px] font-mono text-[8.5px] font-[600] tracking-[0.07em] text-[#0b1220]">
              {day.paidActivityCount === 1
                ? "1 PAID ACTIVITY"
                : `${day.paidActivityCount} PAID ACTIVITIES`}
            </span>
          )}
          {freeLabel ? (
            <span className="truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
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
          className="flex-none px-[6px] py-[3px] font-mono text-[8px] tracking-[0.07em] text-[#0b1220]"
        >
          CHANGED
        </span>
      ) : null}
      <Chevron />
    </button>
  );
}

export default function LegSection({
  leg,
  disabled,
  // The key of the day Kaira's last change landed on, or null.
  changedDayKey = null,
  onChangeStay,
  onChangeTravel,
  onOpenTravel,
  onOpenStay,
  onOpenDay,
  onAddTaxi,
  onOpenExtra,
  onChangeReturn,
}) {
  return (
    <section id={leg.anchor} className="flex flex-col gap-[11px]">
      {/* Eyebrow — leg number, city, dates */}
      <div className="flex items-center gap-[8px] pt-[3px]">
        <span className="flex-none font-mono text-[9px] tracking-[0.08em] text-[#8a93a6]">
          {leg.eyebrow}
        </span>
        <div className="h-px flex-1 bg-[#e6e8ec]" />
        <span className="flex-none font-mono text-[9px] tracking-[0.08em] text-[#8a93a6]">
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

      {leg.extras.map((x) => (
        <div
          key={x.bookingId || x.name}
          style={T.card}
          className="flex items-center gap-[10px] px-[12px] py-[11px]"
        >
          <div className="h-[26px] w-[26px] flex-none rounded-[6px] bg-[#e6e8ec]" />
          <button
            type="button"
            onClick={() => onOpenExtra?.(leg, x)}
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-left"
          >
            <div className="truncate font-inter text-[12.5px] font-[700] text-[#0b1220]">
              {x.name}
            </div>
            {x.meta ? (
              <div className="mt-[4px] truncate font-mono text-[8.5px] tracking-[0.06em] text-[#8a93a6]">
                {x.meta}
              </div>
            ) : null}
          </button>
          <span style={T.tag}
            className="flex-none px-[6px] py-[3px] font-mono text-[8px] tracking-[0.07em] text-[#0b1220]">
            BOOKED
          </span>
        </div>
      ))}

      {leg.days.length > 0 && (
        <div style={T.dayList}>
          {leg.days.map((day) => (
            <DayRow
              key={day.key}
              day={day}
              changed={!!changedDayKey && day.key === changedDayKey}
              onOpen={() => onOpenDay?.(leg, day)}
            />
          ))}
          <button
            type="button"
            onClick={() => onAddTaxi?.(leg)}
            disabled={disabled}
            style={T.addRow}
            className="flex w-full items-center gap-[8px] px-[12px] py-[10px] text-left disabled:opacity-40"
          >
            <span className="text-[13px] leading-none text-[#6b7280]">+</span>
            <span className="font-inter text-[11.5px] font-[600] text-[#6b7280]">
              Add taxi in {leg.city}
            </span>
          </button>
        </div>
      )}

      {/* ── Flying home ────────────────────────────────────────────────────
          The return journey is folded onto the last stop by the view model,
          but it is not part of that city — it is how the trip ENDS. The design
          gives it its own block, with its own rule, after everything else. */}
      {leg.outboundTravel ? (
        <>
          <div className="flex items-center gap-[8px] pt-[3px]">
            <span className="flex-none font-mono text-[9px] tracking-[0.08em] text-[#8a93a6]">
              {`FLY HOME${
                leg.outboundTravel.destName
                  ? ` · ${leg.outboundTravel.destName.toUpperCase()}`
                  : ""
              }`}
            </span>
            <div className="h-px flex-1 bg-[#e6e8ec]" />
            <span className="flex-none font-mono text-[9px] tracking-[0.08em] text-[#8a93a6]">
              {leg.outboundTravel.departLabel || ""}
            </span>
          </div>
          <TravelRow
            travel={leg.outboundTravel}
            cityName={leg.outboundTravel.destName || leg.city}
            disabled={disabled}
            onOpen={() => onOpenTravel?.(leg, leg.outboundTravel)}
            onChange={() => onChangeReturn?.(leg)}
          />
        </>
      ) : null}
    </section>
  );
}
