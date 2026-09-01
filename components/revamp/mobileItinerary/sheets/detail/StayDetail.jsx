import React from "react";
import { useRouter } from "next/router";

import PolicyNote from "../../../common/components/bookingDetail/PolicyNote";
import { dateFormat } from "../../../../../helper/DateUtils";
import { getHumanTime } from "../../../../../services/getHumanTime";
import { MERCURY_HOST } from "../../../../../services/constants";
import useBookingDetail from "./useBookingDetail";
import {
  Bullets,
  Card,
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
//  StayDetail — the booked hotel, off the same endpoint the desktop drawer
//  reads (`/itinerary/<id>/bookings/accommodation/<booking>/`).
//
//  Same facts, different surface. The desktop drawer is a full-height panel: a
//  five-cell photo mosaic, a sticky tab bar over four scroll-spied sections,
//  room cards with their own expand/collapse. None of that survives a 95%-tall
//  bottom sheet the traveller is holding in one hand — a tab bar inside a sheet
//  is a second navigation under the sheet's own header, and a mosaic on a
//  360px screen gives each photo 90px.
//
//  So the same content is laid out the way the rest of this itinerary is: one
//  scroll, hairline-ruled sections, mono micro-labels, fact chips. No prices —
//  the trip is a package, and this sheet states no line item (which is also why
//  the room cards drop the per-night rate the desktop drawer prints).
// ─────────────────────────────────────────────────────────────────────────────

// Suppliers send the stay's dates as "DD/MM/YYYY" and its clock times as
// "HH:MM" — the same two helpers the desktop drawer reads them with, so a
// check-in never renders one way here and another way there.
const dateOnly = (value) => (value ? dateFormat(value) || null : null);
const timeOnly = (value) => (value ? getHumanTime(value) || null : null);

// ─── The supplier's description, as sections ────────────────────────────────
//
//  `hotel_details.description` is not a paragraph. Suppliers send a whole
//  document — "Amenities", "Dining", "Business Amenities", "Rooms",
//  "Attractions" — each with its own heading, and dropping the lot under one
//  "About" label produced two problems at once: the supplier's headings render
//  in their own type rather than this sheet's, and its Amenities heading sat a
//  few hundred pixels above OUR Amenities list, which is built from a different
//  field (`facilities`) and reads as the same section printed twice.
//
//  So the document is split on its own headings and each part becomes a real
//  section of the sheet, with the heading as the section's mono label. The
//  facilities checklist then joins the supplier's amenities section instead of
//  repeating it below.

const HEADING_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);

/** A section title: a real heading, or a lone bolded line used as one. */
const isHeading = (el) => {
  if (HEADING_TAGS.has(el.tagName)) return true;
  const text = (el.textContent || "").trim();
  if (!text || text.length > 48) return false;
  const strong = el.querySelector("b, strong");
  return !!strong && (strong.textContent || "").trim() === text;
};

const splitDescription = (html) => {
  if (!html || typeof window === "undefined" || !window.DOMParser) return null;
  let body;
  try {
    body = new DOMParser().parseFromString(
      `<body>${html}</body>`,
      "text/html",
    ).body;
  } catch {
    return null;
  }
  // A supplier that wraps everything in one container hides its headings a
  // level down — unwrap it so they are still top level to walk.
  let children = Array.from(body.children);
  while (children.length === 1 && children[0].children.length > 1) {
    children = Array.from(children[0].children);
  }

  const groups = [];
  let current = { label: null, html: "" };
  for (const node of children) {
    if (isHeading(node)) {
      if (current.html.trim()) groups.push(current);
      current = { label: (node.textContent || "").trim(), html: "" };
    } else {
      current.html += node.outerHTML;
    }
  }
  if (current.html.trim()) groups.push(current);

  // Nothing was actually split — one unlabelled blob is what the plain "About"
  // section already does, so let the caller take that path.
  return groups.length > 1 || groups[0]?.label ? groups : null;
};

function Description({ html, facilities }) {
  const groups = React.useMemo(() => splitDescription(html), [html]);
  const list = (facilities || []).filter(Boolean);

  // Where the supplier already talks about amenities — the checklist belongs
  // in that section rather than under a second heading of its own.
  const amenityIndex = groups
    ? groups.findIndex((group) => /amenit|facilit/i.test(group.label || ""))
    : -1;

  const ownAmenitySection =
    list.length && amenityIndex === -1 ? (
      <DetailSection label="Amenities">
        <Bullets items={list} />
      </DetailSection>
    ) : null;

  if (!groups) {
    return (
      <>
        {html ? (
          <DetailSection label="About">
            <Prose html={html} />
          </DetailSection>
        ) : null}
        {ownAmenitySection}
      </>
    );
  }

  return (
    <>
      {groups.map((group, i) => (
        <DetailSection
          key={`${group.label || "about"}-${i}`}
          label={group.label || "About"}
        >
          <Prose html={group.html} />
          {i === amenityIndex && list.length ? <Bullets items={list} /> : null}
        </DetailSection>
      ))}
      {ownAmenitySection}
    </>
  );
}

