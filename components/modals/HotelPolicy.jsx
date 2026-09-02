import React from "react";
import { currencySymbols } from "../../data/currencySymbols";
import { formatCurrencyValue } from "../../services/formatCurrencyValue";

// Renders the `metapolicy` / `metapolicy_extra_info` block returned by the
// hotel details API (RateHawk metapolicy). Each key of `metapolicy` is one
// policy (parking, pets, meals ...) holding either a single object or a list
// of objects made of snake_case enums, so everything below is written to be
// tolerant of shapes we have not seen yet: unknown policies and unknown
// fields still render, just with a humanised label.

const POLICY_ORDER = [
  "check_in_check_out",
  "add_fee",
  "deposit",
  "no_show",
  "meal",
  "children_meal",
  "children",
  "extra_bed",
  "cot",
  "internet",
  "parking",
  "shuttle",
  "pets",
  "visa",
];

const POLICY_LABELS = {
  add_fee: "Additional Fees",
  check_in_check_out: "Early Check In / Late Check Out",
  children: "Children",
  children_meal: "Children's Meals",
  cot: "Cot / Crib",
  deposit: "Deposit",
  extra_bed: "Extra Bed",
  internet: "Internet",
  meal: "Meals",
  no_show: "No Show",
  parking: "Parking",
  pets: "Pets",
  shuttle: "Shuttle",
  visa: "Visa Support",
};

// Values that carry no information for a guest.
const EMPTY_VALUES = ["", "unspecified", "unknown", "undefined", "null"];

const VALUE_LABELS = {
  included: "Included in price",
  not_included: "Not included in price",
  deposit: "Refundable deposit",
  free: "Free",
  paid: "Paid",
  available: "Available",
  unavailable: "Not available",
  not_available: "Not available",
  on_request: "On request",
  price: "Chargeable",
  wi_fi: "Wi-Fi",
  wifi: "Wi-Fi",
};

// price_unit enum returned by the API.
const PRICE_UNIT_LABELS = {
  per_guest_per_night: "per guest per night",
  per_guest_per_stay: "per guest per stay",
  per_room_per_night: "per room per night",
  per_room_per_stay: "per room per stay",
  per_hour: "per hour",
  per_week: "per week",
  per_night: "per night",
  per_stay: "per stay",
};

const DETAIL_LABELS = {
  time: "Time",
  work_area: "Available in",
  amount: "Quantity",
  day_period: "Period",
  extra_bed: "Extra bed",
  payment_type: "Payment",
  pricing_method: "Pricing",
};

// Fields consumed by a dedicated renderer below, so the generic
// "Label: Value" pass has to skip them.
const TYPE_KEYS = [
  "fee_type",
  "check_in_check_out_type",
  "meal_type",
  "internet_type",
  "pets_type",
  "shuttle_type",
  "deposit_type",
  "territory_type",
  "destination_type",
  "bed_type",
];
const STATUS_KEYS = ["inclusion", "availability", "visa_support"];
const PRICE_KEYS = ["price", "currency", "price_unit"];
const AGE_KEYS = ["age_start", "age_end"];

const humanize = (value) =>
  String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());

// null for anything a guest should not see, a display string otherwise.
const enumLabel = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : null;
  const raw = String(value).trim();
  if (EMPTY_VALUES.includes(raw.toLowerCase())) return null;
  return VALUE_LABELS[raw.toLowerCase()] || humanize(raw);
};

const priceLabel = (entry, fallbackCurrency) => {
  const amount = Number(entry?.price);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const code = entry?.currency || fallbackCurrency || "INR";
  const symbol = currencySymbols?.[code] || `${code} `;
  const unitKey = String(entry?.price_unit || "").toLowerCase().trim();
  const unit =
    !unitKey || EMPTY_VALUES.includes(unitKey)
      ? ""
      : PRICE_UNIT_LABELS[unitKey] || unitKey.replace(/_/g, " ");
  return `${symbol}${formatCurrencyValue(amount, code)}${unit ? ` ${unit}` : ""}`;
};

