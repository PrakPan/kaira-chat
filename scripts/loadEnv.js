// Make the build's env file visible to node-side scripts.
//
// The gap this closes: scripts/sitemap.xml.js called `require("dotenv").config()`,
// which loads `.env` — a file this repo does not have and never had. So every
// process.env lookup in prebuild silently fell through to its hardcoded
// fallback, which is exactly why the sitemap's base URL was a literal constant
// in the first place: env vars genuinely did not reach it. scripts/tripsSeoCache.js
// never called dotenv at all, so lib/seo/tripsIndexed.js resolved
// NEXT_PUBLIC_MERCURY_HOST to its production default no matter which
// environment was being built.
//
// `.env.local` is the file to read, not `.env.development` / `.env.production`:
// s3-deploy.sh copies the selected env file over `.env.local` before building
// (and appends NEXT_PUBLIC_SENTRY_RELEASE to it), so it is the one place that
// reflects what THIS build is. It is also first in Next's own precedence, so
// `next build` and these scripts end up agreeing.
//
// Load it with `node -r ./scripts/loadEnv.js <script>` rather than requiring it
// from inside a script. A top-of-file require is not early enough: a module
// that reads process.env at import time (lib/seo/siteOrigin.js does) may be
// pulled in by an earlier require in the same file and capture the pre-dotenv
// value. `-r` runs before the entry module is loaded at all, so the ordering
// stops being something anyone has to keep in their head.

const fs = require("fs");
const path = require("path");

// In precedence order. `.env.local` is what a deploy writes; the others are the
// fallback for a developer running a prebuild script by hand on a clean
// checkout. Existing process.env values always win — dotenv does not overwrite,
// so CI variables and `cross-env` prefixes stay authoritative.
const CANDIDATES = [".env.local", ".env.development"];

const loaded = [];

for (const name of CANDIDATES) {
  const file = path.join(process.cwd(), name);
  if (!fs.existsSync(file)) continue;
  const result = require("dotenv").config({ path: file });
  if (result.error) {
    console.warn(`[env] could not read ${name}: ${result.error.message}`);
    continue;
  }
  loaded.push(name);
}

if (!loaded.length) {
  console.warn(
    "[env] no .env.local or .env.development found — scripts will fall back to built-in defaults"
  );
}

module.exports = { loaded };