function Room({ rate, room }) {
  const image = (room?.images || []).map((i) => i?.image).find(Boolean);
  const beds = (room?.beds || [])
    .map((b) => {
      if (!b?.type) return null;
      const count = Number(b?.count) || 1;
      return `${count > 1 ? `${count} ` : ""}${b.type} bed${count > 1 ? "s" : ""}`;
    })
    .filter(Boolean);
  const sleeps = [
    room?.number_of_adults
      ? `${room.number_of_adults} adult${room.number_of_adults > 1 ? "s" : ""}`
      : null,
    room?.number_of_children && String(room.number_of_children) !== "0"
      ? `${room.number_of_children} children`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="overflow-hidden">
      {image ? (
        <img
          src={mediaUrl(image, 560)}
          alt={room?.name || "Room"}
          loading="lazy"
          className="w-full object-cover"
          style={{
            margin: 0,
            maxWidth: "none",
            height: 138,
            background: "#eef0f4",
          }}
        />
      ) : null}
      <div className="flex flex-col gap-[7px] p-[12px]">
        <div className="text-[13.5px] font-[700] leading-[1.3] text-[#0b1220]">
          {room?.name || "Room"}
        </div>
        <div className="font-mono text-[10px] leading-[1.5] tracking-[0.06em] text-[#8a93a6]">
          {[
            sleeps ? `SLEEPS ${sleeps.toUpperCase()}` : null,
            rate?.board_basis?.description
              ? String(rate.board_basis.description).toUpperCase()
              : null,
            beds.length ? beds.join(", ").toUpperCase() : null,
            room?.area ? String(room.area).toUpperCase() : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
        {room?.facilities?.length ? (
          <div className="text-[12.5px] leading-[1.45] text-[#6b7280]">
            {room.facilities.slice(0, 4).join(" · ")}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default function StayDetail({ bookingId }) {
  const router = useRouter();
  const itineraryId = router?.query?.id || router?.query?.sessionId;

  const url =
    bookingId && itineraryId
      ? `${MERCURY_HOST}/api/v1/itinerary/${itineraryId}/bookings/accommodation/${bookingId}/`
      : null;

  const { loading, data, error, retry } = useBookingDetail(url);

  if (loading) return <DetailSkeleton />;
  if (error || !data) return <DetailFailed onRetry={retry} />;

  const hotel = data?.hotel_details || {};
  const photos = (hotel.images || [])
    .map((image) => mediaUrl(image?.image, 560))
    .filter(Boolean);

  const address = [hotel.addr1, hotel.addr2, hotel.city, hotel.country]
    .filter(Boolean)
    .join(", ");

  const checkIn = hotel?.check_in || {};
  const checkOut = hotel?.check_out || {};
  const guests = [
    data?.number_of_adults
      ? `${data.number_of_adults} adult${data.number_of_adults > 1 ? "s" : ""}`
      : null,
    data?.number_of_children > 0 ? `${data.number_of_children} children` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const rates = hotel?.rates || [];
  const roomCount = rates.reduce(
    (total, rate) => total + (rate?.rooms?.length || 0),
    0,
  );

  const mapHref =
    hotel?.google_maps_link ||
    (hotel?.coordinates?.latitude && hotel?.coordinates?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${hotel.coordinates.latitude},${hotel.coordinates.longitude}`
      : null);

  return (
    <div className="flex flex-col pb-[10px] pt-[12px]">
      <Photos images={photos} alt={hotel?.name} />

      <FactChips
        className="px-4 pb-4"
        padded={false}
        facts={[
          {
            label: "Rating",
            value: data?.rating ? `${data.rating}★` : null,
          },
          {
            label: "Class",
            value:
              data?.star_category && String(data.star_category) !== "0"
                ? `${data.star_category}-star`
                : null,
          },
          { label: "Nights", value: data?.duration || null },
          { label: "Rooms", value: roomCount || null },
          { label: "Guests", value: guests || null },
        ]}
      />

      {checkIn?.date || checkOut?.date ? (
        <DetailSection label="Your stay">
          <FactChips
            facts={[
              {
                label: "Check in",
                value: [dateOnly(checkIn.date), timeOnly(checkIn.begin_time)]
                  .filter(Boolean)
                  .join(" · "),
              },
              {
                label: "Check out",
                value: [dateOnly(checkOut.date), timeOnly(checkOut.time)]
                  .filter(Boolean)
                  .join(" · "),
              },
            ]}
          />
        </DetailSection>
      ) : null}

      {rates.length ? (
        <DetailSection label={roomCount === 1 ? "Your room" : "Your rooms"}>
          <div className="flex flex-col gap-[9px] px-4 pb-4">
            {rates.map((rate, rateIndex) =>
              (rate?.rooms || []).map((room, roomIndex) => (
                <Room
                  key={`${rate?.id || rateIndex}-${room?.id || roomIndex}`}
                  rate={rate}
                  room={room}
                />
              )),
            )}
          </div>
        </DetailSection>
      ) : null}

      <Description html={hotel?.description} facilities={hotel?.facilities} />

      {checkIn?.instructions?.length ? (
        <DetailSection label="Check-in instructions">
          {checkIn.instructions.map((item, i) => (
            <Prose key={i} html={item} />
          ))}
        </DetailSection>
      ) : null}

      <PolicyNote html={data?.cancellation_policies} />

      {/* Last, like the desktop drawer's Location tab. Where the hotel IS only
          matters once you know which hotel it is and what you booked in it —
          leading with a street address pushed the rooms and the terms below the
          fold on a phone. */}
      {address || mapHref ? (
        <DetailSection label="Address">
          {address ? <Prose text={address} /> : null}
          <MapLink href={mapHref} />
        </DetailSection>
      ) : null}
    </div>
  );
}
