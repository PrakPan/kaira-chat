import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { getIndianPrice } from "../../../services/getIndianPrice";

/**
 * What the taxi fare already covers, straight from the supplier.
 *
 * Suppliers disagree about how much of the road cost is inside the quoted fare, and
 * the flags genuinely flip per route and trip type — Delhi→Agra one-way comes back
 * with tolls and state tax inside the total, a Kochi→Alleppey→Varkala multiway has
 * both charged on actuals at the kerb — so none of this can be inferred from the
 * route, the source or the price. Mercury normalises every taxi source into one
 * `vendor_charges` block; this module is the only place that reads it.
 *
 * THE THREE-STATE RULE, which the whole component hangs on: `true` = already inside
 * the total, `false` = the driver collects it on top, `null`/absent = the supplier
 * does not itemise. Never render `null` as "not included" — that is the failure this
 * feature exists to prevent, in the opposite direction. Every helper below drops
 * nulls rather than guessing, so a supplier that itemises nothing renders a
 * byte-identical card to the one it renders today.
 */

/** The block, from a search quote or from any of the booked shapes. */
export const getVendorCharges = (source) =>
  source?.price?.vendor_charges ??
  source?.transfer_details?.quote?.price?.vendor_charges ??
  // Multicity/roundtrip parents carry no stored quote, so mercury lifts the block
  // onto the booking itself, beside the fleet manifest.
  source?.transfer_details?.vendor_charges ??
  source?.quote?.price?.vendor_charges ??
  source?.vendor_charges ??
  null;

/**
 * Supplier HTML is never trustworthy as a presence check: several sources send an
 * empty string, and Gozo sends a fully-formed `<div><ul></ul></div>` carrying no
 * words at all. Strip the tags and ask whether anything readable is left.
 */
const hasPolicyContent = (html) =>
  typeof html === "string" && html.replace(/<[^>]*>/g, "").trim().length > 0;

/**
 * The cancellation terms for a quote, as the supplier's own HTML.
 *
 * Every taxi source states these, but not in the same place: search quotes carry
 * them on `price`, the multicity/roundtrip suggestion quotes carry them on the
 * quote's `price` too, and the booked shapes bury them under `transfer_details`.
 * Singular and plural spellings both occur. Resolved in one place so a card only
 * has to hand over the quote it already has.
 */
export const getCancellationPolicy = (source) =>
  [
    source?.price?.cancellation_policy,
    source?.price?.cancellation_policies,
    source?.transfer_details?.quote?.price?.cancellation_policy,
    source?.transfer_details?.quote?.price?.cancellation_policies,
    source?.transfer_details?.cancellation_policy,
    source?.transfer_details?.cancellation_policies,
    source?.quote?.price?.cancellation_policy,
    source?.quote?.price?.cancellation_policies,
    source?.cancellation_policy,
    source?.cancellation_policies,
  ].find(hasPolicyContent) || null;

const isPositive = (value) => Number.isFinite(Number(value)) && Number(value) > 0;

/**
 * Charge amounts keep their decimals; fares do not.
 *
 * getIndianPrice rounds to a whole unit, which is right for a ₹12,650 total and
 * wrong for everything in this block: a real ₹10.25/km rate prints as "₹10", and
 * once converted for a non-INR search a $0.14/km rate prints as "$0" — telling the
 * traveller that excess kilometres are free. Rates and small fees are exactly the
 * members most likely to fall below one unit, so they are formatted at a precision
 * that cannot round them away, while anything large enough to want the lakh/crore
 * grouping still goes through getIndianPrice.
 */
const money = (value, symbol) => {
  const amount = Number(value);
  if (Number.isInteger(amount) || Math.abs(amount) >= 1000) {
    return `${symbol}${getIndianPrice(amount)}`;
  }
  const text = Math.abs(amount) >= 1 ? amount.toFixed(2) : amount.toPrecision(2);
  // Trim only trailing zeros of the decimal part: 10.50 -> 10.5, 10.00 -> 10.
  return `${symbol}${text.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")}`;
};

