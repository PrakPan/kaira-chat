import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

import buildTripViewModel from "../../../lib/tripViewModel";

// ─────────────────────────────────────────────────────────────────────────────
//  ChatDayWidget — the desktop itinerary's full day, as Kaira's reply in the chat.
//
//  "FULL DAY ›" on desktop doesn't open anything over the trip: it plays a
//  short exchange into the chat (dayTurn below, ChatKitPanel's ChatLocalTurnFn)
//  — the user asking about the day, and Kaira answering in text: a line on the
//  day, its stops as points under MORNING / AFTERNOON / …, and a closing line.
//  It's a `TripDay` widget node (see WidgetRenderer) only so it can stay live
//  and tappable; it sits on the same paper bubble as her text and reads as one.
//  None of it goes to the server.
//
//  The node carries only which day it is; the day itself is read from the trip
//  as it is NOW, so a day Kaira changes a minute later is shown changed, not as
//  it was when opened.
//
//  Each stop's name is an annotation: the chat can't open the itinerary's
//  drawers itself — they belong to the pane beside it — so a tap is announced
//  as TRIP_DAY_ACTION, and the itinerary opens the same drawer its row would.
//  A free-time idea has no drawer, so it isn't one (see isIdea).
// ─────────────────────────────────────────────────────────────────────────────

export const TRIP_DAY_ACTION = "ttw:trip-day-action";

const announce = (detail) => {
  window.dispatchEvent(new CustomEvent(TRIP_DAY_ACTION, { detail }));
};

