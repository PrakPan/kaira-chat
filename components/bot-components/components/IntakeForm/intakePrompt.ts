import type { FormFieldsPayload, IntakeFormState } from "./types";
import { resolveImage } from "./constants";

// ── Date helpers (work on ISO strings so Redux state stays serialisable) ──────

export function isoToDate(iso: string | null): Date | null {
  if (!iso) return null;
  // Parse date-only ISO (YYYY-MM-DD) as LOCAL midnight to stay consistent with
  // dateToIso, which serialises local dates. `new Date("YYYY-MM-DD")` parses as
  // UTC and drifts a day in non-UTC timezones (e.g. IST) — that mismatch made
  // the calendar's start/end/in-range equality checks fail, so picked dates
  // never highlighted.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    d.setHours(0, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

export function dateToIso(d: Date | null): string | null {
  if (!d) return null;
  // Local-midnight ISO, date-only, to avoid TZ drift in the range picker.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatShort(iso: string | null): string {
  const d = isoToDate(iso);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function nightsBetween(startIso: string | null, endIso: string | null): number {
  const s = isoToDate(startIso);
  const e = isoToDate(endIso);
  if (!s || !e) return 0;
  return Math.round((e.getTime() - s.getTime()) / 86400000);
}

// ── Validation ────────────────────────────────────────────────────────────────
// Steps 0,1,2 are compulsory; step 3 (notes) is optional.

export function validateStep(state: IntakeFormState, step: number): boolean {
  switch (step) {
    case 0: {
      // Valid as long as at least one destination is selected. (Removing every
      // tag / clearing the input empties the list and re-disables Continue.)
      if ((state.destinations?.length ?? 0) > 0) return true;
      return !!state.destination && (state.destination.name?.length ?? 0) >= 2;
    }
    case 1:
      if (state.when_mode === "dates") {
        return !!(state.startDate && state.endDate);
      }
      if (state.when_mode === "flexible") {
        // A rough month is mandatory in flexible mode; the legacy "Flexible"
        // sentinel no longer counts as a chosen month.
        return !!state.flexMonth && state.flexMonth !== "Flexible";
      }
      return true; // surprise always valid
    case 2:
      return !!state.who;
    case 3:
    default:
      return true; // notes are optional
  }
}

// ── Human-readable "who" label including pax counts ───────────────────────────

export function paxLabel(state: IntakeFormState): string {
  if (state.who === "Just me") return "just me";
  if (state.who === "Couple") return "couple";
  const parts: string[] = [];
  if (state.adults) parts.push(`${state.adults} adult${state.adults > 1 ? "s" : ""}`);
  if (state.children)
    parts.push(`${state.children} child${state.children > 1 ? "ren" : ""}`);
  if (state.infants)
    parts.push(`${state.infants} infant${state.infants > 1 ? "s" : ""}`);
  const base = (state.who || "").toLowerCase();
  return base + (parts.length ? ` (${parts.join(", ")})` : "");
}

// ── "When" summary string ─────────────────────────────────────────────────────

export function whenSummary(state: IntakeFormState): string {
  if (state.when_mode === "dates" && state.startDate && state.endDate) {
    return `${formatShort(state.startDate)} to ${formatShort(state.endDate)}`;
  }
  if (state.when_mode === "flexible") {
    const month =
      state.flexMonth && state.flexMonth !== "Flexible" ? `${state.flexMonth}, ` : "";
    return `${month}${state.flexNights} nights`;
  }
  return "surprise me";
}

// ── Compose the message we send to Kaira on "Done" ────────────────────────────

// Friendly, labelled traveller summary (e.g. "Friends — 2 adults, 1 child").
function travellersLabel(state: IntakeFormState): string {
  const who = state.who || "Just me";
  if (who === "Just me") return "Just me";
  if (who === "Couple") return "Couple (2 adults)";
  const parts: string[] = [];
  if (state.adults)
    parts.push(`${state.adults} ${state.adults === 1 ? "adult" : "adults"}`);
  if (state.children)
    parts.push(`${state.children} ${state.children === 1 ? "child" : "children"}`);
  if (state.infants)
    parts.push(`${state.infants} ${state.infants === 1 ? "infant" : "infants"}`);
  return parts.length ? `${who} — ${parts.join(", ")}` : who;
}

// Readable "when" line for the composed message.
function whenLine(state: IntakeFormState): string {
  if (state.when_mode === "dates" && state.startDate && state.endDate) {
    const n = nightsBetween(state.startDate, state.endDate);
    const nights = n ? ` (${n} ${n === 1 ? "night" : "nights"})` : "";
    return `${formatShort(state.startDate)} – ${formatShort(state.endDate)}${nights}`;
  }
  if (state.when_mode === "flexible") {
    const month =
      state.flexMonth && state.flexMonth !== "Flexible"
        ? `${state.flexMonth} · `
        : "Flexible · ";
    return `${month}${state.flexNights} ${state.flexNights === 1 ? "night" : "nights"}`;
  }
  return "Surprise me — suggest the best time";
}

export function composeIntakeMessage(state: IntakeFormState): string {
  // A labelled, line-per-field summary — easy for the traveller to read back
  // and unambiguous for the bot to parse.
  const lines: string[] = [];
  const names = (
    state.destinations?.length
      ? state.destinations.map((d) => d.name)
      : state.destination?.name
        ? [state.destination.name]
        : []
  )
    .map((n) => n?.trim())
    .filter(Boolean);
  if (names.length) {
    lines.push(
      `• Destination${names.length > 1 ? "s" : ""}: ${names.join(", ")}`,
    );
  }
  lines.push(`• When: ${whenLine(state)}`);
  lines.push(`• Travellers: ${travellersLabel(state)}`);
  if (state.notes && state.notes.trim()) {
    lines.push(`• Preferences: ${state.notes.trim()}`);
  }
  return `Here are my trip details:\n${lines.join("\n")}`;
}

// ── Parse the backend `form_fields` effect into a partial state ────────────────
// Tolerant: any subset of keys is accepted; missing keys are simply omitted so
// the reducer keeps its defaults.

export function parseFormFields(
  payload: FormFieldsPayload | undefined | null,
): Partial<IntakeFormState> {
  const out: Partial<IntakeFormState> = {};
  if (!payload || typeof payload !== "object") return out;

  if (payload.destination && payload.destination.name) {
    out.destination = {
      name: payload.destination.name,
      image: resolveImage(payload.destination.image ?? null),
      country: payload.destination.country,
      resource_id: payload.destination.resource_id,
      latitude: payload.destination.latitude ?? null,
      longitude: payload.destination.longitude ?? null,
      headline: payload.destination.headline,
      place_tag: payload.destination.place_tag,
    };
    out.destinations = [out.destination];
    out.query = payload.destination.name;
  }

  if (Array.isArray(payload.featured) && payload.featured.length) {
    out.featured = payload.featured
      .filter((f) => f && f.name)
      .map((f) => ({
        name: f.name as string,
        image: resolveImage(f.image ?? null),
        country: f.country,
        headline: f.headline,
        place_tag: f.place_tag,
        tags: f.tags,
      }));
  }

  if (payload.when) {
    if (payload.when.mode) out.when_mode = payload.when.mode;
    if (payload.when.month) out.flexMonth = payload.when.month;
    if (typeof payload.when.nights === "number") out.flexNights = payload.when.nights;
    if (payload.when.start_date) out.startDate = payload.when.start_date;
    if (payload.when.end_date) out.endDate = payload.when.end_date;
  }

  if (payload.who) out.who = payload.who;
  if (typeof payload.adults === "number") out.adults = payload.adults;
  if (typeof payload.children === "number") out.children = payload.children;
  if (typeof payload.infants === "number") out.infants = payload.infants;
  if (typeof payload.notes === "string") out.notes = payload.notes;

  return out;
}

// ── Streamed intake-form widget ───────────────────────────────────────────────
// The backend no longer emits a `show_intake_form` client effect. Instead it
// streams a widget item (`thread.item.done`) whose `id` encodes the prefill as
// `intake-form:{...json...}` — the JSON is exactly the prefill shape that
// `parseShowIntakeForm` consumes. These helpers detect such widgets and pull
// the prefill object out of the id.

export const INTAKE_FORM_WIDGET_PREFIX = "intake-form:";

export function isIntakeFormWidgetId(id: unknown): id is string {
  return typeof id === "string" && id.startsWith(INTAKE_FORM_WIDGET_PREFIX);
}

export function parseIntakeFormWidgetId(id: unknown): any | null {
  if (!isIntakeFormWidgetId(id)) return null;
  const raw = id.slice(INTAKE_FORM_WIDGET_PREFIX.length).trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Parse the backend `show_intake_form` effect ───────────────────────────────
// Shape (every section optional, each carries an `is_completed` marker):
//   { prefill: {
//       destination:  { is_completed, value },
//       timing:       { is_completed, when_mode, start_date, end_date, flex_month, nights },
//       group:        { is_completed, who, adults, children, infants },
//       preferences:  { is_completed, notes },
//   } }
// Returns the prefilled fields plus `stepsCompleted` (step order:
// [destination, when, who, notes]) and the `step` to open on — the first
// incomplete step, or the last step when everything is already filled.
export function parseShowIntakeForm(
  payload: any,
): Partial<IntakeFormState> & { step: number; stepsCompleted: boolean[] } {
  const p = (payload && payload.prefill) || payload || {};
  const out: Partial<IntakeFormState> = {};

  const dest = p.destination;
  if (dest) {
    // The effect may send a single `value` (string) or `values` (array).
    const raw: unknown[] = Array.isArray(dest.values)
      ? dest.values
      : typeof dest.value === "string"
        ? [dest.value]
        : [];
    const names = raw
      .map((v) => String(v ?? "").trim())
      .filter(Boolean);
    if (names.length) {
      const list = names.map((name) => ({ name, image: null }));
      out.destinations = list;
      out.destination = list[0];
      // Mirror into `query` so the prefilled destinations show in the input box.
      out.query = names.join(", ");
    }
  }

  const t = p.timing;
  if (t) {
    if (t.when_mode === "dates" || t.when_mode === "flexible" || t.when_mode === "surprise") {
      out.when_mode = t.when_mode;
    }
    out.startDate = t.start_date ?? null;
    out.endDate = t.end_date ?? null;
    out.flexMonth = t.flex_month ?? null;
    if (typeof t.nights === "number") out.flexNights = t.nights;
  }

  const g = p.group;
  if (g) {
    if (typeof g.who === "string") out.who = g.who;
    if (typeof g.adults === "number") out.adults = g.adults;
    if (typeof g.children === "number") out.children = g.children;
    if (typeof g.infants === "number") out.infants = g.infants;
  }

  const pref = p.preferences;
  if (pref && typeof pref.notes === "string") out.notes = pref.notes;

  const stepsCompleted = [
    !!p.destination?.is_completed,
    !!p.timing?.is_completed,
    !!p.group?.is_completed,
    !!p.preferences?.is_completed,
  ];

  const firstIncomplete = stepsCompleted.findIndex((c) => !c);
  const step =
    firstIncomplete === -1 ? stepsCompleted.length - 1 : firstIncomplete;

  return { ...out, step, stepsCompleted };
}
