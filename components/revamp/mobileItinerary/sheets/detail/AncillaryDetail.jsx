import React from "react";
import { useRouter } from "next/router";

import { MERCURY_HOST } from "../../../../../services/constants";
import StatusPill from "../../../common/components/bookingDetail/StatusPill";
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

/**
 * "11 Sept 2026", en-GB short — the format the desktop visa drawer prints its
 * travel dates in. Not dateFormat(): these arrive as ISO from the booking, not
 * as the suppliers' DD/MM/YYYY.
 */
const bookingDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/** The stay this booking covers: "11 Sept 2026 – 19 Sept 2026". */
const stayDates = (booking) => {
  const from = bookingDate(booking?.check_in);
  const to = bookingDate(booking?.check_out);
  if (!from) return null;
  return to && to !== from ? `${from} – ${to}` : from;
};

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

/**
 * `terms_and_guidelines` is one long paragraph on the booking. The desktop
 * drawer breaks it into points before showing it — on its own line breaks where
 * it has them, otherwise at sentence ends — and the same wall of text on a
 * phone is worse, not better. (No lookbehind in the sentence split: older iOS
 * Safari can't parse one.)
 */
const termsPoints = (text) => {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed) return [];
  const parts = trimmed.includes("\n")
    ? trimmed.split(/\n+/)
    : trimmed
        .split(/\.\s+(?=[A-Z])/)
        .map((point, i, all) => (i < all.length - 1 ? `${point}.` : point));
  return parts.map((point) => point.trim()).filter(Boolean);
};

/** The supplier PDF the traveller has to act on. */
const FileIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 15h6" />
    <path d="M9 11h3" />
  </svg>
);

const InfoIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

/** A block heading, in the drawer's weight rather than this sheet's mono. */
function BlockTitle({ children }) {
  return (
    <div className="ttw-type-body font-600 text-[#0b1220] mb-2">{children}</div>
  );
}

