// components/theme/cinematic/themeForms/season.ts
//
// Turns a theme's season (bare month numbers) into the months a reader can
// actually still book, and works out the dates for a route inside one of them.
//
// The point of the whole file is that nothing here is stored with a year. A
// theme says "December, January, February, March"; this resolves each to its
// NEXT occurrence from today, so the same config reads "Dec '26 → Mar '27" in
// August '26 and "Dec '27 → Mar '28" in August '27. The old dateWindows model
// pinned real dates into the config and quietly expired.

import type { ThemeForm, ThemeRoute, ThemeSeasonMonth } from "./types";

const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// How many month chips the strip will ever show. A year-round theme would
// otherwise render twelve, which is exactly the scrolling the form is trying to
// avoid; four is one comfortable row on a small phone and still spans a whole
// season for the themes that have one.
const MAX_MONTHS = 4;

// The soonest a generated departure may fall. Long-haul from India needs visa
// time (New Zealand alone runs ~40 days) and fares that haven't spiked, so
// three weeks is the floor — and a month with less than that left in it drops
// off the strip entirely rather than being offered as a near-impossible option.
const MIN_LEAD_DAYS = 21;

/** A season month pinned to a real year, with the routes that run in it. */
export interface ResolvedMonth {
  key: string; // "2027-01"
  year: number;
  month: number; // 1–12
  short: string; // "Jan '27"
  long: string; // "January 2027"
  label?: string; // "Deepest powder"
  tag?: string; // "BEST SNOW"
  line?: string; // one line on weather / crowds / price
  routes: ThemeRoute[];
}

const startOfToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (d: Date, days: number): Date => {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
};

/** Local-midnight ISO date-only ("YYYY-MM-DD") — the shape Calendar emits and
 *  the submission carries, kept local so it can't drift a day in IST. */
export const toIso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** True when this route runs in the given month. A route with no `months` runs
 *  whenever the theme's season does. */
export const routeRunsIn = (route: ThemeRoute, month: number): boolean =>
  !route.months?.length || route.months.includes(month);

/**
 * The season's months, each resolved forward to its next occurrence and paired
 * with the routes available in it.
 *
 * Walks month by month from today rather than sorting the season list, so a
 * winter theme read in January comes back as Jan → Feb → Mar → (next) Dec: the
 * order a traveller would consider, not calendar order. Months with no route
 * are dropped, and the current month is dropped once there's no lead time left
 * in it, so the first chip is always something bookable.
 */
export function resolveSeason(
  form: Pick<ThemeForm, "season" | "routes">,
  from: Date = startOfToday(),
): ResolvedMonth[] {
  const season = form.season ?? [];
  const routes = form.routes ?? [];
  if (!season.length || !routes.length) return [];

  const byMonth = new Map<number, ThemeSeasonMonth>();
  for (const m of season) byMonth.set(m.month, m);

  const earliest = addDays(from, MIN_LEAD_DAYS);
  const out: ResolvedMonth[] = [];
  const taken = new Set<number>();
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);

  // 13 steps, not 12: walking from the 1st of December, next December is the
  // twelfth step, and the current month may still be ruled out for lead time —
  // one extra pass guarantees every season month gets a chance to resolve.
  for (let i = 0; i < 13 && out.length < MAX_MONTHS; i++) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const note = byMonth.get(month);
    cursor.setMonth(cursor.getMonth() + 1);
    if (!note) continue;
    // Each season month appears once, as its soonest bookable occurrence. On
    // 2 December the walk would otherwise come back round and offer next
    // December too, which reads as a duplicate rather than a choice.
    if (taken.has(month)) continue;

    // The last day of this month, to test whether any of it is still reachable.
    const lastDay = new Date(year, month, 0);
    if (lastDay < earliest) continue;

    const monthRoutes = routes.filter((r) => routeRunsIn(r, month));
    if (!monthRoutes.length) continue;

    taken.add(month);
    out.push({
      key: `${year}-${String(month).padStart(2, "0")}`,
      year,
      month,
      short: `${MONTH_LONG[month - 1].slice(0, 3)} '${String(year).slice(2)}`,
      long: `${MONTH_LONG[month - 1]} ${year}`,
      label: note.label,
      tag: note.tag,
      line: note.line,
      routes: monthRoutes,
    });
  }

  return out;
}