// The chat's widget scope sets every font in it to Inter (`.kp-widget *`),
// which would flatten the mono labels. Scoped one class deeper so it outranks
// that reset and nothing else. Body text keeps the widget scope's chat type
// (14.5px / 1.55, the same as `.chat-md`), so this reads as her text bubble.
const DayReplyStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .kp-widget .ttw-chat-day { padding: 0 3px; }
        .kp-widget .ttw-chat-day p { margin: 0 0 8px; }
        .kp-widget .ttw-chat-day p:last-child { margin-bottom: 0; }
        .kp-widget .ttw-chat-day strong { font-weight: 700; color: #0b1220; }
        .kp-widget .ttw-chat-day .tdr-mono {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
        .kp-widget .ttw-chat-day .tdr-slot { margin: 10px 0 12px; }
        .kp-widget .ttw-chat-day .tdr-slot + .tdr-slot { margin-top: 0; }
        .kp-widget .ttw-chat-day .tdr-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 10.5px; letter-spacing: 0.12em; color: #8a93a6;
          margin-bottom: 4px;
        }
        .kp-widget .ttw-chat-day .tdr-label::after {
          content: ""; flex: 1; border-top: 1px dashed #dcdcd2;
        }
        .kp-widget .ttw-chat-day ul { list-style: none; margin: 0; padding: 0; }
        .kp-widget .ttw-chat-day li {
          display: grid; grid-template-columns: 14px 1fr; gap: 6px;
          margin-bottom: 6px;
        }
        .kp-widget .ttw-chat-day li:last-child { margin-bottom: 0; }
        .kp-widget .ttw-chat-day li::before {
          content: ""; width: 6px; height: 6px; border-radius: 50%;
          background: #0b1220; margin: 9px 0 0 3px;
        }
        .kp-widget .ttw-chat-day .tdr-ann {
          display: inline; padding: 0; margin: 0; border: 0; background: none;
          box-shadow: none; font: inherit; font-weight: 600; color: #0b1220;
          text-align: left; cursor: pointer; border-radius: 3px;
          text-decoration: underline dotted #b8bdc9;
          text-decoration-thickness: 1.5px; text-underline-offset: 3px;
          transition: background-color 0.12s;
        }
        .kp-widget .ttw-chat-day .tdr-ann:hover,
        .kp-widget .ttw-chat-day .tdr-ann:focus-visible {
          background: #fdf9c4; text-decoration-color: #0b1220; outline: none;
        }
        .kp-widget .ttw-chat-day .tdr-meta {
          margin-left: 6px; white-space: nowrap;
          font-size: 11px; letter-spacing: 0.06em; color: #8a93a6;
        }
        .kp-widget .ttw-chat-day strong.tdr-idea-name { font-weight: 600; }
        .kp-widget .ttw-chat-day .tdr-idea {
          display: block; margin-top: 1px; font-size: 13px; color: #445069;
        }
        .kp-widget .ttw-chat-day .tdr-close { color: #445069; }
      `,
    }}
  />
);

// ── Kaira's reply ────────────────────────────────────────────────────────────
// Copy rules are the design's: no em-dashes, and Kaira talks like a person
// who has read the day, not like a list of fields.

// A meal reads as the meal it is at that hour.
const MEAL = { Morning: "Breakfast", Afternoon: "Lunch", Evening: "Dinner", Night: "Dinner" };
// Emoji (with their joiners and variation selectors) at either end of a title.
const EDGE_EMOJI = /^[\p{Extended_Pictographic}\u200D\uFE0F\s]+|[\p{Extended_Pictographic}\u200D\uFE0F\s]+$/gu;

/** What's paid for, in a clause — or that nothing needs to be. */
function bookingNote(items) {
  const booked = items.filter((i) => i.kind === "booked").length;
  if (booked === items.length) {
    return items.length === 1 ? "It's already booked." : "Everything's already booked.";
  }
  if (booked === 1) return "One of them is already booked.";
  if (booked > 1) return `${booked} of them are already booked.`;
  // Unbooked activities cost something; only places and meals are free.
  return items.some((i) => i.kind === "activity") ? "" : "All free, no booking needed.";
}

/** Neighbouring stops at the same time of day share one labelled group. A
 *  stop with no time gets a group with no label. */
function slotsOf(items) {
  const slots = [];
  items.forEach((item) => {
    const s = slots[slots.length - 1];
    if (s && s.timeOfDay === item.timeOfDay) s.items.push(item);
    else slots.push({ timeOfDay: item.timeOfDay || null, items: [item] });
  });
  return slots;
}

/** A free-time idea ("Wander the waterfront"): a `recommendation` element is
 *  only words — no place, activity or restaurant behind it — so there's no
 *  drawer to open and its name isn't an annotation. Kaira says what it is in
 *  the text instead. Anything else no drawer answers for reads the same way. */
const isIdea = (item) => item.elementType === "recommendation" || !item.detailId;

/** The point's trailing mono note: "4H · 4.5★ · BOOKED". Time of day is the
 *  group's label, so it isn't repeated here. */
const noteOf = (item) =>
  [
    isIdea(item) ? "ON YOUR OWN" : null,
    item.durationLabel,
    item.rating ? `${item.rating}★` : null,
    item.kind === "booked" ? "BOOKED" : null,
  ]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

/**
 * The local turn "FULL DAY ›" plays into the chat (ChatLocalTurnFn): the
 * user's question, then Kaira's reply, which is all in the widget (DayReply)
 * so it stays live. Keyed on the day, so opening it again moves it down
 * rather than repeating.
 */
export function dayTurn(leg, day) {
  const n = Number(day.dayNumber) || day.dayIndex + 1;
  return {
    prompt: `Help me plan Day ${n} in ${leg.city}`,
    widget: { type: "TripDay", legId: leg.id, dayKey: day.key },
    key: `day:${leg.id}:${day.key}`,
  };
}

function DayReply({ leg, day, onOpenItem }) {
  const n = Number(day.dayNumber) || day.dayIndex + 1;
  const items = day.items.filter((i) => i.name);

  if (!items.length) {
    return (
      <p>
        {day.isTravelDay
          ? `Day ${n} is your travel day out of ${leg.city}, so I've kept it clear. If you have a few hours before you leave, I can fit something in.`
          : `Day ${n} in ${leg.city} is wide open so far. Tell me what you're in the mood for and I'll find something.`}
      </p>
    );
  }

  // The day's own title, minus the emoji it often leads with ("🏮 Gentle
  // Asakusa Arrival"): in the card it's a marker, mid-sentence it's noise.
  const title = (day.title || "").replace(EDGE_EMOJI, "").trim();
  const closing = [
    bookingNote(items),
    "Tap any stop for the details, or tell me what you'd like to change.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <p>
        Here&apos;s Day {n} in {leg.city}
        {title ? (
          <>
            , <strong>{title}</strong>.
          </>
        ) : (
          "."
        )}
      </p>

      {slotsOf(items).map((slot, si) => (
        <div className="tdr-slot" key={`${slot.timeOfDay || "any"}-${si}`}>
          {slot.timeOfDay ? (
            <div className="tdr-label tdr-mono">{slot.timeOfDay.toUpperCase()}</div>
          ) : null}
          <ul>
            {slot.items.map((item, idx) => {
              const note = noteOf(item);
              const meal = item.kind === "food" ? MEAL[item.timeOfDay] || "A meal" : null;
              return (
                <li key={item.id || `${item.name}-${idx}`}>
                  <span>
                    {meal ? `${meal} at ` : null}
                    {isIdea(item) ? (
                      <strong className="tdr-idea-name">{item.name}</strong>
                    ) : (
                      <button
                        type="button"
                        className="tdr-ann"
                        onClick={() => onOpenItem(item)}
                      >
                        {item.name}
                      </button>
                    )}
                    {note ? <span className="tdr-meta tdr-mono">{note}</span> : null}
                    {isIdea(item) ? (
                      <span className="tdr-idea">
                        Free time, nothing to book. Go at your own pace, or ask me for
                        specific spots and tips.
                      </span>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <p className="tdr-close">{closing}</p>
    </>
  );
}

export default function ChatDayWidget({ node }) {
  const slices = useSelector(
    (s) => ({
      Itinerary: s.Itinerary,
      Stays: s.Stays,
      TransferBookings: s.TransferBookings,
      Cart: s.Cart,
      AncillaryBookings: s.AncillaryBookings,
      ItineraryStatus: s.ItineraryStatus,
      currency: s.currency,
    }),
    shallowEqual,
  );
  const { legs } = useMemo(() => buildTripViewModel(slices), [slices]);

  const leg = legs.find((l) => l.id === node?.legId) || null;
  const day = leg ? leg.days.find((d) => d.key === node?.dayKey) || null : null;

  return (
    <div className="ttw-chat-day" data-local-widget={node?.localId}>
      <DayReplyStyles />
      {leg && day ? (
        <DayReply
          key={day.key}
          leg={leg}
          day={day}
          onOpenItem={(item) => announce({ action: "openItem", leg, day, item })}
        />
      ) : (
        // The trip was rebuilt and this day went with it (dates moved, a city
        // dropped). The row in the itinerary is the way back in.
        <p className="tdr-close">
          This day is no longer in the trip. Open it again from the itinerary.
        </p>
      )}
    </div>
  );
}
