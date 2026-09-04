import Image from "next/image";

import Drawer from "../ui/Drawer";
import Sheet from "../revamp/common/components/Sheet";

// ─────────────────────────────────────────────────────────────────────────────
//  AncillaryShell — the frame the visa/eSIM picker and detail views open in.
//
//  Desktop keeps the right-anchored Drawer all four views were built as. The
//  mobile itinerary reaches them from a BOTTOM SHEET (CartSheet's "Enhance Your
//  Trip"), and a full-height right drawer sliding over that sheet reads as a
//  different app: the surface it was opened from disappears, the close control
//  moves from the sheet's ✕ to a back arrow, and the sheet underneath is still
//  holding the page scroll lock for a panel that no longer looks like it.
//  `variant="sheet"` renders the same body inside the itinerary's Sheet
//  primitive instead, so picker and detail stack on the cart the way every
//  other sheet on that surface does.
//
//  Only the FRAME changes. Every view keeps its own fetching, its own body and
//  its own CTA — they arrive here as nodes:
//
//    drawerHeader  drawer only; the view's own header (BookingDetailHeader on
//                  the detail views). Omitted → the standard back-arrow + title
//                  row the search drawers carry. In sheet mode the Sheet's own
//                  title bar replaces it, ✕ and all.
//    stickyHeader  under the title in BOTH modes — the search filters.
//    footer        the sticky CTA: Sheet's footer slot, or a sticky bottom bar
//                  inside the drawer.
// ─────────────────────────────────────────────────────────────────────────────

export default function AncillaryShell({
  variant = "drawer",
  show,
  onHide,
  zIndex,
  title,
  subtitle,
  drawerHeader,
  stickyHeader,
  footer,
  children,
}) {
  if (variant === "sheet") {
    return (
      <Sheet
        open={show}
        onClose={onHide}
        title={
          // A supplier's visa name runs four clauses long; clamped so the
          // header can't grow taller than the sheet it titles.
          title ? <span className="line-clamp-2">{title}</span> : null
        }
        subtitle={subtitle}
        zIndex={zIndex}
        height="95dvh"
        footer={footer}
      >
        <div className="px-4 pb-6 pt-3">
          {stickyHeader ? <div className="mb-3">{stickyHeader}</div> : null}
          {children}
        </div>
      </Sheet>
    );
  }

  return (
    <Drawer
      show={show}
      anchor="right"
      backdrop
      width="50%"
      mobileWidth="100%"
      bgColor="#ffffff"
      style={{ zIndex }}
      className="!overflow-y-hidden"
      onHide={onHide}
    >
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="overflow-y-scroll flex-1 px-6 max-ph:px-4">
          {/* A view that brings its own header (BookingDetailHeader) brings its
              own sticky positioning and padding with it — wrapping it again
              would double both. */}
          {drawerHeader || (
            <div className="py-4 bg-white z-[900] flex flex-col gap-3 pb-2 sticky top-0">
              {/* Back arrow and title share one line, same as the other search
                  drawers (activityAddDrawer et al.) */}
              <div className="flex flex-row items-center gap-3 w-full">
                <Image
                  src="/backarrow.svg"
                  className="cursor-pointer shrink-0"
                  width={22}
                  height={2}
                  alt="Back"
                  onClick={onHide}
                />
                <div className="flex-1 min-w-0 line-clamp-1 ttw-type-h4 md:ttw-type-h3 font-600 text-[#0b1220]">
                  {title}
                </div>
              </div>

              {stickyHeader}

              {subtitle ? (
                <div className="ttw-type-body text-[#445069]">{subtitle}</div>
              ) : null}
            </div>
          )}

          <div className={footer ? "pb-24" : "pb-8"}>{children}</div>
        </div>

        {footer ? (
          <div className="sticky bottom-0 z-10 border-t border-[#ececec] px-6 max-ph:px-4 py-4 bg-white">
            {footer}
          </div>
        ) : null}
      </div>
    </Drawer>
  );
}
