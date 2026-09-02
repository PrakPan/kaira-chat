import React from "react";
import { useRouter } from "next/router";

import { MERCURY_HOST } from "../../../../../services/constants";
import useBookingDetail from "./useBookingDetail";
import {
  Bullets,
  DetailFailed,
  DetailSection,
  DetailSkeleton,
  FactChips,
  Photos,
  Prose,
} from "./primitives";

// ─────────────────────────────────────────────────────────────────────────────
//  AncillaryDetail — the booked visa or eSIM, off the same endpoint every other
//  booking on this surface reads.
//
//  "Before you fly" used to be the one row that opened into nothing real. The
//  sheet described it from the view model's tally alone — "A data plan so you
//  land connected", ESIM · 1 plan, STATUS · In your package — which is a
//  sentence about the category, not the booking. Everything a traveller opens
//  that row to check (how much data, how long it lasts, which countries it
//  covers, how to install it; for a visa: the entry type, the processing time,
//  what documents it needs) sat behind a booking endpoint this surface never
//  called.
//
//  ONE ENDPOINT, BOTH KINDS: /itinerary/<id>/bookings/ancillary/<booking>/ —
//  visas and eSIMs are both AncillaryBookings server-side, and the booking
//  carries the supplier snapshot taken when it was made under
//  `external_data.visa` / `external_data.package`. Deliberately NOT the
//  supplier detail endpoints (ancillaries/visa/detail, esim/packages/detail):
//  those re-quote a live price and 502 once a package is pulled, neither of
//  which should decide whether a saved booking opens. It is the same call, and
//  the same reasoning, as getAncillaryBookingDetail in
//  services/ancillaries/ancillaryBookingServices.js.
//
//  WHAT IT IS NOT: the desktop VisaDetailDrawer / EsimDetailDrawer. Those are
//  built around picking and buying — a price card, a hero quote, "Add to Cart"
//  — and the price is the one thing that must never appear on a package
//  surface. Same facts, this itinerary's layout, no amount anywhere.
// ─────────────────────────────────────────────────────────────────────────────

const clean = (list) => (Array.isArray(list) ? list.filter(Boolean) : []);

/** `single_entry` → "Single Entry". Supplier enums are snake_case. */
const titleCase = (value) =>
  value
    ? String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

// stay_period / validity / processing_time are free text, and some rows arrive
// as "0Upto 90 Days" — drop a leading zero that runs straight into a word, the
// same normalisation the desktop visa drawer applies so one booking never reads
// two different ways.
const period = (value) =>
  value ? String(value).replace(/^0(?=[A-Za-z])/, "").trim() || null : null;

/**
 * Supplier install notes come through as markup; this sheet renders text.
 *
 * Tags become a SPACE rather than nothing, or "…from <b>Settings</b>" comes out
 * as one word — but that then leaves the space stranded in front of whatever
 * punctuation followed the tag ("Settings ."), so it is pulled back off.
 */
const stripHtml = (html) =>
  typeof html === "string"
    ? html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\s+([.,;:!?)])/g, "$1")
        .trim() || null
    : null;

