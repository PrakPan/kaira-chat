import type { FormFieldsPayload, IntakeFormState } from "./types";
import { resolveImage } from "./constants";

// ── Date helpers (work on ISO strings so Redux state stays serialisable) ──────

export function isoToDate(iso: string | null): Date | null {
  if (!iso) return null;
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
    case 0:
      return !!state.destination && (state.destination.name?.length ?? 0) >= 2;
    case 1:
      if (state.when_mode === "dates") {
        return !!(state.startDate && state.endDate);
      }
      return true; // flexible / surprise always valid
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

export function composeIntakeMessage(state: IntakeFormState): string {
  const dest = state.destination?.name ?? "";
  const who = state.who ? paxLabel(state) : "just me";
  const parts = [dest, whenSummary(state), who].filter(Boolean);
  let msg = parts.join(" · ");
  if (state.notes && state.notes.trim()) {
    msg += `\n\nNotes: ${state.notes.trim()}`;
  }
  return msg;
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
