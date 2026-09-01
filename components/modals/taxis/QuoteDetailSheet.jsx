import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  MdClose,
  MdInfoOutline,
  MdKeyboardArrowRight,
  MdOutlineLuggage,
} from "react-icons/md";
import { PiGasPumpFill, PiUsersThreeFill } from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import { getIndianPrice } from "../../../services/getIndianPrice";
import DetailSection from "../../revamp/common/components/bookingDetail/DetailSection";
import FactChips from "../../revamp/common/components/bookingDetail/FactChips";
import FleetVehicles from "../../revamp/common/components/bookingDetail/FleetVehicles";
import PolicyNote from "../../revamp/common/components/bookingDetail/PolicyNote";
import VehiclePhoto from "../../revamp/common/components/bookingDetail/VehiclePhoto";
import QuantityStepper from "./fleet/QuantityStepper";
import {
  getFleetManifest,
  MultiVehicleNote,
  PerTaxiPrice,
  VehicleCountBadge,
} from "./MultiVehicleInfo";
import {
  getCancellationPolicy,
  getVendorCharges,
  sectionTerms,
} from "./VendorCharges";
import { normalizeQuoteCategory } from "./quoteShape";

/** The tones QuoteTerms paints as chips, as a bullet — a full-width row needs no pill. */
const DOT_COLORS = {
  included: "#7d9b4e",
  extra: "#c98a2e",
  neutral: "#9aa0ac",
};

/**
 * Everything known about ONE priced cab of a suggestion, as a phone sheet.
 *
 * Shared by every taxi surface that lists priced quotes: the multicity and
 * round-trip suggestion cards, and the search results in the one-way, pickup /
 * drop and combo drawers.
 *
 * The card in the list can only afford a thumbnail, a name and four facts, and
 * on a multicity chain that is the least of what a traveller is deciding on:
 * whether the fare covers the tolls of five states, what the driver still
 * collects at the kerb, and how the thing cancels. That used to live behind a
 * "Fare details" row opening `QuoteTermsSheet`, which showed the terms and
 * nothing about the car itself — so the traveller had to hold the cab's specs
 * in their head while reading its terms.
 *
 * This replaces that row with the taxi's own detail drawer: the same shape the
 * booked-taxi drawers use (hero photo, fact chips, sectioned body, policy at the
 * bottom) built from the same components, over a quote instead of a booking. It
 * commits too — the CTA at the bottom is the card's, so a traveller who read the
 * details does not have to dismiss the sheet to act on them.
 *
 * A fixed 95vh rather than a content hug: these quotes state anything from one
 * line to a dozen, and a sheet that resized itself per cab put the same control
 * in a different place on every card.
 *
 * The route plan is deliberately absent — it is stated once in the suggestion
 * header the cards sit under, and a second copy per cab only pushes the terms
 * further down.
 *
 * Portals to `document.body` because the card sits inside a drawer with its own
 * stacking context and `overflow`; z-1666 is the layer these drawers' own modals
 * use, i.e. above the 1501 drawers themselves.
 */
