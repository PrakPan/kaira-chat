// Choosing a page title from CMS fields that were not designed to hold one.
//
// The CMS has no SEO title field. A theme or destination record offers `name`,
// `tagline`, `banner_heading` and `social_share_title`, and pages reached for
// the last of those because it is the only one shaped like a title.
//
// That works right up until the field has not been filled in for the page. The
// CMS pre-fills `social_share_title` with the site-wide default below, and on
// 16 of the 39 theme pages that default was never replaced — so 16 live pages
// shipped a byte-identical <title>. A title that is the same on every page
// describes none of them, to a reader scanning results or to a crawler deciding
// whether a page is worth indexing at all.
//
// The fix is not to abandon `social_share_title`: where somebody HAS filled it
// in it is comfortably the best title available. /theme/kashmir-2026 carries
// "Kashmir Trip Planner | AI Trip Planner & Custom Itineraries" there, while its
// `name` is "Kashmir —April", which would make a worse title and a strange
// search result. So the test is not whether the field is set, but whether what
// is in it actually distinguishes this page.
//
// This logic already existed inline in the state route. It lives here so both
// routes share one definition of the default string: if the CMS ever changes
// that default, a copy left behind in another file would silently stop matching
// and those pages would quietly go back to sharing a title.

/** The value the CMS pre-fills `social_share_title` with. */
const GENERIC_SHARE_TITLE = "The Tarzan Way | Personalized Travel Experiences";

/**
 * Has this record's share title been given a page-specific value?
 * Empty, whitespace, and the untouched CMS default all count as "no".
 */
const isPageSpecificShareTitle = (value) => {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed !== "" && trimmed !== GENERIC_SHARE_TITLE;
};

/**
 * The share title when it says something about this page, otherwise the
 * caller's page-specific fallback.
 */
const resolveTitle = (shareTitle, fallback) =>
  isPageSpecificShareTitle(shareTitle) ? shareTitle.trim() : fallback;

module.exports = {
  GENERIC_SHARE_TITLE,
  isPageSpecificShareTitle,
  resolveTitle,
};
