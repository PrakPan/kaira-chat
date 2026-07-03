// Shared types for the in-chat intake form.

export type WhenMode = "dates" | "flexible" | "surprise";

export interface Destination {
  name: string;
  /** Fully-resolved image URL (CDN-prefixed) or null. */
  image: string | null;
  country?: string;
  resource_id?: string;
  latitude?: number | null;
  longitude?: number | null;
  /** Optional copy used by the left hero panel / featured tile. */
  headline?: string;
  place_tag?: string;
  tags?: string;
  /** Visual style of the featured-tile badge: pink "love", yellow "hot", or
   *  plain white when omitted. Mirrors the `btype` field in the design mock. */
  badge_type?: "love" | "hot" | "";
}

export interface IntakeFormState {
  active: boolean;
  step: number;
  completed: boolean;
  /** True while the backend `intake_form_shimmer` effect is in flight — the
   *  card shows a skeleton loader instead of the interactive steps until the
   *  prefill (`form_fields` / intake-form widget) arrives. */
  loading: boolean;
  /** Per-step completion flags driven by the backend `show_intake_form`
   *  effect's `is_completed` markers — indexes match the step order
   *  [destination, when, who, notes]. */
  stepsCompleted: boolean[];
  /** Primary destination — mirrors `destinations[0]`; drives the left hero
   *  image and the BotApp panel gate. */
  destination: Destination | null;
  /** Full multi-select list (the intake effect can send several places). */
  destinations: Destination[];
  query: string;
  when_mode: WhenMode;
  startDate: string | null; // ISO
  endDate: string | null; // ISO
  flexMonth: string | null;
  flexNights: number;
  who: string;
  adults: number;
  children: number;
  infants: number;
  notes: string;
  featured: Destination[];
}

/** Tolerant contract for the backend `form_fields` client effect. Every key is
 *  optional — `parseFormFields` maps whatever subset arrives. */
export interface FormFieldsPayload {
  destination?: Partial<Destination> & { name?: string; image?: string };
  featured?: Array<Partial<Destination> & { name?: string; image?: string }>;
  when?: {
    mode?: WhenMode;
    month?: string;
    nights?: number;
    start_date?: string;
    end_date?: string;
  };
  who?: string;
  adults?: number;
  children?: number;
  infants?: number;
  notes?: string;
}
