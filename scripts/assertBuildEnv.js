#!/usr/bin/env node
//
// Refuse to build when the environment and the deploy target disagree.
//
// This is the guard for a whole class of bug that has already cost this domain
// real indexing: the build had no idea which site it was building. The origin
// written into canonicals and sitemaps was a hand-edited constant that differed
// per branch, the noindex flag was a separate env var nobody cross-checked
// against it, and a wrong combination produced an artifact that looked
// completely normal. You only found out weeks later, from Search Console.
//
// The four ways it could go wrong, and what each would have done:
//
//   1. prod built with NOINDEX=true      — deindexes the live site.
//   2. dev built with NOINDEX=false      — a second indexable copy of every
//                                          page, competing for the same queries.
//   3. origin set to a staging hostname  — production publishes a sitemap and
//                                          canonicals pointing at dev.
//   4. a new page hardcodes a hostname   — the refactor silently rots back to
//                                          where it started.
//
// All four are now fatal here, before next build runs. A failure costs a minute;
// each of these in production has cost weeks.
//
// Run by `prebuild`, so it covers `npm run build` whether that is a deploy or a
// developer on a laptop. DEPLOY_TARGET is exported by s3-deploy.sh; when it is
// absent (a plain local build) the target-specific checks are skipped and
// everything else still runs.

require("./loadEnv");

const fs = require("fs");
const path = require("path");

const {
  ALLOWED_ORIGINS,
  normalise,
} = require("../lib/seo/siteOrigin");

const errors = [];
const notes = [];

/* ------------------------------------------------------------------ inputs */

const rawOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN;
const origin = normalise(rawOrigin);
const noindex = String(process.env.NEXT_PUBLIC_NOINDEX || "").trim();
const target = String(process.env.DEPLOY_TARGET || "").trim();

/* ------------------------------------------------------- 1. origin is sane */

if (!rawOrigin) {
  errors.push(
    "NEXT_PUBLIC_SITE_ORIGIN is not set.\n" +
      "    Add it to .env.development and .env.production (both should be\n" +
      "    https://thetarzanway.com — see lib/seo/siteOrigin.js for why the\n" +
      "    value does NOT vary by environment)."
  );
} else if (!ALLOWED_ORIGINS.includes(origin)) {
  errors.push(
    `NEXT_PUBLIC_SITE_ORIGIN is ${JSON.stringify(rawOrigin)}, which is not a\n` +
      `    public origin of this site. Allowed: ${ALLOWED_ORIGINS.join(", ")}.\n` +
      "    A staging hostname here is the original bug: it puts dev URLs into\n" +
      "    production's sitemap and canonical tags."
  );
}

/* ------------------------------------------------- 2. noindex is explicit */

if (noindex !== "true" && noindex !== "false") {
  errors.push(
    `NEXT_PUBLIC_NOINDEX must be exactly "true" or "false", got ${JSON.stringify(
      process.env.NEXT_PUBLIC_NOINDEX
    )}.\n` +
      "    pages/_document.js tests `=== \"true\"`, so any other value (including\n" +
      "    unset) silently means INDEXABLE. On a staging build that publishes a\n" +
      "    duplicate of the whole site."
  );
}

/* --------------------------------------- 3. target and env tell one story */

// What each deploy target must be true of. `origin: null` means "not asserted".
//
// yourtrips is deliberately unasserted: s3-deploy.sh builds it from
// .env.production, so it inherits thetarzanway.com as its origin and currently
// serves your-trips.co.uk pages with thetarzanway.com canonicals. That is its
// existing behaviour and changing it is a separate decision about whether
// your-trips is a brand of its own or a mirror — not something this guard
// should force by failing the build. Give it its own env file and set the
// expectation here when that call is made.
const TARGET_RULES = {
  dev: {
    noindex: "true",
    origin: "https://thetarzanway.com",
    why: "dev.thetarzanway.com is a staging copy, so it must carry the noindex meta tag and still declare production as canonical",
  },
  prod: {
    noindex: "false",
    origin: "https://thetarzanway.com",
    why: "production is the indexable site",
  },
  yourtrips: {
    noindex: "false",
    origin: null,
    why: "your-trips.co.uk builds from .env.production today",
  },
};

