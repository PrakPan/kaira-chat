import type { PricingFormPrefill, PricingFormState } from "./types";

// ── Streamed pricing-form widget ──────────────────────────────────────────────
// The backend streams the pricing form as a widget item (`thread.item.done`)
// whose `id` encodes the prefill as `pricing-form:{...json...}` — the JSON is
// exactly the prefill shape that `parseShowPricingForm` consumes. These helpers
// detect such widgets and pull the prefill object out of the id.

export const PRICING_FORM_WIDGET_PREFIX = "pricing-form:";

export function isPricingFormWidgetId(id: unknown): id is string {
  return typeof id === "string" && id.startsWith(PRICING_FORM_WIDGET_PREFIX);
}

export function parsePricingFormWidgetId(id: unknown): PricingFormPrefill | null {
  if (!isPricingFormWidgetId(id)) return null;
  const raw = id.slice(PRICING_FORM_WIDGET_PREFIX.length).trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw) as PricingFormPrefill;
  } catch {
    return null;
  }
}

// ── Card copy from the widget children ────────────────────────────────────────
// The streamed widget carries a Card with a heading + body Text; pull them out
// so the backend controls the copy, falling back to sensible defaults.
export function parsePricingCardCopy(
  widget: Record<string, unknown> | undefined | null,
): { heading?: string; subheading?: string } {
  const out: { heading?: string; subheading?: string } = {};
  const children = (widget as any)?.children;
  if (!Array.isArray(children)) return out;
  const texts = children.filter(
    (c: any) => c && c.type === "Text" && typeof c.value === "string",
  );
  const heading = texts.find((c: any) => c.variant === "heading");
  const body = texts.find((c: any) => c.variant !== "heading");
  if (heading?.value) out.heading = heading.value;
  if (body?.value) out.subheading = body.value;
  return out;
}

// ── Parse the pricing-form prefill into a partial state ────────────────────────
// Shape (every section optional, each toggle carries an `is_completed` marker):
//   { start_city:      { is_completed, name },
//     is_international: boolean,
//     add_flights:     { is_completed, value },
//     add_visa:        { is_completed, value },
//     add_esim:        { is_completed, value } }
export function parseShowPricingForm(
  payload: PricingFormPrefill | undefined | null,
): Partial<PricingFormState> {
  const p = payload || {};
  const out: Partial<PricingFormState> = {};

  if (p.start_city) {
    if (typeof p.start_city.name === "string") {
      out.startCity = p.start_city.name;
      // Seed the search input so it shows the prefilled city and reads as a
      // settled (committed) selection until the user edits it.
      out.startCityQuery = p.start_city.name;
    }
    out.startCityCompleted = !!p.start_city.is_completed;
  }

  if (typeof p.is_international === "boolean") {
    out.isInternational = p.is_international;
  }

  if (p.add_flights) {
    out.addFlights =
      typeof p.add_flights.value === "boolean" ? p.add_flights.value : null;
    out.addFlightsCompleted = !!p.add_flights.is_completed;
  }

  if (p.add_visa) {
    out.addVisa = p.add_visa.value === true;
    out.addVisaCompleted = !!p.add_visa.is_completed;
  }

  if (p.add_esim) {
    out.addEsim = p.add_esim.value === true;
    out.addEsimCompleted = !!p.add_esim.is_completed;
  }

  return out;
}

// ── Can the form be submitted? ────────────────────────────────────────────────
// Flights is the only tri-state answer — it must be picked (or already marked
// complete by the backend). Visa / eSIM default to a valid boolean.
export function canSubmitPricing(state: PricingFormState): boolean {
  if (!state) return false;
  const hasCity = !!(state.startCity && state.startCity.trim());
  const flightsAnswered = state.addFlightsCompleted || state.addFlights !== null;
  return hasCity && flightsAnswered;
}

// ── Compose the message we send to Kaira on submit ────────────────────────────
const yesNo = (v: boolean | null): string => (v ? "Yes" : "No");

export function composePricingMessage(state: PricingFormState): string {
  const lines: string[] = [];
  if (state.startCity) lines.push(`• Departure city: ${state.startCity}`);
  lines.push(`• Add flights: ${yesNo(state.addFlights)}`);
  if (state.isInternational) {
    lines.push(`• Add visa assistance: ${yesNo(state.addVisa)}`);
    lines.push(`• Add eSIM / data: ${yesNo(state.addEsim)}`);
  }
  return `Here are my final details for pricing:\n${lines.join("\n")}`;
}
