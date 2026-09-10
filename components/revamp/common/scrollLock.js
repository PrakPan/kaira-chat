// ─────────────────────────────────────────────────────────────────────────────
//  Document scroll lock — one owner, many holders.
//
//  The mobile bot shell lays the trip out in the DOCUMENT and lets the window
//  scroll it, because that is the only scroll iOS Safari and Chrome Android
//  will retract their address bars for (see `.app-shell` in styles/globals.css).
//  The cost of a page that really scrolls is that everything laid OVER it —
//  Kaira's sheet, the map, the route sheet, every bottom sheet — has to freeze
//  it, or a stray drag beside an open sheet scrolls the trip out from under it
//  and the user is somewhere else when the sheet closes.
//
//  WHY A MODULE AND NOT A HOOK PER SURFACE: those layers overlap. A detail
//  sheet is open, its "Change …" button opens Kaira, and for a moment two
//  independent locks are live. Each would save its own "restore to" offset, and
//  the second would save the offset the FIRST one had already frozen — zero —
//  so closing them both scrolled the trip back to the top. One lock with a
//  reference count has one offset: the position the page was really at when the
//  first holder took it.
//
//  The mechanics (body out of flow, offset held in an inline `top`) and the
//  reasons for them are with the `.app-shell-locked` rule in styles/globals.css.
// ─────────────────────────────────────────────────────────────────────────────

let holders = 0;
let savedY = 0;

/**
 * Freeze the document where it stands. Returns the release function — call it
 * once (a second call is ignored, so it is safe as an effect cleanup that React
 * may run after the component has gone).
 */
export function lockDocumentScroll() {
  if (typeof document === "undefined") return () => {};

  if (holders === 0) {
    savedY = window.scrollY || 0;
    document.body.style.top = `${-savedY}px`;
    document.documentElement.classList.add("app-shell-locked");
  }
  holders += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders = Math.max(0, holders - 1);
    if (holders > 0) return;
    document.documentElement.classList.remove("app-shell-locked");
    document.body.style.top = "";
    // Back where we were, before the browser paints the frame that revealed the
    // page again — `scrollTo`, not `scrollIntoView`, and not smooth: this is a
    // restoration, and any travel in it reads as the page moving on its own.
    window.scrollTo(0, savedY);
  };
}

/**
 * The offset the page is frozen at, for anything that has to reproduce the
 * frozen view by hand — the trip card is pinned to the viewport for the chat
 * gesture, which resets its contents to the top of the itinerary unless they
 * are shifted back by this. 0 when nothing holds the lock.
 */
export function lockedScrollY() {
  return holders > 0 ? savedY : 0;
}