/** ["tolls", "state tax"] -> "tolls & state tax" */
const joinList = (items) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} & ${items[items.length - 1]}`;

const sentenceCase = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

/**
 * The block -> the lines we are willing to state, in reading order.
 *
 * Tolls, state tax, driver allowance and night charges are grouped into ONE
 * included line and ONE on-actuals line rather than a chip each: "tolls & state tax
 * not included — charged on actuals" is the sentence a traveller needs, and six
 * separate pills saying the same thing is how a card stops being read at all.
 */
export const summariseVendorCharges = (charges, currencySymbol = "₹") => {
  if (!charges || typeof charges !== "object") return [];

  const symbol = charges.currency === "INR" ? "₹" : currencySymbol;
  const included = [];
  const onActuals = [];

  if (charges.toll_included === true) {
    included.push(isPositive(charges.toll_tax) ? `tolls (${money(charges.toll_tax, symbol)})` : "tolls");
  } else if (charges.toll_included === false) {
    onActuals.push("tolls");
  }

  if (charges.state_tax_included === true) {
    included.push(
      isPositive(charges.state_tax) ? `state tax (${money(charges.state_tax, symbol)})` : "state tax",
    );
  } else if (charges.state_tax_included === false) {
    onActuals.push("state tax");
  }

  // An allowance the supplier quotes at zero is not a fact worth a chip — it means
  // the driver's day is already inside the fare, which "all-inclusive" covers better.
  if (isPositive(charges.driver_allowance)) {
    included.push(`driver allowance ${money(charges.driver_allowance, symbol)}`);
  }

  const night = [charges.night_pickup_included, charges.night_drop_included];
  if (night.every((flag) => flag === true)) included.push("night charges");
  else if (night.some((flag) => flag === false)) onActuals.push("night charges");

  const lines = [];
  if (included.length) {
    lines.push({ tone: "included", text: sentenceCase(`${joinList(included)} included`) });
  }
  if (onActuals.length) {
    lines.push({
      tone: "extra",
      text: sentenceCase(`${joinList(onActuals)} not included — charged on actuals`),
    });
  }
  // Only worth saying when nothing above was said: beside a real breakdown it is
  // noise, and on its own it is the whole answer for the all-in-fare suppliers.
  if (!lines.length && charges.all_inclusive === true) {
    lines.push({ tone: "included", text: "All-inclusive fare — nothing payable to the driver" });
  }
  if (isPositive(charges.airport_entry_fee)) {
    lines.push({ tone: "neutral", text: `Airport entry ${money(charges.airport_entry_fee, symbol)}` });
  }
  if (isPositive(charges.extra_per_km_rate)) {
    lines.push({ tone: "neutral", text: `Extra km @ ${money(charges.extra_per_km_rate, symbol)}/km` });
  }
  return lines;
};

/**
 * Whether the chip row below would put anything on screen — the same three tests it
 * makes itself, so a wrapper can decide not to open a flex gap around nothing.
 */
const hasChipContent = (charges, currencySymbol, includedItems) =>
  summariseVendorCharges(charges, currencySymbol).length > 0 ||
  (Array.isArray(charges?.instructions) && charges.instructions.length > 0) ||
  (includedItems &&
    Array.isArray(charges?.included_items) &&
    charges.included_items.filter(Boolean).length > 0);

const TONE_CLASSES = {
  included: "bg-[#f1f5ea] text-[#3f5a2f]",
  extra: "bg-[#fdf3e7] text-[#8a5a1b]",
  neutral: "bg-[#f4f4f4] text-[#5c5c5c]",
};

/**
 * The chip row for a search-result card. Renders nothing when the supplier said
 * nothing, so it can be dropped into a card unconditionally.
 *
 * `included_items` is deliberately NOT rendered here: on the search card those are
 * already shown by AmenitySelector, which owns the same list. The booked surfaces
 * have no AmenitySelector, which is what vendorChargeFacts below is for.
 */
export const VendorChargeChips = ({
  charges,
  currencySymbol = "₹",
  className = "",
  includedItems = false,
}) => {
  const lines = summariseVendorCharges(charges, currencySymbol);
  const instructions = Array.isArray(charges?.instructions) ? charges.instructions : [];
  // Opt-in, because on a Mozio card AmenitySelector is already listing exactly
  // these. The multicity and roundtrip cards have no AmenitySelector, so they ask
  // for them here rather than dropping them on the floor.
  const items =
    includedItems && Array.isArray(charges?.included_items)
      ? charges.included_items.filter(Boolean)
      : [];
  if (!lines.length && !instructions.length && !items.length) return null;

  return (
    <div className={`flex flex-col gap-1 pt-1.5 ${className}`}>
      {lines.length || items.length ? (
        <div className="flex flex-wrap gap-1">
          {lines.map((line) => (
            <span
              key={line.text}
              className={`text-[11px] px-2 py-[2px] rounded-full whitespace-nowrap ${TONE_CLASSES[line.tone]}`}
            >
              {line.text}
            </span>
          ))}
          {items.map((item) => (
            <span
              key={`item-${item}`}
              className={`text-[11px] px-2 py-[2px] rounded-full whitespace-nowrap ${TONE_CLASSES.included}`}
            >
              {item} included
            </span>
          ))}
        </div>
      ) : null}
      {instructions.length ? (
        <p
          className="text-[11px] leading-[1.4] text-[#7A7A7A] m-0"
          title={instructions.join("\n")}
        >
          {instructions.join(" · ")}
        </p>
      ) : null}
    </div>
  );
};

/**
 * The supplier's cancellation terms, folded away behind a one-line toggle.
 *
 * This copy runs to a dozen lines of `<ul>` on every source that sends it, so it
 * cannot sit open on a search card — seven quotes would bury the prices under
 * seven identical policies. Closed it costs one line; open it reads in place,
 * under the quote it actually belongs to, which is the whole point: the policy
 * differs per cab (a Gozo economy cab and a Self-supplied Innova on the same
 * route do not cancel alike), so a single policy block for the search results
 * would be stating one cab's terms over all of them.
 *
 * `ttw-policy-html` is the same class PolicyNote uses in the booking drawers —
 * globals.css normalises the providers' loose markup there, and this reuses it
 * rather than guessing at list and paragraph spacing a second time.
 */
export const CancellationNote = ({
  html,
  label = "Cancellation policy",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  if (!hasPolicyContent(html)) return null;

  return (
    <div className={`pt-1.5 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={(event) => {
          // Several of these cards make the whole row a select target; opening the
          // terms must not also pick the cab.
          event.preventDefault();
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-0.5 bg-transparent border-0 p-0 cursor-pointer text-[11px] text-[#445069] underline underline-offset-2 focus:outline-none"
      >
        {label}
        {open ? (
          <MdKeyboardArrowUp size={14} />
        ) : (
          <MdKeyboardArrowDown size={14} />
        )}
      </button>
      {open ? (
        <div
          className="ttw-policy-html text-[11px] leading-[1.5] text-[#445069] mt-1 rounded-lg bg-[#faf9f4] px-2.5 py-2"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : null}
    </div>
  );
};

/**
 * Everything a search card owes the traveller about one quote's terms: what the
 * fare covers, and how it cancels.
 *
 * Takes the whole quote rather than its parts, because the four taxi search
 * surfaces hold quotes in three different shapes — `price`-rooted for the search
 * results and the multicity suggestions, `transfer_details`-rooted for the legacy
 * roundtrip rows — and the resolvers above already know all of them. Renders
 * nothing at all when a supplier stated neither, so it drops into a card
 * unconditionally.
 */
export const QuoteTerms = ({
  quote,
  currencySymbol = "₹",
  includedItems = false,
  className = "",
}) => {
  const charges = getVendorCharges(quote);
  const policy = getCancellationPolicy(quote);
  // Nothing rather than an empty element: every one of these cards stacks its rows
  // in a `flex flex-col gap-*`, where a childless <div> still costs a gap.
  if (!hasChipContent(charges, currencySymbol, includedItems) && !policy) return null;

  return (
    <div className={className}>
      <VendorChargeChips
        charges={charges}
        currencySymbol={currencySymbol}
        includedItems={includedItems}
      />
      <CancellationNote html={policy} />
    </div>
  );
};

/**
 * The same facts shaped for FactChips on a booked-taxi surface. FactChips already
 * drops empty values, so a partial supplier block needs no guarding here.
 */
export const vendorChargeFacts = (charges, currencySymbol = "₹") => {
  const facts = summariseVendorCharges(charges, currencySymbol).map((line) => ({
    label: null,
    value: line.text,
  }));
  const items = Array.isArray(charges?.included_items) ? charges.included_items : [];
  items.forEach((item) => facts.push({ label: null, value: `${item} included` }));
  return facts;
};

export default VendorChargeChips;