/** Who the booking is for — off the booking itself, not the trip's totals. */
const paxLabel = (booking) => {
  const adults = booking?.number_of_adults || 0;
  const children = booking?.number_of_children || 0;
  const infants = booking?.number_of_infants || 0;
  const parts = [
    adults ? `${adults} adult${adults > 1 ? "s" : ""}` : null,
    children ? `${children} child${children > 1 ? "ren" : ""}` : null,
    infants ? `${infants} infant${infants > 1 ? "s" : ""}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
};

/** An eSIM's supplier snapshot: what it gives you, and how to switch it on. */
function EsimBody({ pkg, booking }) {
  // `image` is a URL on some suppliers and { url } on others.
  const image =
    typeof pkg?.image === "string" ? pkg.image : pkg?.image?.url || null;

  // The two things a traveller actually has to DO with an eSIM, in one place —
  // three separate one-line boxes on desktop, which is three boxes' worth of
  // chrome for three sentences.
  const setup = [
    pkg?.install_window_days != null
      ? `Install it within ${pkg.install_window_days} day${
          pkg.install_window_days > 1 ? "s" : ""
        } of purchase.`
      : null,
    pkg?.apn_type ? `APN type: ${pkg.apn_type}` : null,
    pkg?.apn_value ? `APN: ${pkg.apn_value}` : null,
    stripHtml(pkg?.qr_installation),
  ].filter(Boolean);

  return (
    <>
      {image ? <Photos images={[image]} alt={pkg?.title || "eSIM"} /> : null}

      <FactChips
        className="px-4 pb-4"
        padded={false}
        facts={[
          // Unlimited plans send a `data` string that says so already on some
          // suppliers and nothing at all on others; the flag is the reliable one.
          {
            label: "Data",
            value: pkg?.is_unlimited ? "Unlimited" : pkg?.data || null,
          },
          {
            label: "Valid for",
            value:
              pkg?.day != null ? `${pkg.day} day${pkg.day > 1 ? "s" : ""}` : null,
          },
          {
            label: "Covers",
            value: pkg?.country?.name || pkg?.country_code || null,
          },
          { label: "Network", value: pkg?.esim_type || null },
          { label: "Plan", value: titleCase(pkg?.plan_type) },
          { label: "Activation", value: titleCase(pkg?.activation_policy) },
          { label: "Roaming", value: pkg?.is_roaming ? "Included" : null },
          { label: "Top-ups", value: pkg?.rechargeability ? "Allowed" : null },
          { label: "Travellers", value: paxLabel(booking) },
        ]}
      />

      {clean(pkg?.info).length ? (
        <DetailSection label="What's included">
          <Bullets
            columns={1}
            items={clean(pkg.info).filter((item) => typeof item === "string")}
          />
        </DetailSection>
      ) : null}

      {pkg?.other_info ? (
        <DetailSection label="Coverage">
          <Prose text={pkg.other_info} />
        </DetailSection>
      ) : null}

      {pkg?.fair_usage_policy ? (
        <DetailSection label="Fair usage">
          <Prose text={pkg.fair_usage_policy} />
        </DetailSection>
      ) : null}

      {setup.length ? (
        <DetailSection label="Setting it up">
          <Bullets columns={1} items={setup} />
        </DetailSection>
      ) : null}

      {/* Last: a warning is about a plan you have already read the shape of. */}
      {pkg?.warning ? (
        <DetailSection label="Note">
          <Prose text={pkg.warning} />
        </DetailSection>
      ) : null}
    </>
  );
}

/** A visa's supplier snapshot: what it permits, and what it needs from you. */
function VisaBody({ visa, booking }) {
  return (
    <>
      <FactChips
        className="px-4 pb-4"
        padded={false}
        facts={[
          { label: "Country", value: visa?.country?.name || null },
          { label: "Visa type", value: titleCase(visa?.category) },
          { label: "Entry", value: titleCase(visa?.entry_type) },
          { label: "Purpose", value: titleCase(visa?.purpose) },
          { label: "Processing", value: titleCase(visa?.processing_type) },
          { label: "Processing time", value: period(visa?.processing_time) },
          { label: "Stay period", value: period(visa?.stay_period) },
          { label: "Validity", value: period(visa?.validity) },
          { label: "Travellers", value: paxLabel(booking) },
        ]}
      />

      {visa?.description ? (
        <DetailSection label="About">
          <Prose text={visa.description} />
        </DetailSection>
      ) : null}

      {clean(visa?.inclusions).length ? (
        <DetailSection label="What's included">
          <Bullets columns={1} items={clean(visa.inclusions)} />
        </DetailSection>
      ) : null}

      {visa?.requirements ? (
        <DetailSection label="Requirements">
          <Prose text={visa.requirements} />
        </DetailSection>
      ) : null}

      {/* The checklist is a supplier PDF. It opens in a tab rather than
          downloading: this sheet can be open inside a browser that treats a
          download as a navigation away from the trip. */}
      {visa?.checklist_file ? (
        <DetailSection label="Documents">
          <div className="px-4 pb-4">
            <a
              href={visa.checklist_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-[600] text-[#1a4fd6] underline"
            >
              Document checklist
            </a>
          </div>
        </DetailSection>
      ) : null}
    </>
  );
}

export default function AncillaryDetail({ bookingId, type, heading }) {
  const router = useRouter();
  // sessionId is how the chat itinerary route carries the same id.
  const itineraryId = router?.query?.id || router?.query?.sessionId;

  const url =
    itineraryId && bookingId
      ? `${MERCURY_HOST}/api/v1/itinerary/${itineraryId}/bookings/ancillary/${bookingId}/`
      : null;

  const { loading, data, error, retry } = useBookingDetail(url);

  if (loading) return <DetailSkeleton />;
  if (error || !data) return <DetailFailed onRetry={retry} />;

  // `type` comes from the trip view model, which reads the cart's raw booking;
  // the fetched booking states it too, and is the one to trust when they differ.
  const isVisa = (data.booking_type || type) === "Visa";
  const snapshot = data.external_data || {};
  const record = isVisa ? snapshot.visa : snapshot.package;

  return (
    <div className="flex flex-col pb-[10px] pt-[12px]">
      {/* Only when the sheet is showing more than one of these — with a single
          booking the header two rows up already names it. */}
      {heading ? (
        <div className="px-4 pb-[10px] font-mono text-[9.5px] tracking-[0.08em] text-[#8a93a6]">
          {heading}
        </div>
      ) : null}

      {isVisa ? (
        <VisaBody visa={record} booking={data} />
      ) : (
        <EsimBody pkg={record} booking={data} />
      )}
    </div>
  );
}