if (!target) {
  notes.push(
    "DEPLOY_TARGET is unset, so target-specific checks were skipped. This is\n" +
      "  normal for a local `npm run build`; s3-deploy.sh always sets it."
  );
} else if (!TARGET_RULES[target]) {
  errors.push(
    `DEPLOY_TARGET is ${JSON.stringify(target)}, which is not a known target.\n` +
      `    Known: ${Object.keys(TARGET_RULES).join(", ")}.`
  );
} else {
  const rule = TARGET_RULES[target];

  if (noindex !== rule.noindex) {
    errors.push(
      `DEPLOY_TARGET=${target} requires NEXT_PUBLIC_NOINDEX=${rule.noindex}, but it is ${JSON.stringify(
        noindex
      )}.\n` + `    ${rule.why}.`
    );
  }

  if (rule.origin && origin !== rule.origin) {
    errors.push(
      `DEPLOY_TARGET=${target} requires NEXT_PUBLIC_SITE_ORIGIN=${rule.origin}, but it is ${JSON.stringify(
        origin
      )}.`
    );
  }
}

/* ------------------------------------- 4. nobody has re-hardcoded a host */

// Only the exact public origins and the staging hostnames are of interest.
// images./visa./blog.thetarzanway.com are real, separate services and must keep
// their literal URLs — matching on a bare "thetarzanway.com" substring would
// flag every one of them.
const SCAN_DIRS = ["pages", "components", "lib", "scripts"];
const SCAN_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);

// Files allowed to name an origin literally: the module that defines them, and
// this guard, which has to name them to check for them.
const SCAN_EXEMPT = new Set([
  path.join("lib", "seo", "siteOrigin.js"),
  path.join("scripts", "assertBuildEnv.js"),
]);

// A quoted run on one line that reaches one of these hosts. Requiring the
// opening quote is what keeps prose in comments (which legitimately discuss
// dev.thetarzanway.com) from being flagged.
const QUOTED = "[\"'`][^\"'`\\n]*";
const PUBLIC_ORIGIN_LITERAL = new RegExp(
  `${QUOTED}https://(?:thetarzanway\\.com|your-trips\\.co\\.uk)(?![a-z0-9.-])`,
  "g"
);
const STAGING_ORIGIN_LITERAL = new RegExp(
  `${QUOTED}https?://(?:www\\.)?(?:dev\\.thetarzanway\\.com|www\\.thetarzanway\\.com)`,
  "g"
);

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      walk(full, out);
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
};

const hardcodedPublic = [];
const hardcodedStaging = [];

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (SCAN_EXEMPT.has(file)) continue;

    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      // Comments are prose, including commented-out markup. Flagging them would
      // make this guard fire on the explanations of the very rule it enforces.
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;

      // Reset lastIndex: these are /g regexes reused across lines.
      PUBLIC_ORIGIN_LITERAL.lastIndex = 0;
      STAGING_ORIGIN_LITERAL.lastIndex = 0;

      if (STAGING_ORIGIN_LITERAL.test(line)) {
        hardcodedStaging.push(`${file}:${i + 1}: ${line.trim().slice(0, 110)}`);
      } else if (PUBLIC_ORIGIN_LITERAL.test(line)) {
        hardcodedPublic.push(`${file}:${i + 1}: ${line.trim().slice(0, 110)}`);
      }
    });
  }
}

if (hardcodedStaging.length) {
  errors.push(
    `A staging hostname is hardcoded in ${hardcodedStaging.length} place(s).\n` +
      "    Staging is not a site: pages served from dev must still declare the\n" +
      "    production origin. Use SITE_ORIGIN from lib/seo/siteOrigin.js.\n" +
      hardcodedStaging.map((l) => `      ${l}`).join("\n")
  );
}

if (hardcodedPublic.length) {
  errors.push(
    `The public origin is hardcoded in ${hardcodedPublic.length} place(s).\n` +
      "    Import SITE_ORIGIN from lib/seo/siteOrigin.js instead, so there stays\n" +
      "    exactly one place that decides what this site calls itself.\n" +
      hardcodedPublic.map((l) => `      ${l}`).join("\n")
  );
}

/* ----------------------------------------------------------------- report */

const label = target ? `${target} ` : "";

if (errors.length) {
  console.error(`\n✗ ${label}build refused — environment is inconsistent\n`);
  errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}\n`));
  console.error(
    "  Nothing was built. Fix the above, or read lib/seo/siteOrigin.js for\n" +
      "  what these values mean.\n"
  );
  process.exit(1);
}

console.log(
  `✓ ${label}build env OK — origin ${origin}, noindex ${noindex}` +
    (target ? "" : " (no DEPLOY_TARGET)")
);
notes.forEach((n) => console.log(`  note: ${n}`));
