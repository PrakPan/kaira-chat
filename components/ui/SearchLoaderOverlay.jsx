import ReactDOM from "react-dom";
import { ItineraryStatusLoader } from "../../containers/itinerary/ItineraryContainer";

/**
 * Floating "Finding best … for you" loader shown while a search drawer
 * fetches results. Portals to the body and aligns itself over the right
 * anchored drawer region (50% on desktop, full width on mobile — matching
 * the Drawer breakpoint at 984px), so it floats centered above the skeleton
 * cards just like the stays search drawer.
 */
export default function SearchLoaderOverlay({
  isVisible,
  displayText,
  zIndex = 2000,
}) {
  if (!isVisible || !displayText || typeof document === "undefined") {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="ttw-search-loader-overlay" style={{ zIndex }}>
      <ItineraryStatusLoader
        displayText={displayText}
        isVisible={isVisible}
        iconVariant="search"
      />
      <style jsx>{`
        .ttw-search-loader-overlay {
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          pointer-events: none;
        }
        @media screen and (min-width: 984px) {
          .ttw-search-loader-overlay {
            width: 50vw;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
