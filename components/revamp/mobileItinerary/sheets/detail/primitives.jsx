import React from "react";
import ReactDOM from "react-dom";
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

// Inline reset for every <img> on this surface: styles.css and bootstrap both
// carry unscoped `img {}` rules with margins and `max-width` that otherwise
// squeeze anything laid out as a flex child.
const IMG_RESET = { margin: 0, maxWidth: "none" };

/**
 * The full-screen photo gallery — desktop's "Show all photos", on a phone.
 *
 * Portalled to #modal-portal rather than rendered where it is used: the sheet
 * it opens from is a transformed, `overflow: hidden` panel, and a transform
 * makes its subtree the containing block for `position: fixed` — an overlay
 * declared inside the sheet would be positioned and clipped BY the sheet
 * instead of covering the screen.
 *
 * Paging is CSS scroll-snap, not a carousel library: it is the browser's own
 * horizontal swipe, works inside the nested scroller this surface lives in,
 * and costs nothing to load.
 */
export function PhotoGallery({ images, alt, index = 0, onClose }) {
  const list = (images || []).filter(Boolean);
  const railRef = React.useRef(null);
  const [current, setCurrent] = React.useState(index);

  // Open ON the photo that was tapped. Left as a layout effect so the rail is
  // already at the right slide on the first painted frame — animating there
  // afterwards reads as the gallery scrolling on its own.
  React.useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollLeft = index * rail.clientWidth;
  }, [index]);

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!list.length || typeof document === "undefined") return null;
  const host = document.getElementById("modal-portal");
  if (!host) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex flex-col"
      // Above the sheet (1600) and the cart bar, below nothing else on this
      // surface — the gallery is the frontmost thing while it is open.
      style={{ zIndex: 1900, background: "#0b1220" }}
    >
      <div className="flex flex-none items-center justify-between px-[14px] pt-[14px]">
        <span className="font-mono text-[11px] tracking-[0.08em] text-[#c9cfda]">
          {current + 1} / {list.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          style={{
            border: "none",
            background: "rgba(255,255,255,0.14)",
            borderRadius: 999,
            boxShadow: "none",
          }}
          className="grid h-[32px] w-[32px] place-items-center text-[16px] leading-none text-white"
        >
          ✕
        </button>
      </div>

      <div
        ref={railRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.clientWidth) {
            setCurrent(Math.round(el.scrollLeft / el.clientWidth));
          }
        }}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          // Without this a swipe past the last photo chains into the sheet
          // still open behind the overlay.
          overscrollBehavior: "contain",
        }}
      >
        {list.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex h-full w-full flex-none snap-center items-center justify-center px-[10px]"
          >
            <img
              src={src}
              alt={alt ? `${alt} ${i + 1}` : ""}
              loading={i === index ? "eager" : "lazy"}
              decoding="async"
              style={{
                ...IMG_RESET,
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>

      <div className="h-[24px] flex-none" />
    </div>,
    host,
  );
}

/**
 * The photos, as one sideways strip that opens the gallery.
 *
 * Not the desktop mosaic: a five-cell grid on a 360px phone gives every photo
 * about 90px, which is worse than showing three of them properly and letting
 * the thumb do the rest. The first card is wider because the first photo is
 * the one the traveller is actually looking at.
 *
 * Tapping any tile opens the same full-screen gallery desktop's "Show all
 * photos" does — the strip is the trigger, not the whole of what there is to
 * see. `full` carries the same photos at gallery resolution; without it the
 * gallery would blow up 560px thumbnails to fill a screen.
 */
export function Photos({ images, full, alt, limit = 10 }) {
  const list = (images || []).filter(Boolean);
  const large = (full || []).filter(Boolean);
  const [open, setOpen] = React.useState(null);
  if (!list.length) return null;

  const shown = list.slice(0, limit);
  const hidden = list.length - shown.length;

  return (
    <>
      <div
        className="flex gap-[8px] overflow-x-auto px-4 pb-4"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {shown.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            style={{ border: "none", background: "none", padding: 0 }}
            className="relative flex-none overflow-hidden rounded-[11px]"
          >
            <img
              src={src}
              alt={alt ? `${alt} ${i + 1}` : ""}
              loading="lazy"
              decoding="async"
              className="object-cover"
              style={{
                ...IMG_RESET,
                display: "block",
                width: i === 0 ? 250 : 142,
                height: 142,
                background: "#eef0f4",
              }}
            />
            {/* The count sits on the LAST tile the strip draws, so a hotel with
                thirty photos says so instead of ending in a silent cut. */}
            {hidden > 0 && i === shown.length - 1 ? (
              <span
                className="absolute inset-0 grid place-items-center font-mono text-[13px] tracking-[0.06em] text-white"
                style={{ background: "rgba(11,18,32,0.55)" }}
              >
                +{hidden}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {open !== null ? (
        <PhotoGallery
          images={large.length ? large : list}
          alt={alt}
          index={open}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </>
  );
}

// One tile of the mosaic. Module scope, not a closure declared during render:
// a component built inside another is a new type every render, and React
// unmounts and re-fetches the <img> it drew.
function MosaicTile({ src, index, alt, height, showAll, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      style={{ border: "none", background: "none", padding: 0 }}
      className="relative min-w-0 flex-1 overflow-hidden rounded-[11px]"
    >
      <img
        src={src}
        alt={alt ? `${alt} ${index + 1}` : ""}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        className="w-full object-cover"
        style={{ ...IMG_RESET, display: "block", height, background: "#eef0f4" }}
      />
      {/* The hotel drawer's own affordance: underlined white text over a scrim
          across the tile, not a pill. Spans, not buttons — this sits INSIDE the
          tile's button, and a button within a button is markup Safari fixes by
          dropping one.

          The scrim is lighter than the drawer's 0.72 black. That one covers a
          desktop tile several hundred pixels wide, where a photo can afford to
          go dark; here it is one of two small tiles and the point is still to
          show a photo. */}
      {showAll ? (
        <span
          style={{ background: "rgba(11,18,32,0.38)" }}
          className="absolute inset-0 grid place-items-center"
        >
          <span
            style={{ borderBottom: "1px solid #ffffff" }}
            className="whitespace-nowrap pb-[1px] text-[13px] font-[600] text-white"
          >
            Show all photos
          </span>
        </span>
      ) : null}
    </button>
  );
}

/**
 * The hotel's photos, as the mosaic the hotel drawer has always drawn on
 * mobile: a hero, two tiles under it, and "Show all photos" over the last one.
 *
 * The sideways strip this replaced showed the same photos, but a strip has no
 * end — nothing on it says how many there are or that tapping opens anything —
 * so a traveller who did not think to swipe saw two and a half pictures of the
 * hotel they are staying in. The mosaic states the set and gives it one
 * labelled way in, which is the affordance the existing drawer already taught.
 *
 * `full` is the same photos at gallery resolution; see PhotoGallery.
 */
export function PhotoMosaic({ images, full, alt }) {
  const list = (images || []).filter(Boolean);
  const large = (full || []).filter(Boolean);
  const [open, setOpen] = React.useState(null);
  if (!list.length) return null;

  // Up to two under the hero. One photo is a hero alone; two put the second
  // across the full width rather than leaving a gap where a third would be.
  const tiles = list.slice(1, 3);

  return (
    <>
      <div className="flex flex-col gap-[8px] px-4 pb-4">
        <div className="flex">
          <MosaicTile
            src={list[0]}
            index={0}
            alt={alt}
            height={186}
            onOpen={setOpen}
          />
        </div>
        {tiles.length ? (
          <div className="flex gap-[8px]">
            {tiles.map((src, i) => (
              <MosaicTile
                key={`${src}-${i}`}
                src={src}
                index={i + 1}
                alt={alt}
                height={104}
                showAll={i === tiles.length - 1}
                onOpen={setOpen}
              />
            ))}
          </div>
        ) : null}
      </div>

      {open !== null ? (
        <PhotoGallery
          images={large.length ? large : list}
          alt={alt}
          index={open}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </>
  );
}

/**
 * A carousel — one photo at a time, swiped, inside a card.
 *
 * The room card showed `images[0]` and dropped the rest, which is the one
 * decision a traveller choosing between a garden view and a car park cannot
 * make for themselves. Full-width snap slides rather than the strip above:
 * inside a card there is no room to let a second photo peek, and a room's
 * photos are alternatives to compare rather than a set to skim.
 */
export function PhotoCarousel({ images, full, alt, height = 138 }) {
  const list = (images || []).filter(Boolean);
  const large = (full || []).filter(Boolean);
  const [current, setCurrent] = React.useState(0);
  const [open, setOpen] = React.useState(null);
  if (!list.length) return null;

  return (
    <>
      <div className="relative">
        <div
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.clientWidth) {
              setCurrent(Math.round(el.scrollLeft / el.clientWidth));
            }
          }}
          className="flex snap-x snap-mandatory overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
        >
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setOpen(i)}
              style={{ border: "none", background: "none", padding: 0 }}
              className="w-full flex-none snap-center"
            >
              <img
                src={src}
                alt={alt ? `${alt} ${i + 1}` : ""}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full object-cover"
                style={{ ...IMG_RESET, display: "block", height, background: "#eef0f4" }}
              />
            </button>
          ))}
        </div>

        {/* Dots, and a count once there are more of them than dots can carry
            without becoming a texture. */}
        {list.length > 1 ? (
          list.length <= 6 ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-[8px] flex items-center justify-center gap-[5px]">
              {list.map((src, i) => (
                <span
                  key={`dot-${src}-${i}`}
                  className="h-[5px] rounded-full transition-all"
                  style={{
                    width: i === current ? 14 : 5,
                    background:
                      i === current ? "#ffffff" : "rgba(255,255,255,0.55)",
                  }}
                />
              ))}
            </div>
          ) : (
            <span
              className="pointer-events-none absolute bottom-[8px] right-[8px] rounded-full px-[8px] py-[3px] font-mono text-[10px] tracking-[0.06em] text-white"
              style={{ background: "rgba(11,18,32,0.55)" }}
            >
              {current + 1} / {list.length}
            </span>
          )
        ) : null}
      </div>

      {open !== null ? (
        <PhotoGallery
          images={large.length ? large : list}
          alt={alt}
          index={open}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </>
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
