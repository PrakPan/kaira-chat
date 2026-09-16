// "Kerala itineraries →" in the top-right corner of a destination page's
// itinerary section, linking to the matching /trips hub.
//
// A real <a href>, not a click handler: the reason this link exists is for
// Google to find the hub on a destination page it already recrawls (see
// lib/seo/tripsHubs.js), and a crawler only follows anchors in the HTML.

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

/** The one hub a page's CTA points at: its own hub first, else the largest. */
export const primaryTripsHub = (hubs) =>
  Array.isArray(hubs) && hubs.length ? hubs[0] : null;

/** "Kerala itineraries". No count: it goes stale between deploys. */
export const tripsHubCtaLabel = (hub) => `${hub.label} itineraries`;

const TripsHubCta = ({ hubs, className }) => {
  const hub = primaryTripsHub(hubs);
  if (!hub) return null;

  return (
    <Link href={hub.href} className={className}>
      {tripsHubCtaLabel(hub)}
      <FontAwesomeIcon icon={faArrowRight} />
    </Link>
  );
};

export default TripsHubCta;