const QuoteDetailSheet = ({
  open,
  onClose,
  quote,
  currencySymbol = "₹",
  total,
  vehicleCount = 1,
  perVehicleTotal,
  isMixedFleet = false,
  // Commit state, mirrored from the card so the sheet can act rather than just read.
  added = false,
  busy = false,
  disabled = false,
  // Spelled out, unlike the card's "+ Add": a pinned bar with a screen to
  // itself has room to say what the button does.
  ctaLabel = "Add to Itinerary",
  // What the button says once this quote is the one in the itinerary. The taxi
  // search calls that state "Selected"; the suggestion cards call it "Added".
  addedLabel = "Added",
  onAdd,
  fleetMode = false,
  quantity = 0,
  onQuantityChange,
  // What the fare already bundles — the supplier's `included_items` and its
  // amenity list. Off for a card that lists them itself: the taxi search card
  // carries an AmenitySelector over the very same list, and a sheet opened from
  // it would state everything twice.
  includedExtras = true,
  // The sheet outlives its trigger if a tablet is rotated past the breakpoint,
  // so it carries the same breakpoint class the trigger does.
  mobileOnlyClass = "ph-up:hidden",
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const category = normalizeQuoteCategory(quote);
  const modelName = category?.model_name;
  const type = category?.type;
  const name = modelName || type || "Taxi";
  const bags = category?.bag_capacity || category?.bagCapacity;
  const bigBags = category?.bigBagCapaCity;

  const fleet = getFleetManifest(quote);
  // Seats and bags describe ONE cab; only honest as a headline when the cabs match.
  const perTaxiFacts = vehicleCount > 1 && !isMixedFleet;

  const charges = getVendorCharges(quote);
  const policy = getCancellationPolicy(quote);
  const sections = sectionTerms(charges, currencySymbol, includedExtras);
  const instructions = Array.isArray(charges?.instructions)
    ? charges.instructions
    : [];
  // Only Mozio quotes carry these. Read-only here: picking extras belongs to the
  // search card that can re-price them.
  const amenities = (
    includedExtras && Array.isArray(quote?.amenities) ? quote.amenities : []
  ).filter((item) => item?.key);

  const facts = [
    {
      label: "Seats",
      icon: PiUsersThreeFill,
      value: category?.seating_capacity
        ? `${category.seating_capacity} seats`
        : null,
    },
    {
      label: "Bags",
      icon: MdOutlineLuggage,
      value: bags ? `${bags} bags` : null,
    },
    {
      label: "Big bags",
      icon: MdOutlineLuggage,
      value: bigBags ? `${bigBags} big bags` : null,
    },
    { label: "Fuel", icon: PiGasPumpFill, value: category?.fuel_type || null },
  ];

  const close = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    onClose?.();
  };

  const cta = fleetMode ? (
    // The commit lives in the drawer's bar: this leg is one booking however
    // many cars it holds.
    <QuantityStepper
      value={quantity}
      disabled={disabled}
      label={name}
      onChange={(next) => onQuantityChange?.(next)}
    />
  ) : busy ? (
    <div className="flex items-center justify-center px-6 py-2">
      <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
    </div>
  ) : added ? (
    <button type="button" disabled className="ttw-btn-secondary-fill">
      {addedLabel}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => onAdd?.()}
      disabled={disabled}
      className="ttw-btn-fill-yellow px-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {ctaLabel}
    </button>
  );

  const sheet = (
    <div
      className={`fixed inset-0 z-[1666] flex items-end justify-center ${mobileOnlyClass}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} details`}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(11,18,32,0.45)" }}
        onClick={close}
      />

      {/* 95% of the viewport. `95dvh` inline wins wherever it is understood and
          is simply dropped where it is not, leaving the class's 95vh — which is
          the case that matters, since a static vh on iOS measures the viewport
          WITHOUT Safari's toolbars and would push the pinned footer under
          them. */}
      <div
        className="relative w-full h-[95vh] flex flex-col overflow-hidden rounded-t-[20px] bg-white ttw-sheet-up"
        style={{ height: "95dvh" }}
      >
        <div className="flex justify-center pt-2 pb-1 flex-none">
          <span className="w-[44px] h-[4px] rounded-full bg-[#e0dccd]" />
        </div>

        <div className="flex items-start justify-between gap-3 px-4 pb-2 flex-none">
          <div className="min-w-0">
            <div className="text-md font-600 leading-xl text-[#0b1220] truncate">
              {name}
            </div>
            {modelName && type ? (
              <div className="text-[12px] leading-[1.4] text-[#445069]">
                {type}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-[#f4f3ec] border-0 p-0 cursor-pointer text-[#445069]"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pt-1"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <VehiclePhoto
            image={category?.image}
            alt={name}
            vehicleType={type}
            modelName={modelName}
            className="mx-4 mb-4"
          />

          {vehicleCount > 1 ? (
            <div className="px-4 pb-3 flex flex-col gap-2">
              <VehicleCountBadge count={vehicleCount} label={fleet?.label} />
              <MultiVehicleNote
                count={vehicleCount}
                seatingCapacity={category?.seating_capacity}
                fleet={fleet}
              />
            </div>
          ) : null}

          {/* One padded block rather than FactChips' own gutter, so the caveat
              under the chips belongs to them instead of floating a section
              apart. */}
          <div className="px-4 pb-4 flex flex-col gap-2">
            <FactChips facts={facts} padded={false} />
            {perTaxiFacts ? (
              <div className="ttw-type-small text-[#8a93a6]">
                Seats, bags and fuel describe a single taxi.
              </div>
            ) : null}
          </div>

          {/* A mixed convoy has no "the taxi" to photograph — the facts above
              describe its largest member only, so every cab is stated in full. */}
          {isMixedFleet && fleet?.vehicles?.length ? (
            <DetailSection label="Your taxis">
              <FleetVehicles vehicles={fleet.vehicles} />
            </DetailSection>
          ) : null}

          {sections.map((section) => (
            <DetailSection key={section.key} label={section.title}>
              <div className="px-4 pb-4 flex flex-col gap-1.5">
                {section.values.map((value) => (
                  <div
                    key={value}
                    className="flex items-start gap-2 text-[13px] leading-[1.5] text-[#0b1220]"
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full mt-[6px] flex-none"
                      style={{ background: DOT_COLORS[section.tone] }}
                    />
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </DetailSection>
          ))}

          {amenities.length ? (
            <DetailSection label="Extras">
              <div className="px-4 pb-4 flex flex-col gap-1.5">
                {amenities.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <span className="min-w-0 text-[13px] leading-[1.5] text-[#0b1220]">
                      {item.name || item.key}
                      {item.description ? (
                        <span className="block text-[11.5px] leading-snug text-[#7A7A7A]">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                    <span
                      className={`shrink-0 whitespace-nowrap text-[12.5px] font-600 ${
                        item.included || !Number(item.price || 0)
                          ? "text-[#3f5a2f]"
                          : "text-[#0b1220]"
                      }`}
                    >
                      {item.included
                        ? "Included"
                        : Number(item.price || 0)
                          ? `+${currencySymbol}${getIndianPrice(
                              Math.ceil(Number(item.price)),
                            )}`
                          : "Free"}
                    </span>
                  </div>
                ))}
              </div>
            </DetailSection>
          ) : null}

          {instructions.length ? (
            <DetailSection label="Good to know">
              <div className="px-4 pb-4 flex flex-col gap-1.5">
                {instructions.map((line) => (
                  <p
                    key={line}
                    className="text-[13px] leading-[1.5] text-[#445069] m-0"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </DetailSection>
          ) : null}

          <PolicyNote html={policy} title="Cancellation policy" />
        </div>

        <div
          className="flex-none border-t border-solid border-[#efede6] bg-white px-4 pt-3 flex items-center justify-between gap-3"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-col min-w-0">
            <span className="text-md font-600 font-mono text-[#0b1220]">
              {currencySymbol}
              {getIndianPrice(Math.ceil(Number(total) || 0))}
            </span>
            <PerTaxiPrice
              count={vehicleCount}
              perVehicleTotal={perVehicleTotal}
              symbol={currencySymbol}
            />
          </div>
          <div className="flex-none">{cta}</div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(sheet, document.body);
};

/**
 * The card's half of the arrangement: one tappable row on a phone, and the sheet
 * it opens.
 *
 * Every taxi list drops this in below its card body and forwards the same quote
 * it is already showing — the open state, the breakpoint and the label live here
 * so five lists cannot drift into five different rows. `max-ph`'s exact
 * complement `ph-up` hides it from a desktop card, which shows `QuoteTerms`
 * inline instead (see tailwind.config.js: pairing `max-ph:hidden` with
 * `md:hidden` would hide BOTH at exactly 768px).
 */
export const QuoteDetailRow = ({
  label = "Taxi details & policies",
  className = "mt-sm ph-up:hidden",
  onAdd,
  ...sheetProps
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={className}>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={(event) => {
            // Several of these cards make the whole row a select target;
            // reading the details must not also pick the cab.
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
          className="w-full flex items-center justify-between gap-2 rounded-xl border-sm border-solid border-[#ececec] bg-[#faf9f4] px-3 py-2 text-left cursor-pointer"
        >
          <span className="flex items-center gap-1.5 text-[12px] leading-[1.4] text-[#445069]">
            <MdInfoOutline
              size={15}
              className="text-[#8a93a6]"
              style={{ flex: "none" }}
            />
            {label}
          </span>
          <MdKeyboardArrowRight
            size={18}
            className="text-[#8a93a6]"
            style={{ flex: "none" }}
          />
        </button>
      </div>

      <QuoteDetailSheet
        {...sheetProps}
        open={open}
        onClose={() => setOpen(false)}
        // Committing from the sheet leaves it standing over a card that has
        // already changed underneath it; close it and let the list say so.
        onAdd={() => {
          setOpen(false);
          onAdd?.();
        }}
      />
    </>
  );
};

export default QuoteDetailSheet;
