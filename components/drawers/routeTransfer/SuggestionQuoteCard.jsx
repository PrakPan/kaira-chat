import React, { useState } from "react";
import { MdOutlineLuggage } from "react-icons/md";
import { PiGasPumpFill, PiUsersThreeFill } from "react-icons/pi";
import { PulseLoader } from "react-spinners";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { optimizedMediaUrl } from "../../../lib/mediaImage";
import { TaxiTypeGlyph } from "../../../helper/taxiTypeGlyph";
import { QuoteTerms, QuoteTermsSheet } from "../../modals/taxis/VendorCharges";
import {
  MultiVehicleNote,
  PerTaxiPrice,
  VehicleCountBadge,
} from "../../modals/taxis/MultiVehicleInfo";
import QuantityStepper from "../../modals/taxis/fleet/QuantityStepper";

/**
 * The multicity / round-trip / sightseeing suggestion card, split in two.
 *
 * A suggestion is one route plan priced in several vehicle classes. It used to
 * render as a single bordered block: the route on top and every cab stacked
 * under it behind radio buttons, with one "Update Transfer" button at the very
 * bottom of the drawer. That made the cabs read as details of the route rather
 * than as the things being chosen, and put the commit a scroll away from the
 * price it commits.
 *
 * So the route becomes a header (`SuggestionHeader`) and each priced cab becomes
 * its own card (`SuggestionQuoteCard`) carrying its own photo, its own facts and
 * its own CTA — the same shape the taxi search results use, so a customer moving
 * between the two lists is looking at one design.
 *
 * The exception is a party too large for any single cab: there the drawer turns
 * the CTA into a quantity stepper and the drawer's own bar commits the whole
 * convoy as ONE booking, because committing per card would just replace the
 * previous car. `fleetMode` selects that behaviour.
 */

/** Both quote shapes in one: multicity rows carry `taxi_category`/`price`, round-trip rows `transfer_details`. */
export const normalizeQuoteCategory = (quote) =>
  quote?.taxi_category || quote?.transfer_details || {};

export const quoteTitle = (quote) => {
  const category = normalizeQuoteCategory(quote);
  return category?.model_name || category?.type || "Taxi";
};

/** One fact — seats, bags, fuel — drawn the same way in every card. */
const Fact = ({ icon: Icon, children }) =>
  children ? (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <Icon size={15} className="text-[#8a93a6]" style={{ flex: "none" }} />
      {children}
    </span>
  ) : null;

/**
 * The supplier's photo of this class of cab, falling back to a silhouette of the
 * class itself. `taxi_category.image` is empty on a fair number of priced
 * vehicles, and a tile that disappears with it leaves the list ragged exactly
 * where the customer is comparing cars by size.
 */
const VehicleThumb = ({ image, type, modelName }) => {
  const [failed, setFailed] = useState(false);
  const showImage = !!image && !failed;

  return (
    <div className="flex-none w-[96px] h-[68px] max-ph:w-[72px] max-ph:h-[54px] rounded-xl bg-[#f4f3ec] flex items-center justify-center overflow-hidden">
      {showImage ? (
        <img
          src={optimizedMediaUrl(image, { width: 400 })}
          alt={modelName || type || "Taxi"}
          loading="lazy"
          decoding="async"
          // Sized and painted inline: the app's unscoped `img {}` rules
          // otherwise crop this to fill and run it through the hero blur.
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "none",
            objectFit: "contain",
            margin: 0,
            filter: "none",
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        <TaxiTypeGlyph type={type} modelName={modelName} size={58} />
      )}
    </div>
  );
};

/**
 * The route plan a set of quotes prices: what it is, how far, how long and which
 * legs it covers. Sits above the cards rather than wrapping them.
 */