/** The drawer's bulleted list: a small dot, and text that wraps under itself. */
function Points({ items, tone = "text-[#445069]" }) {
  return (
    <ul className="flex flex-col gap-2 m-0 p-0 list-none">
      {items.map((point, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <li
          key={i}
          className={`flex items-start gap-2 ttw-type-small leading-relaxed ${tone}`}
        >
          <span className="mt-[7px] w-1 h-1 rounded-full bg-[#8a93a6] flex-shrink-0" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A booked visa, laid out as the desktop drawer lays it out.
 *
 * This sheet first rendered the same facts as a wrapped row of chips, in this
 * surface's own idiom — and a chip row is the wrong instrument for these. They
 * are not a handful of attributes to scan; they are eight paired terms of a
 * document, and paired terms want a label column and a value column. Read as
 * chips, "STAY PERIOD 30Days" and "VALIDITY 30Days" sat side by side looking
 * like one repeated fact.
 *
 * So it is the drawer's structure, verbatim: the summary card (who it is for,
 * its status, who it covers and when), then the ruled Visa details table, then
 * the checklist, then the terms. A traveller who saw this visa on desktop sees
 * the same document here.
 */
function VisaBody({ visa, booking }) {
  const [termsExpanded, setTermsExpanded] = React.useState(false);

  const pax = paxLabel(booking);
  const dates = stayDates(booking);

  const facts = [
    { label: "Visa type", value: titleCase(visa?.category) },
    { label: "Entry", value: titleCase(visa?.entry_type) },
    { label: "Purpose", value: titleCase(visa?.purpose) },
    { label: "Processing", value: titleCase(visa?.processing_type) },
    { label: "Processing time", value: period(visa?.processing_time) },
    { label: "Stay period", value: period(visa?.stay_period) },
    { label: "Validity", value: period(visa?.validity) },
  ].filter((fact) => fact.value);

  const terms = termsPoints(booking?.terms_and_guidelines);
  const collapsible = terms.length > 3;
  const visibleTerms = collapsible && !termsExpanded ? terms.slice(0, 3) : terms;

  const inclusions = clean(visa?.inclusions);

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Summary — country, status, who it covers and when */}
      <div className="rounded-2xl border border-[#ececec] overflow-hidden">
        <div className="flex items-start justify-between gap-3 bg-[#f4f3ec] px-4 py-3">
          <div className="min-w-0">
            <div className="ttw-type-small text-[#445069]">Visa for</div>
            <div className="ttw-type-body font-600 text-[#0b1220] truncate">
              {visa?.country?.name || booking?.name || "Your trip"}
            </div>
          </div>
          <StatusPill status={booking?.status} />
        </div>

        {pax || dates ? (
          <div className="grid grid-cols-2 max-ph:grid-cols-1 divide-x max-ph:divide-x-0 max-ph:divide-y divide-[#ececec] border-t border-[#ececec]">
            {pax ? (
              <div className="px-4 py-3">
                <div className="ttw-type-small text-[#8a93a6] mb-0.5">
                  Travellers
                </div>
                <div className="ttw-type-small font-500 text-[#0b1220]">
                  {pax}
                </div>
              </div>
            ) : null}
            {dates ? (
              <div className="px-4 py-3">
                <div className="ttw-type-small text-[#8a93a6] mb-0.5">
                  Travel dates
                </div>
                <div className="ttw-type-small font-500 text-[#0b1220]">
                  {dates}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Visa details */}
      {facts.length ? (
        <div>
          <BlockTitle>Visa details</BlockTitle>
          <div className="rounded-2xl border border-[#ececec] divide-y divide-[#ececec]">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-start justify-between gap-4 px-4 py-2.5"
              >
                <span className="ttw-type-small text-[#8a93a6]">
                  {fact.label}
                </span>
                <span className="ttw-type-small font-500 text-[#0b1220] text-right">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* What the supplier says about this visa. The drawer's booked view has
          no equivalent — it only ever shows the table — but these are on the
          record and answer the question the table doesn't: what IS this. */}
      {visa?.description ? (
        <div>
          <BlockTitle>About</BlockTitle>
          <div className="ttw-type-small leading-relaxed text-[#445069]">
            {visa.description}
          </div>
        </div>
      ) : null}

      {inclusions.length ? (
        <div>
          <BlockTitle>What&apos;s included</BlockTitle>
          <Points items={inclusions} />
        </div>
      ) : null}

      {visa?.requirements ? (
        <div>
          <BlockTitle>Requirements</BlockTitle>
          <div className="ttw-type-small leading-relaxed text-[#445069]">
            {visa.requirements}
          </div>
        </div>
      ) : null}

      {/* Checklist — the one thing the traveller has to act on. It opens in a
          tab rather than downloading: this sheet can be inside a browser that
          treats a download as a navigation away from the trip. */}
      {visa?.checklist_file ? (
        <a
          href={visa.checklist_file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-[#ececec] px-4 py-3 text-[#0b1220] no-underline"
        >
          <span className="w-9 h-9 rounded-xl bg-[#f4f3ec] flex items-center justify-center flex-shrink-0">
            <FileIcon />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block ttw-type-small font-600 text-[#0b1220]">
              Document checklist
            </span>
            <span className="block ttw-type-small text-[#445069]">
              Everything you need to submit with this application
            </span>
          </span>
          <span className="ttw-type-small font-500 underline flex-shrink-0">
            Open
          </span>
        </a>
      ) : null}

      {/* Terms & guidelines — carried on the booking itself */}
      {terms.length ? (
        <div className="rounded-2xl border border-[#ececec] bg-[#faf9f4] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-white border border-[#ececec] flex items-center justify-center flex-shrink-0 text-[#0b1220]">
              <InfoIcon />
            </span>
            <div className="ttw-type-body font-600 text-[#0b1220]">
              Terms &amp; Guidelines
            </div>
          </div>

          <Points items={visibleTerms} />

          {collapsible ? (
            <button
              type="button"
              onClick={() => setTermsExpanded((open) => !open)}
              style={{ border: 0, background: "none", padding: 0 }}
              className="ttw-type-small font-500 text-[#0b1220] underline mt-3"
            >
              {termsExpanded ? "Show less" : `Read all ${terms.length} points`}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
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
  // A visa comes back twice: `external_data.visa` is the snapshot taken when it
  // was booked, `booking.visa` the live master row — and EITHER can be absent
  // (an unlinked visa; a booking made before snapshots). Reading only the
  // snapshot left this sheet blank on bookings the desktop drawer renders in
  // full, so they are layered exactly as VisaDetailDrawer layers them, master
  // over snapshot. An eSIM has one source and needs no such merge.
  const record = isVisa
    ? snapshot.visa || data.visa
      ? { ...(snapshot.visa || {}), ...(data.visa || {}) }
      : null
    : snapshot.package;

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
