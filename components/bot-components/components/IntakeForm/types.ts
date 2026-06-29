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
  destination: Destination | null;
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
