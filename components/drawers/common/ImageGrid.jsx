import React, { useState } from "react";
import Image from "next/image";
import SkeletonCard from "../../ui/SkeletonCard";
import { MERCURY_HOST } from "../../../services/constants";

// ─── Shared extra-images gallery ────────────────────────────────────────────
// The mosaic the POI drawers (components/drawers/poiDetails/POIDetails.js) use
// for `extra_images`, lifted out so the activity drawers render the same thing.
// Tile placement is copied area-for-area from those drawers.

const FALLBACK_IMAGE =
  "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png";

const MEDIA_HOST = "https://d31aoa0ehgvjdi.cloudfront.net";

// next/image needs an absolute URL (or a leading slash); our APIs hand back
// bare bucket keys ("media/activities/x.jpg") as often as full URLs. Either
// way the custom image loader resizes it at the edge afterwards.
const absolute = (src) =>
  /^(https?:)?\/\//i.test(src) || src.startsWith("/")
    ? src
    : `${MEDIA_HOST}/${src.replace(/^\/+/, "")}`;

// POI extras arrive as Google photo refs; activity extras arrive as a ready
// `image` (absolute URL or a bucket key).
export const galleryImageSrc = (image) => {
  if (!image) return null;
  if (typeof image === "string") return absolute(image);
  if (image.image) return absolute(image.image);
  if (image.photo_reference)
    return `${MERCURY_HOST}/api/v1/geos/photo/${image.photo_reference}`;
  return null;
};

// Builds the gallery list for an activity: its hero image first, then the
// extras, de-duplicated and capped at what the mosaic can show.
export const buildGalleryImages = (data, limit = 4) => {
  const srcs = [data?.image, ...(data?.extra_images || [])]
    .map(galleryImageSrc)
    .filter(Boolean);
  return [...new Set(srcs)].slice(0, limit);
};

// grid-area per tile, keyed by how many tiles there are.
const AREAS = {
  1: ["1 / 1 / 5 / 11"],
  2: ["1 / 1 / 5 / 6", "1 / 6 / 5 / 11"],
  3: ["1 / 1 / 5 / 4", "1 / 4 / 5 / 7", "1 / 7 / 5 / 11"],
  4: ["1 / 1 / 5 / 4", "1 / 8 / 5 / 11", "1 / 4 / 3 / 8", "3 / 4 / 5 / 8"],
};

const Tile = ({ src, area, alt, sizes, priority, children }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-lg"
      style={{ gridArea: area }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
          setLoaded(true);
        }}
        priority={priority}
      />
      {!loaded && (
        <div className="absolute inset-0">
          <SkeletonCard width="100%" height="100%" borderRadius="8px" />
        </div>
      )}
      {children}
    </div>
  );
};

// `overlay` renders inside the first (largest) tile — that is where the
// drawers hang their duration / popularity badges.
const ImageGrid = ({ images, className = "", overlay = null, altPrefix = "Image" }) => {
  const srcs = (images || []).filter(Boolean).slice(0, 4);
  if (!srcs.length) return null;

  const areas = AREAS[srcs.length];

  return (
    <div
      className={`grid w-full gap-[6px] ${className}`}
      style={{
        gridTemplateColumns: "repeat(10, 1fr)",
        gridTemplateRows: "repeat(4, 1fr)",
      }}
    >
      {srcs.map((src, i) => (
        <Tile
          key={`${src}-${i}`}
          src={src}
          area={areas[i]}
          alt={`${altPrefix} ${i}`}
          sizes={srcs.length === 1 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
          priority={i === 0}
        >
          {i === 0 ? overlay : null}
        </Tile>
      ))}
    </div>
  );
};

export default ImageGrid;
