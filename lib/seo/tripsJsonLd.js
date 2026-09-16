// Structured data for the SEO trips pages.
//
// Built as objects and serialised with JSON.stringify rather than assembled as
// template strings: a null price or an apostrophe in a city name produces
// invalid JSON in a string template, and Google silently drops the whole block
// when it fails to parse.
//
// There is deliberately no AggregateRating anywhere in this file. The review
// scores and rating counts these pages used to carry were generated values, not
// real customer reviews; they were deleted from the database in backend v9.3.8
// and must not be reintroduced from the frontend. Rich-result stars are not
// worth marking up ratings nobody gave.

const { SITE_ORIGIN } = require("./tripsIndexed");
const { tripName } = require("./tripName");
const { roundedPerPerson } = require("./tripsFormat");

const PROVIDER = {
  "@type": "TravelAgency",
  name: "The Tarzan Way",
  url: SITE_ORIGIN,
};

const clean = (value) => (typeof value === "string" && value.trim() ? value.trim() : null);

/** "Helsinki (2 nights)" — the ordered stop list Google renders under the trip. */
const cityListItems = (cities = []) =>
  cities
    .map((city, index) => {
      const name = clean(city?.name);
      if (!name) return null;

      const nights = Number(city?.nights);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: Number.isFinite(nights) && nights > 0 ? `${name} (${nights} nights)` : name,
      };
    })
    .filter(Boolean);

function touristTripSchema(page) {
  const url = `${SITE_ORIGIN}${page.url}`;
  const items = cityListItems(page.cities);
  // Same rounding as the visible price block and the backend's page_title.
  const perPerson = roundedPerPerson(page.price);

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    // The same public name the heading uses — the trip's own, with the customer
    // credit stripped. See lib/seo/tripName.
    name: tripName(page) || page.h1,
    description: page.meta_description,
    url,
    ...(items.length
      ? { itinerary: { "@type": "ItemList", itemListElement: items } }
      : {}),
    ...(perPerson
      ? {
          offers: {
            "@type": "Offer",
            price: String(perPerson),
            priceCurrency: page.price?.currency || "INR",
            url,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    provider: PROVIDER,
  };
}

/**
 * Only emitted when there are FAQs, and the answers here must stay identical to
 * the ones rendered on the page — Google treats FAQ markup that does not appear
 * in the visible text as a structured-data violation.
 */
function faqSchema(faqs = []) {
  const entities = faqs
    .map((faq) => {
      const question = clean(faq?.q);
      const answer = clean(faq?.a);
      if (!question || !answer) return null;

      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      };
    })
    .filter(Boolean);

  return entities.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: entities }
    : null;
}

function breadcrumbSchema(crumbs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_ORIGIN}${crumb.href}`,
    })),
  };
}

module.exports = { touristTripSchema, faqSchema, breadcrumbSchema };