/**
 * The dates a route would run on inside a resolved month.
 *
 * An anchored route (a festival) keeps its real day. Everything else leaves on
 * the second Saturday-ish of the month — a weekend departure reads natural for
 * a long-haul trip and keeps the whole stay inside the month the reader picked.
 * Either way the start is pushed out if it falls inside the booking lead time,
 * which is what stops "December" from suggesting the 6th when today is the 2nd.
 */
export function routeDates(
  route: ThemeRoute,
  month: ResolvedMonth,
  from: Date = startOfToday(),
): [string, string] {
  const anchored =
    route.anchor && route.anchor.month === month.month ? route.anchor : null;

  let start = anchored
    ? new Date(month.year, month.month - 1, anchored.day)
    : secondSaturday(month.year, month.month);

  const earliest = addDays(from, MIN_LEAD_DAYS);
  if (start < earliest) {
    // Keep the weekday the option already implied — nudging an anchored
    // festival to the next Saturday would move it off the festival.
    start = anchored ? earliest : nextWeekday(earliest, 6);
  }

  return [toIso(start), toIso(addDays(start, route.nights))];
}

/** A bare month number pinned to a real year, with no routes attached. */
export interface ResolvedMonthStub {
  key: string; // "2027-01"
  year: number;
  month: number; // 1–12
  long: string; // "January 2027"
}

/**
 * The next bookable occurrence of a bare month number.
 *
 * Same rule the season strip uses, minus the route filtering: a month whose
 * last day is already inside the booking lead time rolls to next year, so a
 * config that says "February" reads as Feb '27 in August '26 and can never
 * point at a February that has been and gone. Returns null for a nonsense
 * month, so callers can simply omit the key.
 *
 * `day` is for a prompt pinned to a fixed date — Hogmanay, the Boxing Day Test,
 * a New Year's Eve finish. Then it's THAT DATE, not merely some part of the
 * month, that has to clear the lead time: asked on 10 December, a trip built
 * around the 26th resolves to next December rather than to a date three weeks
 * out that nobody can book.
 */
export function resolveMonthForward(
  month: number,
  from: Date = startOfToday(),
  day?: number,
): ResolvedMonthStub | null {
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  const earliest = addDays(from, MIN_LEAD_DAYS);
  let year = from.getFullYear();
  const tooClose = day
    ? new Date(year, month - 1, day) < earliest
    : // No fixed day — any part of the month still being reachable is enough.
      new Date(year, month, 0) < earliest;
  if (tooClose) year += 1;
  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    year,
    month,
    long: `${MONTH_LONG[month - 1]} ${year}`,
  };
}

/**
 * A departure window inside a resolved month for a trip of `nights`.
 *
 * The routeless counterpart to routeDates: same mid-month Saturday departure
 * and the same lead-time push-out, so dates generated for a theme-page prompt
 * line up with the ones the mini-form would produce for the same month.
 *
 * `day` overrides that departure for a prompt built around a fixed date. It is
 * left exactly where the config put it — the whole point of naming the 26th is
 * that the trip starts on the 26th — and the end simply runs `nights` past it,
 * rolling into the next month or year on its own. That is what lets a nine-night
 * "New Year's Eve finish" actually contain the 31st instead of ending on the
 * 21st, which is what the generic mid-month departure produced.
 */
export function monthDates(
  month: ResolvedMonthStub,
  nights: number,
  from: Date = startOfToday(),
  day?: number,
): [string, string] {
  let start = day
    ? new Date(month.year, month.month - 1, day)
    : secondSaturday(month.year, month.month);
  if (!day) {
    const earliest = addDays(from, MIN_LEAD_DAYS);
    if (start < earliest) start = nextWeekday(earliest, 6);
  }
  return [toIso(start), toIso(addDays(start, Math.max(0, nights)))];
}

/** The first Saturday on or after the 8th — the middle-ish of the month. */
function secondSaturday(year: number, month: number): Date {
  return nextWeekday(new Date(year, month - 1, 8), 6);
}

/** `d`, or the next day after it falling on `weekday` (0 = Sun … 6 = Sat). */
function nextWeekday(d: Date, weekday: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + ((weekday - out.getDay() + 7) % 7));
  return out;
}