export const SuggestionHeader = ({
  title,
  distance,
  duration,
  routes = [],
  routesLabel = "Routes",
}) => (
  <div className="w-full flex flex-col gap-sm">
    <div className="flex flex-col gap-xxs min-w-0">
      {title ? (
        <div className="text-md font-600 leading-xl text-[#0b1220]">{title}</div>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 ttw-type-small text-[#445069]">
        {distance ? <span>{distance} Kms</span> : null}
        {distance && duration ? <span className="text-[#c8cdd8]">•</span> : null}
        {duration ? <span>{duration}</span> : null}
      </div>
    </div>

    {routes?.length ? (
      <div className="rounded-2xl bg-[#faf9f4] border-sm border-solid border-[#ececec] px-md py-sm">
        <div className="ttw-type-label text-[#8a93a6] mb-xs">{routesLabel}</div>
        <div className="flex flex-col">
          {routes.map((route, i) => (
            <div
              key={`route-${i}`}
              className="flex flex-row items-stretch gap-2"
            >
              {/* Dot-and-rail: the legs run in order, so draw them as one line. */}
              <div className="flex flex-col items-center w-3 flex-none">
                <span className="w-[7px] h-[7px] mt-[7px] rounded-full bg-[#f7e700] border-sm border-solid border-[#c9bc00]" />
                {i < routes.length - 1 ? (
                  <span className="w-[1px] flex-1 bg-[#e3e0cf]" />
                ) : null}
              </div>
              <div
                className={`ttw-type-body text-[#0b1220] ${
                  i < routes.length - 1 ? "pb-xs" : ""
                }`}
              >
                {route?.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null}
  </div>
);

const SuggestionQuoteCard = ({
  quote,
  currencySymbol = "₹",
  total,
  vehicleCount = 1,
  perVehicleTotal,
  isMixedFleet = false,
  // Commit state, all owned by the drawer.
  added = false,
  busy = false,
  disabled = false,
  ctaLabel = "Add to Itinerary",
  onAdd,
  // Convoy mode: the stepper replaces the CTA and the drawer's bar commits.
  fleetMode = false,
  quantity = 0,
  onQuantityChange,
}) => {
  const category = normalizeQuoteCategory(quote);
  const bags = category?.bag_capacity || category?.bagCapacity;
  const bigBags = category?.bigBagCapaCity;
  // Only honest when the cabs are identical.
  const perTaxiFacts = vehicleCount > 1 && !isMixedFleet;

  return (
    <div
      className={`w-full flex flex-col rounded-3xl border-sm border-solid p-md transition-colors ${
        added
          ? "border-[#f7e700] bg-[#fffde7]"
          : "border-[#ececec] bg-white hover:bg-[#faf9f4]"
      }`}
    >
      <div className="flex justify-between items-start gap-3 max-ph:flex-col max-ph:items-stretch">
        <div className="flex gap-3 items-start flex-1 min-w-0">
          <VehicleThumb
            image={category?.image}
            type={category?.type}
            modelName={category?.model_name}
          />

          <div className="flex-1 min-w-0 flex flex-col gap-xxs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-md font-600 leading-xl text-[#0b1220]">
                {category?.model_name || category?.type || "Taxi"}
              </span>
              <VehicleCountBadge count={vehicleCount} />
              {quantity > 0 ? (
                <span className="shrink-0 ttw-type-small font-600 px-2 py-[2px] rounded-full bg-[#fff6cc] text-[#6b5600] whitespace-nowrap">
                  {quantity} added
                </span>
              ) : null}
            </div>

            {category?.model_name && category?.type ? (
              <div className="ttw-type-small text-[#445069]">
                {category.type}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 ttw-type-small text-[#445069]">
              <Fact icon={PiUsersThreeFill}>
                {category?.seating_capacity
                  ? `${category.seating_capacity} seats`
                  : null}
              </Fact>
              <Fact icon={MdOutlineLuggage}>
                {bags ? `${bags} bags` : null}
              </Fact>
              <Fact icon={MdOutlineLuggage}>
                {bigBags ? `${bigBags} big bags` : null}
              </Fact>
              <Fact icon={PiGasPumpFill}>
                {category?.fuel_type ? category.fuel_type : null}
              </Fact>
              {perTaxiFacts ? <span>(per taxi)</span> : null}
            </div>

            <MultiVehicleNote
              count={vehicleCount}
              seatingCapacity={category?.seating_capacity}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-none max-ph:flex-row max-ph:items-center max-ph:justify-between max-ph:w-full">
          <div className="flex flex-col items-end max-ph:items-start">
            <span className="text-lg font-mono text-[#0b1220]">
              {currencySymbol}
              {getIndianPrice(Math.ceil(Number(total) || 0))}
            </span>
            <PerTaxiPrice
              count={vehicleCount}
              perVehicleTotal={perVehicleTotal}
              symbol={currencySymbol}
            />
          </div>

          {fleetMode ? (
            // The commit lives in the drawer's bar: this leg is one booking
            // however many cars it holds.
            <QuantityStepper
              value={quantity}
              disabled={disabled}
              label={category?.model_name || category?.type || "taxi"}
              onChange={(next) => onQuantityChange?.(next)}
            />
          ) : busy ? (
            <div className="flex items-center justify-center px-4 py-2">
              <PulseLoader size={8} speedMultiplier={0.6} color="#111" />
            </div>
          ) : added ? (
            <button
              type="button"
              disabled
              className="ttw-btn-secondary-fill max-ph:w-full max-ph:max-w-[172px]"
            >
              Added
            </button>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              disabled={disabled}
              // Capped rather than left at `w-full`: the phone row is
              // price-left / CTA-right, and a button stretched across the
              // remaining half of the card read as the card's own footer. The
              // cap still lets it shrink on a narrow phone, which a fixed width
              // would not — and the label is `white-space: nowrap`.
              className="ttw-btn-fill-yellow max-ph:w-full max-ph:max-w-[172px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>

      {/* What this fare already covers and how it cancels, per the supplier. A
          multi-city chain is exactly where tolls and state tax get charged on
          actuals at the kerb, so the card that omits them is the misleading one.
          Renders nothing when the quote states neither.

          Two renderings of the same facts, picked by CSS rather than by
          useMediaQuery — which starts false on the server and would flash the
          wrong branch through hydration on exactly the phones this is for. On a
          desktop card the chips and the fold-out policy cost a couple of lines
          under a wide row; on a phone the row is already stacked, and six chips
          plus a policy toggle per cab turned a five-cab suggestion into three
          screens of scrolling, so there the whole block collapses to one line
          into a bottom sheet.

          The two hidden-classes complement each other exactly: `max-ph` is
          `max-width: 768px` and `ph-up` is its `min-width: 768.02px` twin (see
          tailwind.config.js). Pairing `max-ph:hidden` with `md:hidden` instead
          would hide BOTH halves at exactly 768px, where `md`'s min-width:768px
          and `max-ph`'s max-width:768px overlap. */}
      <QuoteTerms
        quote={quote}
        currencySymbol={currencySymbol}
        includedItems
        className="mt-xs max-ph:hidden"
      />
      <QuoteTermsSheet
        quote={quote}
        currencySymbol={currencySymbol}
        includedItems
        title={category?.model_name || category?.type || "Taxi"}
        subtitle={
          category?.model_name && category?.type ? category.type : null
        }
        className="mt-sm ph-up:hidden"
      />
    </div>
  );
};

export default SuggestionQuoteCard;
