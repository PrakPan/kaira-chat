// Where each city's day-by-day deck sits relative to its map pin.
//
// A deck parked above its pin buries whatever sits just above it — on a tight
// route that is the next city's marker, or the next city's card. So every deck
// picks a placement. Covering another city's marker costs an order of magnitude
// more than overlapping another card: a hidden pin is a stop the user cannot see
// at all, whereas a partly covered card can still be raised by clicking its pin.
//
// Four sides alone are not enough — two cities 50px apart on screen (Kyoto and
// Osaka at country zoom) leave no side that clears the neighbour's pin. So each
// side also offers three alignments, letting a card slide along the pin's edge:
// twelve candidate positions in all.

export type DeckSide = "top" | "bottom" | "left" | "right";
export type DeckAlign = "center" | "start" | "end";

const SIDES: DeckSide[] = ["top", "bottom", "right", "left"];
const ALIGNS: DeckAlign[] = ["center", "start", "end"];

// The city pin SVG is 36x46 and anchored at its tip, so a pin at (x, y) occupies
// the box from (x - 18, y - 46) to (x + 18, y). GAP clears the tail (8px) plus a
// little breathing room.
export const PIN_W = 36;
export const PIN_H = 46;
const GAP = 10;
const TAIL = 8;
/** Keep the tail away from the card's rounded corners. */
const TAIL_INSET = 16;

/**
 * How far the marker a card hangs off extends around its own point. A card is
 * offset from the *marker*, not from the coordinate — get this wrong and the
 * tail stops short of the pin it is supposed to be pointing at.
 */
export interface AnchorGeom {
  /** Pixels the marker rises above its point. */
  up: number;
  /** Pixels it drops below it. */
  down: number;
  /** Half its width. */
  halfW: number;
}

/** A city's numbered teardrop: hangs entirely above its point, on its tip. */
export const CITY_PIN_ANCHOR: AnchorGeom = {
  up: PIN_H,
  down: 0,
  halfW: PIN_W / 2,
};

/** A day-by-day element's category circle: centred on its point. */
export const dotAnchor = (size: number): AnchorGeom => ({
  up: size / 2,
  down: size / 2,
  halfW: size / 2,
});

export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** A deck to place: its marker's pixel position, shape, and the card's size. */
export interface DeckBox {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  anchor: AnchorGeom;
}

export interface DeckPlacement {
  side: DeckSide;
  /** Card's top-left corner relative to the pin, in px. */
  dx: number;
  dy: number;
  /**
   * Where the tail meets the card, in px along the card's pin-facing edge:
   * from the card's left for top/bottom, from its top for left/right.
   */
  tail: number;
}

const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

/** The box a marker of shape `anchor` occupies when its point is at (x, y). */
export const markerRect = (
  x: number,
  y: number,
  anchor: AnchorGeom = CITY_PIN_ANCHOR,
): Rect => ({
  x1: x - anchor.halfW,
  y1: y - anchor.up,
  x2: x + anchor.halfW,
  y2: y + anchor.down,
});

/** The box a city pin at (x, y) occupies. */
export const pinRect = (x: number, y: number): Rect =>
  markerRect(x, y, CITY_PIN_ANCHOR);

export const overlapArea = (a: Rect, b: Rect): number =>
  Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)) *
  Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));

/** How much of `r` falls outside a vw×vh viewport. */
export const offscreenArea = (r: Rect, vw: number, vh: number): number => {
  const area = (r.x2 - r.x1) * (r.y2 - r.y1);
  return Math.max(0, area - overlapArea(r, { x1: 0, y1: 0, x2: vw, y2: vh }));
};

/** Where the marker's middle sits, vertically, relative to its own point. */
const markerMidY = (a: AnchorGeom): number => (a.down - a.up) / 2;

/** The card's top-left corner, relative to the marker's point, for one side+alignment. */
export const deckOffset = (
  side: DeckSide,
  align: DeckAlign,
  w: number,
  h: number,
  anchor: AnchorGeom = CITY_PIN_ANCHOR,
): { dx: number; dy: number } => {
  // Along the marker's edge: centred, or slid so the card extends one way.
  const alongX =
    align === "center"
      ? -w / 2
      : align === "start"
        ? -anchor.halfW // card extends to the right of the marker
        : anchor.halfW - w; // card extends to the left
  const alongY =
    align === "center"
      ? markerMidY(anchor) - h / 2
      : align === "start"
        ? -anchor.up // card extends downward
        : anchor.down - h; // card extends upward

  switch (side) {
    case "top":
      return { dx: alongX, dy: -anchor.up - GAP - h };
    case "bottom":
      return { dx: alongX, dy: anchor.down + GAP };
    case "left":
      return { dx: -anchor.halfW - GAP - w, dy: alongY };
    case "right":
      return { dx: anchor.halfW + GAP, dy: alongY };
  }
};

const rectFrom = (
  x: number,
  y: number,
  w: number,
  h: number,
  dx: number,
  dy: number,
): Rect => ({ x1: x + dx, y1: y + dy, x2: x + dx + w, y2: y + dy + h });

/** A marker the cards should keep clear of, and what burying it costs per px². */
export interface Obstacle {
  rect: Rect;
  cost: number;
}

// Burying a city pin is close to a hard constraint: it is a stop that has
// vanished from the user's trip. An element marker is a much softer one — the
// city's own pager still reaches it, and inside a dense city there is often no
// placement that clears every element, so a card that insists on it ends up
// somewhere far worse (see COST_OFFSCREEN).
export const COST_COVER_PIN = 100_000;
export const COST_COVER_ELEMENT = 300;