const ageLabel = (entry) => {
  const start = Number(entry?.age_start);
  const end = Number(entry?.age_end);
  const hasStart = Number.isFinite(start);
  const hasEnd = Number.isFinite(end);
  if (!hasStart && !hasEnd) return null;
  if (hasStart && hasEnd) return `Ages ${start}-${end}`;
  return hasStart ? `Ages ${start}+` : `Up to age ${end}`;
};

// One policy entry -> the fragments joined into a single readable line.
const entryParts = (entry, fallbackCurrency) => {
  if (entry === null || entry === undefined) return [];
  if (typeof entry !== "object") {
    const value = enumLabel(entry);
    return value ? [value] : [];
  }

  const parts = [];
  const consumed = new Set([...PRICE_KEYS, ...AGE_KEYS]);

  TYPE_KEYS.forEach((key) => {
    consumed.add(key);
    const value = enumLabel(entry[key]);
    if (value) parts.push(value);
  });

  STATUS_KEYS.forEach((key) => {
    consumed.add(key);
    const raw = entry[key];
    if (typeof raw === "boolean") {
      parts.push(raw ? "Available" : "Not available");
      return;
    }
    const value = enumLabel(raw);
    if (value) parts.push(value);
  });

  const age = ageLabel(entry);
  if (age) parts.push(age);

  const price = priceLabel(entry, fallbackCurrency);
  if (price) parts.push(price);

  Object.keys(entry).forEach((key) => {
    if (consumed.has(key)) return;
    const raw = entry[key];
    if (raw === null || raw === undefined || typeof raw === "object") return;
    // "Quantity: 0" says nothing a guest can use.
    if (key === "amount" && Number(raw) === 0) return;
    const label = DETAIL_LABELS[key] || humanize(key);
    if (typeof raw === "boolean") {
      parts.push(`${label}: ${raw ? "Yes" : "No"}`);
      return;
    }
    const value = enumLabel(raw);
    if (value) parts.push(`${label}: ${value}`);
  });

  return parts;
};

const buildPolicies = (metapolicy, fallbackCurrency) => {
  if (!metapolicy || typeof metapolicy !== "object" || Array.isArray(metapolicy)) {
    return [];
  }

  const keys = Object.keys(metapolicy);
  const ordered = [
    ...POLICY_ORDER.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !POLICY_ORDER.includes(key)).sort(),
  ];

  return ordered
    .map((key) => {
      const value = metapolicy[key];
      const entries = Array.isArray(value) ? value : [value];
      const lines = entries
        .map((entry) => entryParts(entry, fallbackCurrency).join(" · "))
        .filter((line) => line.length > 0);
      return { key, label: POLICY_LABELS[key] || humanize(key), lines };
    })
    .filter((policy) => policy.lines.length > 0);
};

const HotelPolicy = ({
  metapolicy,
  extraInfo,
  currency,
  headingClassName = "text-md-lg font-600 leading-xl text-[#0b1220]",
  labelClassName = "text-sm-xl font-600 leading-xl text-[#0b1220]",
  valueClassName = "text-sm-md font-400 leading-xl text-[#445069]",
}) => {
  const policies = buildPolicies(metapolicy, currency);
  const extra = typeof extraInfo === "string" ? extraInfo.trim() : "";

  if (!policies.length && !extra) return null;

  return (
    <div>
      <hr className="my-lg border-[#ececec]" />
      <div className={`${headingClassName} mb-lg`}>Hotel Policies</div>

      {policies.length > 0 && (
        <div className="grid grid-cols-2 max-ph:grid-cols-1 gap-x-4 gap-y-lg">
          {policies.map((policy) => (
            <div key={policy.key} className="flex flex-col gap-xxs">
              <div className={labelClassName}>{policy.label}</div>
              {policy.lines.map((line, index) => (
                <div key={index} className={valueClassName}>
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {extra && (
        <div
          className={`${valueClassName} whitespace-pre-line gl-dynamic-render-elements ${
            policies.length > 0 ? "mt-lg" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: extra }}
        ></div>
      )}
    </div>
  );
};

export default HotelPolicy;
