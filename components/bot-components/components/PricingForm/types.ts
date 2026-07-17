// Shared types for the in-chat pricing form — the lightweight "confirm a few
// final details before pricing" card.

export interface PricingFormState {
  active: boolean;
  completed: boolean;
  /** True while the backend `pricing_form_shimmer` effect is in flight — the
   *  card shows a skeleton loader instead of the questions until the prefill
   *  (pricing-form widget) arrives. */
  loading: boolean;
  heading: string;
  subheading: string;
  startCity: string | null;
  /** Google place id for the committed departure location (from the
   *  start_locations endpoint), kept so the backend can resolve it exactly. */
  startCityPlaceId: string | null;
  /** The departure-city search input text — mirrors `startCity` once committed,
   *  but holds the live query while the user is searching for a new city. */
  startCityQuery: string;
  startCityCompleted: boolean;
  isInternational: boolean;
  /** yes/no add-on toggles. `addFlights` is `null` until the user (or backend
   *  prefill) answers it; visa / eSIM default to false. */
  addFlights: boolean | null;
  addFlightsCompleted: boolean;
  addVisa: boolean;
  addVisaCompleted: boolean;
  addEsim: boolean;
  addEsimCompleted: boolean;
}

/** One completion-marked field as encoded in the pricing-form widget id. */
export interface PricingField<T> {
  is_completed?: boolean;
  value?: T;
}

/** The prefill JSON encoded in the `pricing-form:{...}` widget id. Every key is
 *  optional — `parseShowPricingForm` maps whatever subset arrives. */
export interface PricingFormPrefill {
  start_city?: { is_completed?: boolean; name?: string };
  is_international?: boolean;
  add_flights?: PricingField<boolean | null>;
  add_visa?: PricingField<boolean>;
  add_esim?: PricingField<boolean>;
}
