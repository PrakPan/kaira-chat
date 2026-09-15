// Which /trips/<hub> pages a destination page links to.
//
// Why this exists: Google had queued the trips hubs ("Discovered, currently not
// indexed") but not crawled them. They were reachable only from /trips itself,
// a page Google had not crawled either, which carries 1,864 links. Meanwhile
// the destination pages (/asia/india/kerala, /asia/japan, ...) are indexed,
// recrawled every few days, and already rank for the same places. A single
// relevant link from each of them is the fastest way to get the matching hub
// crawled, because Google finds it on a page it is already revisiting.
//
// The map is explicit rather than a slug match. A name match picks the wrong
// page for a real share of hubs: `georgia` also matches the US state,
// `udaipur` also matches a town in Tripura, and `goa` or `dubai` exist at two
// depths. Multi-country hubs (`singapore-malaysia`, `balkans`) match nothing by
// name and belong on every country they cover.
//
// Hub slugs come from the trips SEO index (`destination` on each trip).
// scripts/tripsSeoCache.js warns when a hub in the index is missing here, so a
// newly published destination does not silently go unlinked.

const HUB_PAGES = {
  // One hub, one destination page.
  agatti: ["asia/india/lakshadweep/agatti"],
  albania: ["europe/albania"],
  amritsar: ["asia/india/punjab/amritsar"],
  andaman: ["asia/india/andaman_and_nicobar"],
  "andhra-pradesh": ["asia/india/andhra_pradesh"],
  "arunachal-pradesh": ["asia/india/arunachal_pradesh"],
  assam: ["asia/india/assam"],
  auli: ["asia/india/uttarakhand/auli"],
  australia: ["oceania/australia"],
  austria: ["europe/austria"],
  azerbaijan: ["asia/azerbaijan"],
  badrinath: ["asia/india/uttarakhand/badrinath"],
  bali: ["asia/indonesia/bali"],
  bangkok: ["asia/thailand/bangkok"],
  bhutan: ["asia/bhutan"],
  bulgaria: ["europe/bulgaria"],
  cambodia: ["asia/cambodia"],
  canada: ["north_america/canada"],
  china: ["asia/china"],
  coorg: ["asia/india/karnataka/coorg"],
  croatia: ["europe/croatia"],
  "czech-republic": ["europe/czech_republic"],
  dandeli: ["asia/india/karnataka/dandeli"],
  darjeeling: ["asia/india/west_bengal/darjeeling"],
  dharamshala: ["asia/india/himachal_pradesh/dharamshala"],
  dubai: ["asia/united_arab_emirates/dubai"],
  egypt: ["africa/egypt"],
  europe: ["europe"],
  finland: ["europe/finland"],
  france: ["europe/france"],
  gangtok: ["asia/india/sikkim/gangtok"],
  georgia: ["europe/georgia"],
  germany: ["europe/germany"],
  goa: ["asia/india/goa"],
  gokarna: ["asia/india/karnataka/gokarna"],
  greece: ["europe/greece"],
  gujarat: ["asia/india/gujarat"],
  haflong: ["asia/india/assam/haflong"],
  hampi: ["asia/india/karnataka/hampi"],
  himachal: ["asia/india/himachal_pradesh"],
  "hong-kong": ["asia/hong_kong"],
  hungary: ["europe/hungary"],
  hyderabad: ["asia/india/telangana/hyderabad"],
  iceland: ["europe/iceland"],
  italy: ["europe/italy"],
  jaipur: ["asia/india/rajasthan/jaipur"],
  jaisalmer: ["asia/india/rajasthan/jaisalmer"],
  japan: ["asia/japan"],
  jibhi: ["asia/india/himachal_pradesh/jibhi"],
  jodhpur: ["asia/india/rajasthan/jodhpur"],
  jordan: ["asia/jordan"],
  karnataka: ["asia/india/karnataka"],
  kasauli: ["asia/india/himachal_pradesh/kasauli"],
  kashmir: ["asia/india/jammu_and_kashmir"],
  kazakhstan: ["asia/kazakhstan"],
  "kaziranga-national-park": ["asia/india/assam/kaziranga_national_park"],
  kerala: ["asia/india/kerala"],
  kochi: ["asia/india/kerala/kochi"],
  kodaikanal: ["asia/india/tamil_nadu/kodaikanal"],
  kolhapur: ["asia/india/maharashtra/kolhapur"],
  kolkata: ["asia/india/west_bengal/kolkata"],
  kyrgyzstan: ["asia/kyrgyzstan"],
  ladakh: ["asia/india/ladakh"],
  lakshadweep: ["asia/india/lakshadweep"],
  laos: ["asia/laos"],
  london: ["europe/united_kingdom/england/london"],
  lonavala: ["asia/india/maharashtra/lonavala"],
  "madhya-pradesh": ["asia/india/madhya_pradesh"],
  maharashtra: ["asia/india/maharashtra"],
  malaysia: ["asia/malaysia"],
  maldives: ["asia/maldives"],
  manali: ["asia/india/himachal_pradesh/manali"],
  mandi: ["asia/india/himachal_pradesh/mandi"],
  mauritius: ["africa/mauritius"],
  "mcleod-ganj": ["asia/india/himachal_pradesh/mcleod_ganj"],
  meghalaya: ["asia/india/meghalaya"],
  "mount-abu": ["asia/india/rajasthan/mount_abu"],
  mukteshwar: ["asia/india/uttarakhand/mukteshwar"],
  mumbai: ["asia/india/maharashtra/mumbai"],
  munnar: ["asia/india/kerala/munnar"],
  mussoorie: ["asia/india/uttarakhand/mussoorie"],
  nanded: ["asia/india/maharashtra/nanded"],
  nashik: ["asia/india/maharashtra/nashik"],
  nelliyampathy: ["asia/india/kerala/nelliyampathy"],
  nepal: ["asia/nepal"],
  netherlands: ["europe/netherlands"],
  "new-zealand": ["oceania/new_zealand"],
  norway: ["europe/norway"],
  odisha: ["asia/india/odisha"],
  oman: ["asia/oman"],
  omkareshwar: ["asia/india/madhya_pradesh/omkareshwar"],
  ooty: ["asia/india/tamil_nadu/ooty"],
  pachmarhi: ["asia/india/madhya_pradesh/pachmarhi"],
  paris: ["europe/france/ile-de-france/paris"],
  philippines: ["asia/philippines"],
  pondicherry: ["asia/india/pondicherry"],
  "port-blair": ["asia/india/andaman_and_nicobar/port_blair"],
  punjab: ["asia/india/punjab"],
  puri: ["asia/india/odisha/puri"],
  rajasthan: ["asia/india/rajasthan"],
  rishikesh: ["asia/india/uttarakhand/rishikesh"],
  romania: ["europe/romania"],
  seychelles: ["africa/seychelles"],
  shillong: ["asia/india/meghalaya/shillong"],
  shimla: ["asia/india/himachal_pradesh/shimla"],
  shirdi: ["asia/india/maharashtra/shirdi"],
  sikkim: ["asia/india/sikkim"],
  singapore: ["asia/singapore"],
  somnath: ["asia/india/gujarat/somnath"],
  "south-africa": ["africa/south_africa"],
  "south-korea": ["asia/south_korea"],
  spain: ["europe/spain"],
  "sri-lanka": ["asia/sri_lanka"],
  srinagar: ["asia/india/jammu_and_kashmir/srinagar"],
  sweden: ["europe/sweden"],
  switzerland: ["europe/switzerland"],
  taiwan: ["asia/taiwan"],
  "tamil-nadu": ["asia/india/tamil_nadu"],
  tanzania: ["africa/tanzania"],
  thailand: ["asia/thailand"],
  turkey: ["europe/turkey"],
  udaipur: ["asia/india/rajasthan/udaipur"],
  ujjain: ["asia/india/madhya_pradesh/ujjain"],
  uk: ["europe/united_kingdom"],
  usa: ["north_america/united_states"],
  "uttar-pradesh": ["asia/india/uttar_pradesh"],
  uttarakhand: ["asia/india/uttarakhand"],
  valparai: ["asia/india/tamil_nadu/valparai"],
  varanasi: ["asia/india/uttar_pradesh/varanasi"],
  varkala: ["asia/india/kerala/varkala"],
  vietnam: ["asia/vietnam"],
  wayanad: ["asia/india/kerala/wayanad"],

  // Multi-destination hubs: linked from every place the itineraries cover.
  "australia-new-zealand": ["oceania/australia", "oceania/new_zealand"],
  balkans: ["europe/croatia", "europe/montenegro", "europe/albania", "europe/bosnia_and_herzegovina"],
  "georgia-armenia": ["europe/georgia", "asia/armenia"],
  "georgia-azerbaijan": ["europe/georgia", "asia/azerbaijan"],
  "golden-triangle": ["asia/india/delhi", "asia/india/uttar_pradesh/agra", "asia/india/rajasthan/jaipur"],
  "japan-korea": ["asia/japan", "asia/south_korea"],
  "northeast-india": ["asia/india/meghalaya", "asia/india/assam"],
  "sikkim-darjeeling": ["asia/india/sikkim", "asia/india/west_bengal/darjeeling"],
  "singapore-bali": ["asia/singapore", "asia/indonesia/bali"],
  "singapore-malaysia": ["asia/singapore", "asia/malaysia"],
  "singapore-thailand": ["asia/singapore", "asia/thailand"],
  "south-india": ["asia/india/kerala", "asia/india/tamil_nadu", "asia/india/karnataka"],
  "thailand-vietnam": ["asia/thailand", "asia/vietnam"],
  "vietnam-cambodia": ["asia/vietnam", "asia/cambodia"],
};

