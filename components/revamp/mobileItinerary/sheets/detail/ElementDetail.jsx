import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import PolicyNote from "../../../common/components/bookingDetail/PolicyNote";
import { MERCURY_HOST } from "../../../../../services/constants";
import useBookingDetail from "./useBookingDetail";
import {
  Bullets,
  DetailFailed,
  DetailSection,
  DetailSkeleton,
  FactChips,
  MapLink,
  Photos,
  Prose,
  mediaUrl,
} from "./primitives";

// ─────────────────────────────────────────────────────────────────────────────
//  ElementDetail — a day row, opened out: a booked activity, a place worth
//  seeing, or a restaurant.
//
//  Three shapes, two endpoints, one body — the same split the desktop
//  day-by-day makes when it opens POIDetailsDrawer:
//
//   • activity  → /itinerary/<id>/bookings/activity/<booking>/   (what was
//     bought: inclusions, exclusions, the guide, the cancellation terms)
//   • poi       → /geos/poi/<id>/?itinerary_city_id=…            (the place)
//   • restaurant→ /geos/restaurant/<id>/?itinerary_city_id=…
//
//  What differs from the desktop drawer is the layout, not the facts. The
//  drawer opens with a 300px hero, an h2 and a review carousel, then a day and
//  time-of-day picker for scheduling. In the sheet the name is already in the
//  header two rows up, scheduling is Kaira's job, and the space belongs to what
//  the traveller opened the row to read.
//
//  NO PRICE — a day item is inside the package like everything else on this
//  surface, and `pricing.total_price` is deliberately not rendered.
// ─────────────────────────────────────────────────────────────────────────────

const clean = (list) => (Array.isArray(list) ? list.filter(Boolean) : []);