const COST_OVERLAP_DECK = 1;
// A card off the edge of the pane is unreadable — on a phone, where the pane is
// barely wider than the card, that is the failure that actually bites. It has to
// outweigh covering a few element markers, and it does; only burying a city pin
// outright is worse.
const COST_OFFSCREEN = 2_000;
const COST_SIDE = 400;
const COST_ALIGN = 150;

/** Breathing room between a card and the edge of the pane. */
const VIEWPORT_MARGIN = 8;

/**
 * Slide a card back into the pane along the edge it is parked on — sideways for
 * a card above or below its marker, up/down for one beside it. Only along that
 * axis: moving it the other way would march it over the very marker it is
 * pointing at. The tail is recomputed from the shifted offset afterwards, so the
 * card still points home.
 */
const slideIntoView = (
  side: DeckSide,
  x: number,
  y: number,
  w: number,
  h: number,
  dx: number,
  dy: number,
  vw: number,
  vh: number,
): { dx: number; dy: number } => {
  if (side === "top" || side === "bottom") {
    if (w + 2 * VIEWPORT_MARGIN > vw) return { dx, dy }; // wider than the pane
    const left = x + dx;
    const right = left + w;
    if (left < VIEWPORT_MARGIN) return { dx: dx + (VIEWPORT_MARGIN - left), dy };
    if (right > vw - VIEWPORT_MARGIN)
      return { dx: dx - (right - (vw - VIEWPORT_MARGIN)), dy };
    return { dx, dy };
  }

  if (h + 2 * VIEWPORT_MARGIN > vh) return { dx, dy };
  const top = y + dy;
  const bottom = top + h;
  if (top < VIEWPORT_MARGIN) return { dx, dy: dy + (VIEWPORT_MARGIN - top) };
  if (bottom > vh - VIEWPORT_MARGIN)
    return { dx, dy: dy - (bottom - (vh - VIEWPORT_MARGIN)) };
  return { dx, dy };
};

/**
 * Choose a placement for every deck. Decks are placed in the order given — route
 * order, so earlier cities get their preferred spot and later ones work around
 * them, matching the way the cards are stacked.
 */
export function chooseDeckPlacements(
  decks: DeckBox[],
  obstacles: Obstacle[],
  vw: number,
  vh: number,
): Record<string, DeckPlacement> {
  const placed: Rect[] = [];
  const out: Record<string, DeckPlacement> = {};

  decks.forEach(({ id, x, y, w, h, anchor }) => {
    let best: { side: DeckSide; dx: number; dy: number } | null = null;
    let bestScore = Infinity;

    SIDES.forEach((side, si) => {
      ALIGNS.forEach((align, ai) => {
        const { dx, dy } = deckOffset(side, align, w, h, anchor);
        // Score the placement as it will actually be drawn — a candidate that
        // only fits once slid back into the pane should be judged on where it
        // lands, not on where it started.
        const slid = slideIntoView(side, x, y, w, h, dx, dy, vw, vh);
        const rect = rectFrom(x, y, w, h, slid.dx, slid.dy);

        let score = si * COST_SIDE + ai * COST_ALIGN;
        obstacles.forEach((o) => {
          score += overlapArea(rect, o.rect) * o.cost;
        });
        placed.forEach((other) => {
          score += overlapArea(rect, other) * COST_OVERLAP_DECK;
        });
        score += offscreenArea(rect, vw, vh) * COST_OFFSCREEN;

        if (score < bestScore) {
          bestScore = score;
          best = { side, dx: slid.dx, dy: slid.dy };
        }
      });
    });

    if (!best) return;
    const { side, dx, dy } = best;
    // The tail meets the card wherever the marker actually is, so a card slid
    // along its edge still points at its own marker.
    const tail =
      side === "top" || side === "bottom"
        ? clamp(-dx, TAIL_INSET, w - TAIL_INSET)
        : clamp(markerMidY(anchor) - dy, TAIL_INSET, h - TAIL_INSET);

    out[id] = { side, dx, dy, tail };
    placed.push(rectFrom(x, y, w, h, dx, dy));
  });

  return out;
}

/** Inline style putting the tail on the card's pin-facing edge. */
export const tailStyle = (p: DeckPlacement): Record<string, string | number> => {
  const transparent = `${TAIL - 1}px solid transparent`;
  const solid = `${TAIL}px solid #fff`;
  switch (p.side) {
    case "top": // card above the pin → tail hangs off its bottom edge
      return {
        position: "absolute",
        bottom: -TAIL,
        left: p.tail - (TAIL - 1),
        borderLeft: transparent,
        borderRight: transparent,
        borderTop: solid,
      };
    case "bottom":
      return {
        position: "absolute",
        top: -TAIL,
        left: p.tail - (TAIL - 1),
        borderLeft: transparent,
        borderRight: transparent,
        borderBottom: solid,
      };
    case "left": // card left of the pin → tail on its right edge
      return {
        position: "absolute",
        right: -TAIL,
        top: p.tail - (TAIL - 1),
        borderTop: transparent,
        borderBottom: transparent,
        borderLeft: solid,
      };
    case "right":
      return {
        position: "absolute",
        left: -TAIL,
        top: p.tail - (TAIL - 1),
        borderTop: transparent,
        borderBottom: transparent,
        borderRight: solid,
      };
  }
};
