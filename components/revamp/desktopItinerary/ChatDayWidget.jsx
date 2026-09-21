import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

import buildTripViewModel from "../../../lib/tripViewModel";
import { DayContent } from "../mobileItinerary/sheets/DaySheet";

// ─────────────────────────────────────────────────────────────────────────────
//  ChatDayWidget — the desktop itinerary's full day, as a message in the chat.
//
//  "FULL DAY ›" on desktop doesn't open anything over the trip: it plays a
//  short exchange into the chat (dayTurn below, ChatKitPanel's ChatLocalTurnFn)
//  — the user asking about the day, Kaira answering in a line, and this, as a
//  widget under her answer (a `TripDay` node, see WidgetRenderer), the way her
//  hotel and activity lists arrive. None of it goes to the server.
//
//  The node carries only which day it is; the day itself is read from the trip
//  as it is NOW, so a day Kaira changes a minute later is shown changed, not as
//  it was when opened. (Her line above it is written once, when it's opened.)
//
//  The chat can't open the itinerary's drawers itself — they belong to the
//  pane beside it — so a tap is announced as TRIP_DAY_ACTION: an item opens
//  the same drawer the row in the trip would, and the add button asks Kaira
//  through the itinerary's own funnel, as every other "ask Kaira" there does.
// ─────────────────────────────────────────────────────────────────────────────

export const TRIP_DAY_ACTION = "ttw:trip-day-action";

const announce = (detail) => {
  window.dispatchEvent(new CustomEvent(TRIP_DAY_ACTION, { detail }));
};

// The chat's widget scope sets every font in it to Inter (`.kp-widget *`),
// which would flatten the day number's serif and the mono meta lines. Scoped
// one class deeper so it outranks that reset and nothing else.
const FontScope = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .kp-widget .ttw-chat-day .ttw-type-serif {
          font-family: 'Instrument Serif', serif;
        }
        .kp-widget .ttw-chat-day .font-mono {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
      `,
    }}
  />
);

// ── The exchange around it ───────────────────────────────────────────────────
// Copy rules are the design's: no em-dashes, and Kaira talks like a person
// who has read the day, not like a list of fields.

const listOf = (parts) =>
  parts.length <= 1
    ? parts[0] || ""
    : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;

// A meal reads as the meal it is at that hour.
const MEAL = { Morning: "breakfast", Afternoon: "lunch", Evening: "dinner", Night: "dinner" };
// Some stops are named as things to do ("Stroll the Sumida riverside"), and a
// capital mid-sentence reads as a typo: "then Stroll the …". Those few leading
// verbs go lower case; any other name keeps its own spelling.
const LEADING_VERB = /^(Stroll|Walk|Wander|Browse|Explore|Visit|See|Watch|Take|Try|Enjoy|Shop|Hike|Cruise|Ride|Relax|Discover|Experience|Catch|Climb|Soak|Sample|Tour)\b/;
const phrase = (item) =>
  item.kind === "food"
    ? `${MEAL[item.timeOfDay] || "a meal"} at ${item.name}`
    : item.name.replace(LEADING_VERB, (verb) => verb.toLowerCase());
const when = (timeOfDay) =>
  !timeOfDay ? "" : timeOfDay === "Night" ? " at night" : ` in the ${timeOfDay.toLowerCase()}`;
const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);
// Emoji (with their joiners and variation selectors) at either end of a title.
const EDGE_EMOJI = /^[\p{Extended_Pictographic}\u200D\uFE0F\s]+|[\p{Extended_Pictographic}\u200D\uFE0F\s]+$/gu;

/** The day's flow in one sentence: "Senso-ji in the afternoon, then …". */
function flowOf(items) {
  // Past a handful, a sentence naming every stop stops being readable.
  if (items.length > 4) {
    const first = items[0];
    const last = items[items.length - 1];
    return `${items.length} stops, from ${phrase(first)}${when(first.timeOfDay)} to ${phrase(last)}${when(last.timeOfDay)}.`;
  }
  // Neighbours at the same time of day share one clause.
  const groups = [];
  items.forEach((item) => {
    const g = groups[groups.length - 1];
    if (g && g.timeOfDay === item.timeOfDay) g.items.push(item);
    else groups.push({ timeOfDay: item.timeOfDay, items: [item] });
  });
  const clauses = groups.map((g) => `${listOf(g.items.map(phrase))}${when(g.timeOfDay)}`);
  const joined =
    clauses.length === 1
      ? clauses[0]
      : `${clauses.slice(0, -1).join(", ")}, then ${clauses[clauses.length - 1]}`;
  return `${capitalise(joined)}.`;
}

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

/**
 * The local turn "FULL DAY ›" plays into the chat (ChatLocalTurnFn): the
 * user's question, Kaira's one-paragraph answer, and the day as a widget.
 * Keyed on the day, so opening it again moves it down rather than repeating.
 */
export function dayTurn(leg, day) {
  const n = Number(day.dayNumber) || day.dayIndex + 1;
  const items = day.items.filter((i) => i.name);

  let reply;
  if (!items.length) {
    reply = day.isTravelDay
      ? `Day ${n} is your travel day out of ${leg.city}, so I've kept it clear. If you have a few hours before you leave, I can fit something in.`
      : `Day ${n} in ${leg.city} is wide open so far. Tell me what you're in the mood for, or tap below and I'll find something.`;
  } else {
    // The day's own title, minus the emoji it often leads with ("🏮 Gentle
    // Asakusa Arrival"): in the card it's a marker, mid-sentence it's noise.
    const title = (day.title || "").replace(EDGE_EMOJI, "").trim();
    const head = title
      ? `Here's Day ${n} in ${leg.city}, **${title}**.`
      : `Here's Day ${n} in ${leg.city}.`;
    reply = [
      [head, flowOf(items), bookingNote(items)].filter(Boolean).join(" "),
      "Tap any stop for the details, or tell me what you'd like to change.",
    ].join("\n");
  }

  return {
    prompt: `Help me plan Day ${n} in ${leg.city}`,
    reply,
    widget: { type: "TripDay", legId: leg.id, dayKey: day.key },
    key: `day:${leg.id}:${day.key}`,
  };
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
  // As the trip's own CTAs: Kaira can't act while the trip reprices.
  const busy = slices.ItineraryStatus?.pricing_status === "PENDING";

  return (
    <div
      className="ttw-chat-day font-inter leading-[normal]"
      data-local-widget={node?.localId}
    >
      <FontScope />
      {leg && day ? (
        <DayContent
          key={day.key}
          variant="inline"
          leg={leg}
          day={day}
          disabled={busy}
          onOpenItem={(item) => announce({ action: "openItem", leg, day, item })}
          onAskKaira={(message, contextLabel) =>
            announce({ action: "askKaira", leg, day, message, contextLabel })
          }
        />
      ) : (
        // The trip was rebuilt and this day went with it (dates moved, a city
        // dropped). The row in the itinerary is the way back in.
        <div className="text-[13px] text-[#8a93a6]">
          This day is no longer in the trip. Open it again from the itinerary.
        </div>
      )}
    </div>
  );
}
