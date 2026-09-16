// Page groups — which routes a given deploy actually builds.
//
// `output: "export"` has no way to build a subset of pages: next builds every
// route it can see under pages/. So the only lever is what is in the tree when
// the build starts, which is what this script moves. It generalises the old
// scripts/removeTripsPage.js, which did the same thing for pages/trips alone.
//
// Why bother: the two big groups are priced per page at build time.
// destinations is 2,306 pages and each one's getStaticProps makes one to three
// mercury calls; trips is 1,865 pages plus a ~3 minute prebuild crawl. The
// other ~50 pages are free by comparison. Content in both moves on its own
// slow cadence, so rebuilding them on every release spends 20+ minutes to
// re-emit byte-identical HTML.
//
// The backup lives outside pages/ on purpose: anything left inside, whatever
// it is named, is still scanned for routes, and a directory of .js files parked
// under pages/ would be published as real URLs.

const fs = require("fs");
const path = require("path");

const PAGES_DIR = path.join(process.cwd(), "pages");
const BACKUP_DIR = path.join(process.cwd(), ".page-groups-backup");

// `pages` are paths under pages/ that the group owns — moved out when the group
// is not selected. `keyPrefixes` are the S3 key prefixes its pages export to,
// used to attribute uploaded files back to a group (see scripts/s3Manifest.js).
//
// `core` is never moved: _app, _document, 404 and the ~30 hand-written pages
// have to exist in every build, and public/ is copied into every export, so
// core is also the group that owns the static assets.
const GROUPS = {
  core: {
    always: true,
    pages: [],
    keyPrefixes: [],
    description: "root pages, chat, dashboard, itinerary, flights, hotels, public assets",
  },
  destinations: {
    pages: ["[continent]"],
    // Continent slugs come from mercury, so the prefixes cannot be hardcoded —
    // they are discovered from the build's prerender manifest and recorded in
    // the group's own manifest instead.
    keyPrefixes: [],
    dynamicPrefixes: true,
    description: "continent / country / state / city pages (2,306 pages)",
  },
  themes: {
    // pages/asia holds thailand.tsx, the one country served by its own
    // cinematic page rather than the generic [country] route. It ships with the
    // themes it resembles, not with destinations.
    pages: ["theme", "asia"],
    keyPrefixes: ["theme/"],
    // Exactly one key, not the asia/thailand/ prefix: everything below it
    // (asia/thailand/bangkok/…, 36 keys) is destinations' state and city pages,
    // and claiming the prefix would hand them to a group that does not build
    // them — so the next themes deploy would delete them.
    keys: ["asia/thailand/index.html"],
    description: "theme landing pages (static + CMS) and /asia/thailand",
  },
  events: {
    pages: ["event"],
    keyPrefixes: ["event/"],
    description: "event landing pages",
  },
  trips: {
    pages: ["trips"],
    keyPrefixes: ["trips/"],
    // Not buildable from this branch: scripts/tripsSeoCache.js is commented out
    // of package.json's `prebuild`, so the .seo-cache snapshot is absent and
    // pages/trips/** short-circuit to an empty path list. Selecting the group
    // anyway compiles zero pages, which s3Manifest.js already refuses to write
    // a manifest for — but only after a full build. Refusing at `select` costs
    // twenty minutes less and says where the switch is.
    disabled:
      "trips are commented out of this branch's build — see `_comment_prebuild` " +
      "in package.json and the notes in pages/trips/**",
    // Exclusively this group's namespace: nothing else exports under /trips/,
    // so `s3Manifest.js prune --reconcile` may sweep anything there that this
    // build did not emit. That is how the 658 legacy /trips/<group_type>/ pages
    // get cleared without a bucket-wide --delete.
    ownedPrefixes: ["trips/"],
    description: "SEO trips index, destination hubs and itinerary leaves (1,865 pages)",
  },
};

const ALL = Object.keys(GROUPS);
const OPTIONAL = ALL.filter((name) => !GROUPS[name].always);

