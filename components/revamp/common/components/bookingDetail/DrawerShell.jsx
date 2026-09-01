import React from "react";

/**
 * The frame all four transfer detail drawers share: sticky ink band, a single
 * scrolling body, and a pinned action bar.
 *
 * The body is plain white with no pane tint. Sections separate themselves with
 * rules, so there is nothing for a card to sit on and nothing to outline.
 */
export default function DrawerShell({
  band,
  footer,
  children,
  embedded = false,
}) {
  // Embedded in a host that already owns the panel, its header and its action
  // bar — the mobile itinerary's detail sheet. The frame would fight it:
  // `h-screen` on a sheet body is a second full-height scroller, and the band
  // would be a second title under the sheet's own.
  if (embedded) return <div className="flex flex-col">{children}</div>;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* `overflow-y-auto` alone computes overflow-x to `auto` as well, so any
          single over-wide string turned the whole drawer into a sideways
          scroller on a phone — the band scrolled out of frame with it. Sections
          wrap their own supplier text; this is the backstop that keeps one
          missed case from moving the entire drawer. */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {band}
        <div className="pt-1 pb-2">{children}</div>
      </div>

      {footer ? (
        <div className="sticky bottom-0 z-10 border-t border-[#e2e0d6] bg-white px-4 py-3.5">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
