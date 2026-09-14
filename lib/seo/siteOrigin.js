// Single source of truth for the PUBLIC origin of this site.
//
// The bug this exists to prevent: the origin used to be a hand-edited constant
// (`PROD_BASE_URL` in scripts/sitemap.xml.js) whose value differed per branch —
// the dev hostname on `development`, the production hostname on `main`. A merge
// in the wrong direction would have published a production sitemap of 1,865 dev
// URLs, and in the meantime every dev deploy shipped a crawlable sitemap naming
// dev.thetarzanway.com. Nothing in the build could detect either case, because
// the deploy target and the URLs written into the pages were independent facts.
//
// Two DIFFERENT ideas were being conflated, and keeping them apart is the whole
// point of this module:
//
//   PUBLIC ORIGIN (this file)  — the hostname the site claims to be. It goes in
//     canonicals, og:url, JSON-LD and sitemaps. It is a property of the BRAND,
//     not of the bucket the bytes land in. dev.thetarzanway.com is a staging
//     copy of the production site, not a site of its own, so a page served from
//     dev still declares production as its canonical. That is deliberate: it is
//     what stops the staging copy competing with the real one for the same
//     queries.
//
//   DEPLOY TARGET (scripts/assertBuildEnv.js) — which bucket this build is for.
//     It decides whether the noindex meta tag is emitted, and nothing else.
//
// So NEXT_PUBLIC_SITE_ORIGIN is the same value in .env.development and
// .env.production. That is not a redundancy to tidy away later: it is the
// invariant. If you ever find yourself wanting to set it to a dev hostname to
// "test the sitemap", you are re-creating the original bug — build the sitemap
// and read out/sitemap.xml on disk instead.
//
// No dotenv here. This module is imported by pages and therefore bundled for
// the browser, where `fs` does not exist. Next inlines NEXT_PUBLIC_* at build
// time for the app; node-side scripts load the env file themselves via
// scripts/loadEnv.js, which must run before anything requires this file (the
// prebuild entries use `node -r ./scripts/loadEnv.js` so ordering is not a
// thing anyone has to remember).

// Origins this codebase is allowed to present itself as. Anything else is a
// typo or a staging hostname that has escaped into the build, and
// scripts/assertBuildEnv.js refuses to build with it.
const ALLOWED_ORIGINS = Object.freeze([
  "https://thetarzanway.com",
  "https://your-trips.co.uk",
]);

const DEFAULT_ORIGIN = ALLOWED_ORIGINS[0];

/** Strip trailing slashes so `${SITE_ORIGIN}${path}` never doubles up. */
const normalise = (value) => String(value || "").trim().replace(/\/+$/, "");

/**
 * Why a fallback rather than a throw: this module is evaluated in the browser
 * bundle too, and a page that has already shipped should not blow up in a
 * user's tab because an env var went missing. The build is where a missing or
 * wrong value has to be fatal, and that is assertBuildEnv.js's job — it runs
 * before next build and stops the release.
 */
const resolveOrigin = () => {
  const fromEnv = normalise(process.env.NEXT_PUBLIC_SITE_ORIGIN);
  if (!fromEnv) return DEFAULT_ORIGIN;
  return ALLOWED_ORIGINS.includes(fromEnv) ? fromEnv : DEFAULT_ORIGIN;
};

const SITE_ORIGIN = resolveOrigin();

/** Absolute public URL for a site-relative path. */
const absoluteUrl = (path = "") => {
  const suffix = String(path || "");
  if (!suffix) return SITE_ORIGIN;
  return `${SITE_ORIGIN}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
};

module.exports = {
  SITE_ORIGIN,
  ALLOWED_ORIGINS,
  DEFAULT_ORIGIN,
  absoluteUrl,
  normalise,
};
