import React from "react";
import styled from "styled-components";

import DetailSection from "../../../common/components/bookingDetail/DetailSection";
import FactChips from "../../../common/components/bookingDetail/FactChips";
import { optimizedMediaUrl } from "../../../../../lib/mediaImage";

// ─────────────────────────────────────────────────────────────────────────────
//  The pieces a detail body is built from, in the itinerary's own design
//  language: hairline-ruled sections, mono micro-labels, fact chips, and a
//  photo strip that scrolls sideways instead of a desktop mosaic.
//
//  DetailSection / FactChips / PolicyNote are the transfer drawers' own
//  primitives, reused verbatim — they already draw exactly this vocabulary
//  (9px mono uppercase labels on #8a93a6, 12.5px/600 values on #0b1220,
//  #fafaf5 chips, #efede6 rules), so a stay, a taxi and an activity read as one
//  system rather than three. Only what those don't cover is added here.
// ─────────────────────────────────────────────────────────────────────────────

export { DetailSection, FactChips };

const CDN = "https://d31aoa0ehgvjdi.cloudfront.net/";

/** Media arrives as an S3 key; the strip paints plain <img> and needs a URL. */
export const mediaUrl = (key, width = 560) => {
  if (!key || typeof key !== "string") return null;
  return optimizedMediaUrl(key.startsWith("http") ? key : CDN + key, { width });
};

/**
 * The photos, as one sideways strip.
 *
 * Not the desktop mosaic: a five-cell grid on a 360px phone gives every photo
 * about 90px, which is worse than showing three of them properly and letting
 * the thumb do the rest. The first card is wider because the first photo is
 * the one the traveller is actually looking at.
 */
export function Photos({ images, alt }) {
  const list = (images || []).filter(Boolean);
  if (!list.length) return null;

  return (
    <div
      className="flex gap-[8px] overflow-x-auto px-4 pb-4"
      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
    >
      {list.slice(0, 10).map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={alt ? `${alt} ${i + 1}` : ""}
          loading="lazy"
          className="flex-none rounded-[11px] object-cover"
          // `margin: 0` / `maxWidth: none` inline: styles.css and bootstrap both
          // carry unscoped `img {}` rules that otherwise squeeze these.
          style={{
            margin: 0,
            maxWidth: "none",
            width: i === 0 ? 250 : 142,
            height: 142,
            background: "#eef0f4",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Supplier copy — hotel descriptions, check-in instructions, activity
 * overviews — brought down to the sheet's own type.
 *
 * These strings are whole documents, not paragraphs: a hotel description
 * arrives as `<h2>Amenities</h2><p>…</p><h2>Dining</h2><p>…</p>`, and the app's
 * global `ttw-policy-html` normalises p/ul/li/strong but says nothing about
 * headings — so every supplier `<h2>` rendered at the page's heading size,
 * three times the size of everything around it. Descendant headings are
 * levelled here, which is why this is a styled block and not a class list.
 */
const ProseBox = styled.div`
  font-size: 13.5px;
  line-height: 1.55;
  color: #445069;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.35;
    color: #0b1220;
    margin: 12px 0 4px;
  }

  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

export function Prose({ html, text, className = "" }) {
  if (html) {
    const readable = String(html)
      .replace(/<[^>]*>/g, "")
      .trim();
    if (!readable) return null;
    return (
      <ProseBox
        className={`ttw-policy-html px-4 pb-4 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  if (!text) return null;
  return (
    <div
      className={`px-4 pb-4 text-[13.5px] leading-[1.55] text-[#445069] ${className}`}
    >
      {text}
    </div>
  );
}

/** A plain list — amenities, inclusions, what to bring. */
export function Bullets({ items, columns = 2 }) {
  const list = (items || []).filter(Boolean);
  if (!list.length) return null;
  return (
    <ul
      className={`grid gap-x-[12px] gap-y-[6px] px-4 pb-4 ${
        columns === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
      style={{ listStyle: "none", margin: 0, paddingLeft: 16 }}
    >
      {list.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="flex gap-[7px] text-[13px] leading-[1.45] text-[#445069]"
        >
          <span className="mt-[6px] h-[3px] w-[3px] flex-none rounded-full bg-[#b8becc]" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A bordered card — a room, a leg, an inclusion group. */
export function Card({ children, className = "" }) {
  return (
    <div
      style={{
        border: "1px solid #e6e8ec",
        borderRadius: 11,
        boxShadow: "none",
      }}
      className={`bg-white ${className}`}
    >
      {children}
    </div>
  );
}

/** The state of a fetch, in the sheet's own idiom. */
export function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-[12px] px-4 pb-5 pt-[12px]">
      <div className="h-[132px] animate-pulse rounded-[11px] bg-[#f1f2f4]" />
      <div className="h-[10px] w-1/3 animate-pulse rounded bg-[#f1f2f4]" />
      <div className="h-[52px] animate-pulse rounded-[10px] bg-[#f1f2f4]" />
      <div className="h-[10px] w-1/4 animate-pulse rounded bg-[#f1f2f4]" />
      <div className="h-[72px] animate-pulse rounded-[10px] bg-[#f1f2f4]" />
    </div>
  );
}

export function DetailFailed({ onRetry }) {
  return (
    <div className="flex flex-col items-center gap-[13px] px-4 py-[36px] text-center">
      <div className="text-[13.5px] text-[#6b7280]">
        Couldn&apos;t load this booking.
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          style={{
            border: "1px solid #dcdfe5",
            background: "#ffffff",
            borderRadius: 999,
            boxShadow: "none",
          }}
          className="px-[16px] py-[8px] text-[13px] font-[600] text-[#0b1220]"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

/** "View on Google Maps" — the one link every located thing gets. */
export function MapLink({ href }) {
  if (!href) return null;
  return (
    <div className="px-4 pb-4">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[13px] font-[600] text-[#0b1220] underline"
      >
        View on Google Maps
      </a>
    </div>
  );
}