/** Opening hours arrive as "Monday: 9:00 AM – 6:00 PM" strings. */
function Timings({ items }) {
  const rows = clean(items);
  if (!rows.length) return null;
  return (
    <div className="flex flex-col gap-[6px] px-4 pb-4">
      {rows.map((row, i) => {
        const at = row.indexOf(":");
        const day = at >= 0 ? row.slice(0, at).trim() : row;
        const time = at >= 0 ? row.slice(at + 1).trim() : "";
        const closed = /closed/i.test(time);
        return (
          <div key={i} className="flex items-center gap-[11px]">
            <div className="w-[76px] flex-none font-mono text-[10px] tracking-[0.06em] text-[#8a93a6]">
              {day.toUpperCase()}
            </div>
            {time ? (
              <div
                className="rounded-[7px] px-[8px] py-[3px] text-[12.5px] font-[600]"
                style={
                  closed
                    ? { background: "rgba(184,64,52,0.1)", color: "#b84034" }
                    : { background: "#fafaf5", color: "#0b1220" }
                }
              >
                {time}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/** Included / not included — the one place a tick and a cross earn their ink. */
function Ledger({ items, tone }) {
  const rows = clean(items);
  if (!rows.length) return null;
  return (
    <ul
      className="flex flex-col gap-[7px] px-4 pb-4"
      style={{ listStyle: "none", margin: 0, paddingLeft: 16 }}
    >
      {rows.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="flex items-start gap-[8px] text-[13px] leading-[1.45] text-[#445069]"
        >
          <span
            className="mt-[1px] flex-none text-[13px] font-[700]"
            style={{ color: tone === "exclude" ? "#b84034" : "#1f8a5a" }}
            aria-hidden
          >
            {tone === "exclude" ? "✕" : "✓"}
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ElementDetail({ elementType, id, itineraryCityId }) {
  const router = useRouter();
  const currency = useSelector((s) => s?.currency?.currency) || "INR";
  const itineraryId = router?.query?.id || router?.query?.sessionId;

  const isActivity = elementType === "activity";

  const url = (() => {
    if (!id) return null;
    if (isActivity) {
      if (!itineraryId) return null;
      return `${MERCURY_HOST}/api/v1/itinerary/${itineraryId}/bookings/activity/${id}/?currency=${currency}`;
    }
    const segment = elementType === "restaurant" ? "restaurant" : "poi";
    return `${MERCURY_HOST}/api/v1/geos/${segment}/${id}/?itinerary_city_id=${itineraryCityId || ""}`;
  })();

  // The two endpoints bury the record at different depths, and the activity one
  // keeps what was BOOKED (inclusions, amenities) on a sibling of what was
  // booked ABOUT (`activity`) — so both halves are lifted out here.
  const pick = React.useCallback(
    (payload) => {
      if (isActivity) {
        if (!payload) return null;
        return {
          ...(payload.activity || {}),
          bookingId: payload.id,
          hotel_pickup_included: payload.hotel_pickup_included,
          cancellation_policies: payload.cancellation_policies,
          booked: payload.activity_data || null,
        };
      }
      const root = payload?.data || {};
      return root.poi || root.restaurant || null;
    },
    [isActivity],
  );

  const { loading, data, error, retry } = useBookingDetail(url, { pick });

  if (loading) return <DetailSkeleton />;
  if (error || !data) return <DetailFailed onRetry={retry} />;

  const booked = data.booked || {};

  // A geo record carries Google photo references; an activity carries one key.
  const photos = (() => {
    const refs = clean(data.extra_images)
      .map((image) =>
        image?.photo_reference
          ? `${MERCURY_HOST}/api/v1/geos/photo/${image.photo_reference}`
          : null,
      )
      .filter(Boolean);
    if (refs.length) return refs;
    const one = mediaUrl(data.image, 640);
    return one ? [one] : [];
  })();

  const duration =
    data.ideal_duration_number && data.ideal_duration_unit
      ? `${data.ideal_duration_number} ${String(data.ideal_duration_unit).toLowerCase()}`
      : null;

  const pax = booked?.prices?.[0]?.pax_details;

  const mapHref = data.gmaps_place_id
    ? `https://www.google.com/maps/place/?q=place_id:${data.gmaps_place_id}`
    : data.latitude && data.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
      : null;

  return (
    <div className="flex flex-col pb-[10px] pt-[12px]">
      <Photos images={photos} alt={data.display_name || data.name} />

      <FactChips
        className="px-4 pb-4"
        padded={false}
        facts={[
          { label: "Rating", value: data.rating ? `${data.rating}★` : null },
          {
            label: "Reviews",
            value: data.user_ratings_total
              ? String(data.user_ratings_total)
              : null,
          },
          { label: "Time needed", value: duration },
          { label: "Tour", value: isActivity ? data.tour_type : null },
          { label: "Guide", value: isActivity ? data.guide : null },
          {
            label: "Travellers",
            value: pax
              ? [
                  pax.adults
                    ? `${pax.adults} adult${pax.adults > 1 ? "s" : ""}`
                    : null,
                  pax.children ? `${pax.children} children` : null,
                ]
                  .filter(Boolean)
                  .join(", ") || null
              : null,
          },
          {
            label: "Hotel pickup",
            value: data.hotel_pickup_included ? "Included" : null,
          },
        ]}
      />

      {data.overview || data.short_description ? (
        <DetailSection label="About">
          <Prose html={data.overview} />
          {!data.overview ? <Prose text={data.short_description} /> : null}
        </DetailSection>
      ) : null}

      {clean(booked.inclusions).length ? (
        <DetailSection label="What's included">
          <Ledger items={booked.inclusions} tone="include" />
        </DetailSection>
      ) : null}

      {clean(booked.exclusions).length ? (
        <DetailSection label="Not included">
          <Ledger items={booked.exclusions} tone="exclude" />
        </DetailSection>
      ) : null}

      {clean(booked.selected_amenities).length ? (
        <DetailSection label="Add-ons">
          <Bullets
            columns={1}
            items={clean(booked.selected_amenities).map((item) =>
              [item?.name || item?.key, item?.description]
                .filter(Boolean)
                .join(" — "),
            )}
          />
        </DetailSection>
      ) : null}

      {clean(data.general_guidelines).length ? (
        <DetailSection label="Good to know">
          <Bullets columns={1} items={data.general_guidelines} />
        </DetailSection>
      ) : null}

      {clean(data.things_to_bring).length ? (
        <DetailSection label="Bring with you">
          <Bullets items={data.things_to_bring} />
        </DetailSection>
      ) : null}

      {clean(data.not_suitable_for).length ? (
        <DetailSection label="Not suitable for">
          <Bullets columns={1} items={data.not_suitable_for} />
        </DetailSection>
      ) : null}

      {clean(data.tips_tricks).length || clean(data.tips).length ? (
        <DetailSection label="Tips">
          <Bullets
            columns={1}
            items={
              clean(data.tips_tricks).length ? data.tips_tricks : data.tips
            }
          />
        </DetailSection>
      ) : null}

      {data.getting_around ? (
        <DetailSection label="Getting around">
          <Prose text={data.getting_around} />
        </DetailSection>
      ) : null}

      {clean(data.timings).length ? (
        <DetailSection label="Opening hours">
          <Timings items={data.timings} />
        </DetailSection>
      ) : null}

      <PolicyNote html={data.cancellation_policies} />

      {/* Last, as on the stay sheet: where a place is only matters once you
          know what it is and what the visit involves. */}
      {data.address || mapHref ? (
        <DetailSection label="Where">
          {data.address ? <Prose text={data.address} /> : null}
          <MapLink href={mapHref} />
        </DetailSection>
      ) : null}
    </div>
  );
}