/** Parse a csv selection, always including the `always` groups. */
const resolve = (csv) => {
  const asked = String(csv || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const unknown = asked.filter((name) => !GROUPS[name] && name !== "all");
  if (unknown.length) {
    throw new Error(
      `unknown page group(s): ${unknown.join(", ")} — known groups: ${ALL.join(", ")}`
    );
  }

  // A group can be switched off in the tree itself (see `disabled` on trips).
  // Naming it is a mistake worth stopping: the build would compile zero of its
  // pages and the deploy would then have to be diagnosed from a manifest error
  // twenty minutes later. `all` is not that mistake — it means "everything this
  // branch can build" — so there the group is dropped with a warning instead.
  // Dropping rather than selecting-and-emitting-nothing also keeps it out of
  // the manifest, so no prune ever looks at its live pages.
  const named = asked.filter((name) => name !== "all" && GROUPS[name].disabled);
  if (named.length) {
    throw new Error(
      named
        .map((name) => `[page-groups] ${name}: ${GROUPS[name].disabled}`)
        .join("\n")
    );
  }

  const selected = asked.includes("all") ? [...ALL] : asked;
  for (const name of ALL) {
    if (GROUPS[name].always && !selected.includes(name)) selected.push(name);
  }

  return ALL.filter(
    (name) => selected.includes(name) && !GROUPS[name].disabled
  );
};

const move = (src, dest) => {
  if (!fs.existsSync(src)) return false;

  if (fs.existsSync(dest)) {
    throw new Error(
      `[page-groups] ${path.relative(process.cwd(), dest)} already exists — a previous ` +
        "build was interrupted; run `node scripts/pageGroups.js restore` first"
    );
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
  return true;
};

/** Move every non-selected group out of pages/ for the duration of a build. */
const select = (csv) => {
  const selected = resolve(csv);
  const skipped = OPTIONAL.filter((name) => !selected.includes(name));

  for (const name of skipped) {
    for (const rel of GROUPS[name].pages) {
      const moved = move(path.join(PAGES_DIR, rel), path.join(BACKUP_DIR, name, rel));
      if (moved) console.log(`[page-groups] parked pages/${rel} (${name})`);
    }
  }

  for (const name of skipped) {
    if (GROUPS[name].disabled) {
      console.log(`[page-groups] ${name} is switched off: ${GROUPS[name].disabled}`);
    }
  }

  console.log(`[page-groups] building: ${selected.join(", ")}`);
  if (skipped.length) {
    console.log(
      `[page-groups] NOT building: ${skipped.join(", ")} — their live pages are left ` +
        "untouched on S3"
    );
  }

  return selected;
};

/** Put everything back. Safe to run when nothing was moved. */
const restore = () => {
  if (!fs.existsSync(BACKUP_DIR)) return;

  for (const name of OPTIONAL) {
    for (const rel of GROUPS[name].pages) {
      const moved = move(path.join(BACKUP_DIR, name, rel), path.join(PAGES_DIR, rel));
      if (moved) console.log(`[page-groups] restored pages/${rel} (${name})`);
    }
  }

  // Only removes the now-empty scaffolding; a non-empty tree here means a path
  // was renamed in GROUPS without being restored, and losing it silently would
  // be worse than the error.
  fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
};

if (require.main === module) {
  const [command, arg] = process.argv.slice(2);

  try {
    if (command === "select") {
      if (!arg) throw new Error("usage: pageGroups.js select <group,group|all>");
      select(arg);
    } else if (command === "restore") {
      restore();
    } else if (command === "list") {
      for (const name of ALL) {
        const tag = GROUPS[name].always
          ? " (always built)"
          : GROUPS[name].disabled
            ? " (SWITCHED OFF on this branch)"
            : "";
        console.log(`  ${name.padEnd(14)}${GROUPS[name].description}${tag}`);
      }
    } else {
      console.error("usage: pageGroups.js <select <groups>|restore|list>");
      process.exit(1);
    }
  } catch (err) {
    // Non-zero matters: s3-deploy.sh aborts on it. A silent failure at `select`
    // builds groups the deploy did not ask for — 20 minutes and a surprise
    // publish — and one at `restore` leaves the working tree without its pages.
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { GROUPS, ALL, OPTIONAL, resolve, select, restore };
