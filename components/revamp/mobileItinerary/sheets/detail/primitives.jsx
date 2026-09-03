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
      {/* 10px under the mosaic, not 16: what follows it in the one sheet that
          uses this — the hotel's class line — is the caption to these photos,
          and the sheet sets a caption 10px off what it captions (DetailSection
          does it with `pb-2.5`). A full section gap read as a stray line. */}
      <div className="flex flex-col gap-[8px] px-4 pb-[10px]">
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

// Tile placement, copied area-for-area from the POI/activity drawers' own
// mosaic (components/drawers/common/ImageGrid.jsx) so a place opened from the
// day reads as the same object it does everywhere else in the app. Areas are
// row-start / col-start / row-end / col-end on a 10x4 grid: one tall tile left,
// one tall right, two stacked between them.
const GRID_AREAS = {
  1: ["1 / 1 / 5 / 11"],
  2: ["1 / 1 / 5 / 6", "1 / 6 / 5 / 11"],
  3: ["1 / 1 / 5 / 4", "1 / 4 / 5 / 7", "1 / 7 / 5 / 11"],
  4: ["1 / 1 / 5 / 4", "1 / 8 / 5 / 11", "1 / 4 / 3 / 8", "3 / 4 / 5 / 8"],
};

function GridTile({ src, area, index, alt, showAll, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      style={{ border: "none", background: "none", padding: 0, gridArea: area }}
      className="relative h-full w-full overflow-hidden rounded-[10px]"
    >
      <img
        src={src}
        alt={alt ? `${alt} ${index + 1}` : ""}
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
        style={{ ...IMG_RESET, display: "block", background: "#eef0f4" }}
      />
      {/* Same affordance the hotel mosaic uses — underlined white text over a
          scrim — so "there are more of these" looks the same on both sheets.
          A span, not a button: it is inside one. */}
      {showAll ? (
        <span
          style={{ background: "rgba(11,18,32,0.42)" }}
          className="absolute inset-0 grid place-items-center px-[4px]"
        >
          <span
            style={{ borderBottom: "1px solid #ffffff" }}
            className="pb-[1px] text-center text-[12px] font-[600] leading-[1.25] text-white"
          >
            Show all photos
          </span>
        </span>
      ) : null}
    </button>
  );
}

/**
 * A place's photos, as the mosaic the POI and activity drawers draw.
 *
 * Not the sideways strip: a place is looked at before it is read about, and
 * four tiles seen at once say more about whether you want to go than three and
 * a half you have to swipe through. Past four, the last tile carries the way
 * into the full-screen gallery.
 */
export function PhotoGrid({ images, full, alt, height = 208 }) {
  const list = (images || []).filter(Boolean);
  const large = (full || []).filter(Boolean);
  const [open, setOpen] = React.useState(null);
  if (!list.length) return null;

  const shown = list.slice(0, 4);
  const areas = GRID_AREAS[shown.length];

  return (
    <>
      <div className="px-4 pb-4">
        <div
          className="grid w-full gap-[6px]"
          style={{
            gridTemplateColumns: "repeat(10, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            height,
          }}
        >
          {shown.map((src, i) => (
            <GridTile
              key={`${src}-${i}`}
              src={src}
              area={areas[i]}
              index={i}
              alt={alt}
              showAll={list.length > shown.length && i === shown.length - 1}
              onOpen={setOpen}
            />
          ))}
        </div>
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
 * The carousel's page dots.
 *
 * ONE indicator for every carousel, however many photos it holds. This used to
 * fall back to a "4 / 20" counter past six photos, on the grounds that twenty
 * dots are a texture rather than an indicator — which is true, but the answer
 * to that is not a second design. It is the phone's own answer: a WINDOW of at
 * most seven dots that slides with you, its outermost dots shrunk to say the
 * run continues past them. A five-photo room and a twenty-photo room now read
 * as the same control.
 */
const DOT_WINDOW = 7;

function Dots({ count, current }) {
  if (count < 2) return null;

  // Keep the active dot mid-window until the run's own ends are reached.
  const start = Math.max(
    0,
    Math.min(current - (DOT_WINDOW >> 1), count - DOT_WINDOW),
  );
  const end = Math.min(count, start + DOT_WINDOW);
  const shown = [];
  for (let i = start; i < end; i += 1) shown.push(i);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[8px] flex items-center justify-center gap-[5px]">
      {shown.map((i) => {
        const active = i === current;
        // An edge of the WINDOW that is not an edge of the run: the smaller
        // dot is what says there are more photos beyond it.
        const faded =
          (i === start && start > 0) || (i === end - 1 && end < count);
        const size = active ? 5 : faded ? 3 : 5;

        return (
          <span
            key={`dot-${i}`}
            className="rounded-full transition-all"
            style={{
              width: active ? 14 : size,
              height: size,
              background: active ? "#ffffff" : "rgba(255,255,255,0.55)",
            }}
          />
        );
      })}
    </div>
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

        <Dots count={list.length} current={current} />
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
