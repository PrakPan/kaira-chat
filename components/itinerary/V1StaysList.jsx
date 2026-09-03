// Stays for an archived V1 itinerary.
//
// Same reasoning as V1TransfersList: the archive stores hotels per city with no
// booking record, price, room type or rating — just a name, some images and the
// dates. The normal Stays UI is built around bookings that can be changed and
// priced, so the archive lists them plainly under the day-by-day instead.
//
// Images come through `optimizedImageUrl` rather than `optimizedMediaUrl`: most
// hotel photos are absolute URLs on external CDNs (passed through untouched),
// but some are bare `crm/...` keys that need resolving against our own media
// host first.

import React from "react";
import { optimizedImageUrl } from "../../helper/imageUrl";
import { getHumanDate } from "../../services/getHumanDate";

const formatDate = (value) => {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  try {
    return getHumanDate(`${day}/${month}/${year}`);
  } catch (err) {
    return null;
  }
};

// First usable photo — entries can carry a null/empty `image`.
const firstImage = (hotel) =>
  (hotel?.images || []).map((img) => img?.image).find(Boolean) || null;

const V1StaysList = ({ stays }) => {
  const items = (stays || []).filter((s) => s && s.name);
  if (!items.length) return null;

  return (
    <section id="Stays" className="mt-8 mb-6">
      <h2 className="ttw-type-h3 font-medium text-[#262626] mb-1">Stays</h2>
      <p className="ttw-type-small text-[#7A7A7A] mb-3">
        Where you stayed on this trip.
      </p>

      <ol className="flex flex-col divide-y divide-[#ECEAEA] border-t border-b border-[#ECEAEA]">
        {items.map((stay, index) => {
          const image = firstImage(stay);
          const checkIn = formatDate(stay.check_in);
          const checkOut = formatDate(stay.check_out);
          const dates =
            checkIn && checkOut && checkIn !== checkOut
              ? `${checkIn} – ${checkOut}`
              : checkIn;

          const meta = [
            stay.city_name || null,
            stay.duration
              ? `${stay.duration} ${stay.duration > 1 ? "nights" : "night"}`
              : null,
          ].filter(Boolean);

          return (
            <li
              key={`${stay.id || stay.name}-${index}`}
              className="flex flex-row items-center gap-2.5 py-2.5"
            >
              {image ? (
                <img
                  src={optimizedImageUrl(image, { width: 120 })}
                  alt=""
                  aria-hidden="true"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover flex-shrink-0 bg-[#F3F4F6]"
                  loading="lazy"
                />
              ) : (
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-md bg-[#F3F4F6] flex-shrink-0" />
              )}

              <div className="flex flex-col min-w-0">
                <span className="text-[13px] md:text-[14px] text-[#262626] truncate">
                  {stay.name}
                </span>
                <span className="text-[11px] md:text-[12px] text-[#7A7A7A]">
                  {meta.join(" · ")}
                  {dates ? `${meta.length ? " · " : ""}${dates}` : ""}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default V1StaysList;