/** Destination path -> hub slugs, built once from HUB_PAGES. */
const PAGE_HUBS = Object.entries(HUB_PAGES).reduce((acc, [hub, pages]) => {
  for (const page of pages) {
    (acc[page] = acc[page] || []).push(hub);
  }
  return acc;
}, {});

const normalisePath = (value) =>
  String(value || "")
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

/**
 * The trips hubs to link from one destination page, for getStaticProps.
 *
 * Returns [] rather than throwing when the trips snapshot is unavailable: a
 * destination page must still build without its hub links. Only hubs that
 * actually have trips in the current index are returned, so a link can never
 * point at a hub page this deploy did not publish.
 *
 * The page's own hub comes first (Kerala before South India), then shared
 * multi-destination hubs by trip count.
 */
function tripsHubsForPath(destinationPath) {
  const hubs = PAGE_HUBS[normalisePath(destinationPath)];
  if (!hubs || !hubs.length) return [];

  let byDestination;
  try {
    // Required lazily: tripsCache reads the filesystem, and this module's map
    // must stay importable anywhere.
    byDestination = require("./tripsCache").readDestinations();
  } catch (err) {
    return [];
  }

  const { destinationLabel } = require("./tripsFormat");

  return hubs
    .map((slug) => ({
      slug,
      href: `/trips/${slug}`,
      label: destinationLabel(slug),
      count: (byDestination.get(slug) || []).length,
      isOwn: HUB_PAGES[slug].length === 1,
    }))
    .filter((hub) => hub.count > 0)
    .sort((a, b) => Number(b.isOwn) - Number(a.isOwn) || b.count - a.count);
}

module.exports = { HUB_PAGES, PAGE_HUBS, tripsHubsForPath };
