// Deploy manifests — what each page group put on S3, so stale objects can be
// removed without a bucket-wide `aws s3 sync --delete`.
//
// The problem this replaces: prod deploys synced without --delete for years, so
// the bucket grew to 573,690 keys / 29.7 GB, of which 560,335 were dead
// _next/data JSONs across 378 build generations. The one flag that cleaned it
// up, `--delete`, is unusable here — it deletes everything absent from the
// local out/, which for a partial build is most of the site, and it interleaves
// those deletes with uploads in key order, so it takes the origin apart while
// the CDN is still serving pages that reference it.
//
// So deletion is driven by a record instead of by a diff against one build:
//
//   build   (local, no AWS)  attribute every file in out/ to a page group
//   prune   (after the CDN invalidation has completed)
//             - per group: delete what the previous deploy of that group put
//               up and this one did not
//             - globally: delete _next/ objects no live group manifest claims
//
// Because each group carries the asset list of the build that produced it, a
// group that has not been rebuilt for months keeps its chunks and its data
// JSONs. That is what makes partial deploys safe.
//
// Manifests are plain key lists — no secrets — and live in the site bucket
// under .deploy/. Set DEPLOY_MANIFEST_BUCKET to keep them somewhere else.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const { GROUPS, ALL, resolve } = require("./pageGroups");

const OUT_DIR = path.join(process.cwd(), "out");
const WORK_DIR = path.join(process.cwd(), ".deploy-work");
const WORK_FILE = path.join(WORK_DIR, "manifests.json");
const MANIFEST_PREFIX = ".deploy";
const DELETE_BATCH = 1000; // hard limit of the DeleteObjects API

const aws = (args, { allowFail = false, maxBuffer = 512 * 1024 * 1024 } = {}) => {
  try {
    // stderr is captured rather than inherited (node's default) so an expected
    // 404 on a group's first deploy does not print "fatal error: ..." into a
    // production deploy log that is otherwise fine.
    return execFileSync("aws", args, {
      encoding: "utf8",
      maxBuffer,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    if (allowFail) return null;
    throw new Error(`aws ${args.slice(0, 3).join(" ")} failed: ${err.stderr || err.message}`);
  }
};

/* ------------------------------------------------------------------ build */

const walk = (dir, base = dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, acc);
    else if (entry.isFile()) acc.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return acc;
};

/**
 * Continent slugs are mercury's to decide, so destinations' key prefixes are
 * read back out of the build rather than hardcoded: every prerendered route
 * whose srcRoute is under /[continent] contributes its first path segment.
 */
const prefixesFromBuild = () => {
  const file = path.join(process.cwd(), ".next", "prerender-manifest.json");
  if (!fs.existsSync(file)) return [];

  const routes = JSON.parse(fs.readFileSync(file, "utf8")).routes || {};
  const prefixes = new Set();

  for (const [route, meta] of Object.entries(routes)) {
    if (!String(meta.srcRoute || "").startsWith("/[continent]")) continue;
    const segment = route.split("/").filter(Boolean)[0];
    if (segment) prefixes.add(`${segment}/`);
  }

  return [...prefixes].sort();
};

/**
 * Fallback for when .next is gone but out/ is intact — `next dev` clears .next,
 * so a manifest rebuilt after someone started the dev server would otherwise
 * find no continents and quietly file 2,306 destination pages under core, which
 * the next core-only deploy would then delete as removed pages.
 *
 * Derived by elimination rather than from a list of continents, because there
 * is no list: /[continent] is the only top-level catch-all route, so a
 * directory in out/ that no hand-written page and no public/ asset accounts for
 * can only have come from it. Reading the countries sitemap instead looks
 * tempting and is wrong — it does not carry india/, which the export does.
 */
const prefixesFromExport = () => {
  const publicNames = new Set(fs.readdirSync(path.join(process.cwd(), "public")));

  // Paths every group claims under pages/, so what is left is core's.
  const grouped = new Set();
  for (const name of ALL) for (const rel of GROUPS[name].pages) grouped.add(rel);

  const coreNames = new Set(
    fs
      .readdirSync(path.join(process.cwd(), "pages"))
      .map((entry) => entry.replace(/\.(jsx?|tsx?)$/, ""))
      .filter((name) => !grouped.has(name))
  );

  // theme/, event/, trips/ — but not asia/, which is a continent that merely
  // also holds one themes page (claimed by exact key, not by prefix).
  const otherGroupPrefixes = ALL.filter((name) => name !== "destinations").flatMap(
    (name) => GROUPS[name].keyPrefixes || []
  );

  return fs
    .readdirSync(OUT_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${entry.name}/`)
    .filter(
      (prefix) =>
        prefix !== "_next/" &&
        !publicNames.has(prefix.slice(0, -1)) &&
        !coreNames.has(prefix.slice(0, -1)) &&
        !otherGroupPrefixes.includes(prefix)
    )
    .sort();
};

const destinationPrefixes = () => {
  const fromBuild = prefixesFromBuild();
  if (fromBuild.length) return fromBuild;

  const fromExport = prefixesFromExport();
  if (fromExport.length) {
    console.warn(
      "[manifest] .next/prerender-manifest.json is missing (a running `next dev` " +
        `clears .next) — continents derived from out/: ${fromExport.join(" ")}`
    );
  }

  return fromExport;
};

/**
 * Which group a key belongs to: an exact claim first, then the longest matching
 * prefix. Longest wins because the namespaces genuinely nest — asia/ is
 * destinations', asia/thailand/index.html is themes', and the 36 keys below
 * asia/thailand/ are destinations' again. Everything unclaimed — public assets,
 * 404/, chat/, the hand-written pages — is core's, which is why core has to be
 * in every build.
 */
const attribute = (key, prefixes, exactKeys) => {
  const claimed = exactKeys.get(key);
  if (claimed) return claimed;

  let owner = "core";
  let matched = -1;

  for (const name of ALL) {
    if (name === "core") continue;
    for (const prefix of prefixes[name] || []) {
      if (key.startsWith(prefix) && prefix.length > matched) {
        owner = name;
        matched = prefix.length;
      }
    }
  }

  return owner;
};

const build = (csv) => {
  if (!fs.existsSync(OUT_DIR)) throw new Error("out/ not found — run the build first");

  const selected = resolve(csv);
  const prefixes = {};
  const exactKeys = new Map();

  for (const name of ALL) {
    prefixes[name] = GROUPS[name].dynamicPrefixes
      ? destinationPrefixes()
      : [...GROUPS[name].keyPrefixes];
    for (const key of GROUPS[name].keys || []) exactKeys.set(key, name);

    // A discovered-prefix group with nothing to match on cannot be attributed,
    // and the failure is silent and destructive: its pages fall through to core
    // and the next core-only deploy reads them as deleted. Refuse instead.
    if (GROUPS[name].dynamicPrefixes && selected.includes(name) && !prefixes[name].length) {
      throw new Error(
        `[manifest] cannot determine ${name} prefixes — .next/prerender-manifest.json ` +
          "and out/sitemap-destinations-countries.xml are both missing or empty. Rebuild " +
          "(a running `next dev` clears .next) before writing a manifest."
      );
    }
  }

  // Mirrors what s3-deploy.sh actually uploads. A manifest that claimed keys
  // no deploy ever put there would be a record of a bucket that does not
  // exist, and the prune reads it as the list of files worth keeping.
  const keys = walk(OUT_DIR).filter(
    (key) => path.basename(key) !== ".DS_Store" && !key.endsWith(".map")
  );
  const assets = keys.filter((key) => key.startsWith("_next/"));
  const pages = keys.filter((key) => !key.startsWith("_next/"));

  const manifests = {};
  for (const name of selected) {
    // Every group in this build shares its assets: they were emitted by one
    // webpack run and one buildId, and any of these pages can reference any of
    // them. Recording them per group is what lets the global prune keep the
    // chunks of a group that was last deployed months ago.
    manifests[name] = { pages: [], assets, prefixes: prefixes[name], at: new Date().toISOString() };
  }

  const orphans = [];
  for (const key of pages) {
    const owner = attribute(key, prefixes, exactKeys);
    if (manifests[owner]) manifests[owner].pages.push(key);
    else orphans.push(key);
  }

  // A key attributed to a group that was not built means its pages were in the
  // tree when they should not have been, and recording it under core would make
  // the next core-only deploy delete it.
  if (orphans.length) {
    throw new Error(
      `[manifest] ${orphans.length} exported file(s) belong to groups that were not ` +
        `selected (e.g. ${orphans.slice(0, 3).join(", ")}) — was pages/ left dirty by an ` +
        "interrupted build? run `node scripts/pageGroups.js restore`"
    );
  }

  // A selected group that produced nothing means its routes were not in the
  // tree, or attribution missed them. Either way the manifest would record an
  // empty group, and the next deploy would read its whole live page set as
  // removed.
  const empty = selected.filter((name) => !manifests[name].pages.length);
  if (empty.length) {
    throw new Error(
      `[manifest] selected group(s) produced no pages: ${empty.join(", ")} — refusing to ` +
        "write a manifest that would read as a wholesale deletion"
    );
  }

  fs.mkdirSync(WORK_DIR, { recursive: true });
  fs.writeFileSync(
    WORK_FILE,
    JSON.stringify({ groups: selected, assets: assets.length, manifests }, null, 0),
    "utf8"
  );

  console.log(`[manifest] ${keys.length} files: ${assets.length} under _next/, ${pages.length} pages`);
  for (const name of selected) {
    console.log(`[manifest]   ${name.padEnd(14)} ${manifests[name].pages.length} pages`);
  }

  return manifests;
};

/* ------------------------------------------------------------------ prune */

const manifestKey = (group) => `${MANIFEST_PREFIX}/${group}.json`;

const readRemoteManifest = (bucket, group) => {
  const tmp = path.join(os.tmpdir(), `ttw-manifest-${group}-${process.pid}.json`);
  const out = aws(["s3", "cp", `s3://${bucket}/${manifestKey(group)}`, tmp, "--only-show-errors"], {
    allowFail: true,
  });
  if (out === null || !fs.existsSync(tmp)) return null;

  try {
    return JSON.parse(fs.readFileSync(tmp, "utf8"));
  } catch (err) {
    console.warn(`[prune] ${group}: manifest unreadable (${err.message}) — skipping its diff`);
    return null;
  } finally {
    fs.rmSync(tmp, { force: true });
  }
};

/** Key + LastModified for everything under a prefix. */
const listBucket = (bucket, prefix) => {
  const text = aws([
    "s3api",
    "list-objects-v2",
    "--bucket",
    bucket,
    "--prefix",
    prefix,
    "--query",
    "Contents[].[Key,LastModified]",
    "--output",
    "text",
  ]);

  const rows = [];
  for (const line of String(text || "").split("\n")) {
    if (!line.trim() || line.trim() === "None") continue;
    const tab = line.lastIndexOf("\t");
    if (tab === -1) continue;
    rows.push({ key: line.slice(0, tab), modified: Date.parse(line.slice(tab + 1)) });
  }
  return rows;
};

const deleteKeys = (bucket, keys, { dryRun, label }) => {
  if (!keys.length) {
    console.log(`[prune] ${label}: nothing to delete`);
    return 0;
  }

  if (dryRun) {
    const file = path.join(WORK_DIR, `would-delete-${label.replace(/\W+/g, "-")}.txt`);
    fs.mkdirSync(WORK_DIR, { recursive: true });
    fs.writeFileSync(file, keys.join("\n"), "utf8");
    console.log(`[prune] ${label}: would delete ${keys.length} key(s) — listed in ${file}`);
    return 0;
  }

  let deleted = 0;
  for (let i = 0; i < keys.length; i += DELETE_BATCH) {
    const batch = keys.slice(i, i + DELETE_BATCH);
    const tmp = path.join(os.tmpdir(), `ttw-delete-${process.pid}-${i}.json`);
    fs.writeFileSync(
      tmp,
      JSON.stringify({ Objects: batch.map((Key) => ({ Key })), Quiet: true }),
      "utf8"
    );

    try {
      const res = aws([
        "s3api",
        "delete-objects",
        "--bucket",
        bucket,
        "--delete",
        `file://${tmp}`,
        "--output",
        "json",
      ]);
      const errors = (JSON.parse(res || "{}").Errors || []).length;
      if (errors) console.warn(`[prune] ${label}: ${errors} key(s) in this batch failed`);
      deleted += batch.length - errors;
    } finally {
      fs.rmSync(tmp, { force: true });
    }

    console.log(`[prune] ${label}: ${Math.min(i + DELETE_BATCH, keys.length)}/${keys.length}`);
  }

  return deleted;
};

const prune = (bucket, { reconcile, graceDays, dryRun, skipAssets }) => {
  if (!fs.existsSync(WORK_FILE)) {
    throw new Error(`${WORK_FILE} not found — run \`s3Manifest.js build\` in the build step`);
  }

  const { groups: selected, manifests } = JSON.parse(fs.readFileSync(WORK_FILE, "utf8"));
  const live = {};
  let totalDeleted = 0;

  // 1. Per-group page diff: what the last deploy of this group published and
  //    this one did not. Nothing else in the bucket is a candidate, so an
  //    unrelated prefix can never be caught by it.
  for (const name of selected) {
    const previous = readRemoteManifest(bucket, name);
    const current = new Set(manifests[name].pages);

    if (!previous) {
      console.log(`[prune] ${name}: no previous manifest — baseline only, deleting nothing`);
    } else {
      const stale = (previous.pages || []).filter((key) => !current.has(key));
      totalDeleted += deleteKeys(bucket, stale, { dryRun, label: `${name} pages` });
    }

    // 2. Optional sweep of a namespace the group owns outright. This is how the
    //    658 legacy /trips/<group_type>/ pages go, since no manifest ever
    //    recorded them.
    const owned = GROUPS[name].ownedPrefixes || [];
    if (reconcile && owned.length) {
      for (const prefix of owned) {
        console.log(`[prune] ${name}: listing s3://${bucket}/${prefix} ...`);
        const extra = listBucket(bucket, prefix)
          .map((row) => row.key)
          .filter((key) => !current.has(key));
        totalDeleted += deleteKeys(bucket, extra, { dryRun, label: `${name} reconcile ${prefix}` });
      }
    }
  }

  // 3. Global _next/ prune. Only safe once every group's asset set is known:
  //    a missing manifest means some live pages' chunks are unaccounted for,
  //    and deleting those would leave HTML that cannot hydrate.
  for (const name of ALL) {
    const manifest = selected.includes(name) ? manifests[name] : readRemoteManifest(bucket, name);
    if (manifest) live[name] = manifest;
  }

  const missing = ALL.filter((name) => !live[name]);
  if (skipAssets) {
    console.log("[prune] _next/: skipped (--no-asset-prune)");
  } else if (missing.length) {
    console.log(
      `[prune] _next/: skipped — no manifest yet for ${missing.join(", ")}. Deploy those ` +
        "groups once (or run with --groups=all) and the next prune will clear the backlog."
    );
  } else {
    const keep = new Set();
    for (const manifest of Object.values(live)) for (const key of manifest.assets || []) keep.add(key);

    // A grace window keeps a concurrent deploy's freshly-uploaded assets out of
    // the delete list, whatever order the two finish in.
    const cutoff = Date.now() - graceDays * 24 * 60 * 60 * 1000;

    // S3 lists 1,000 keys per request and the CLI buffers the lot, so this is
    // several silent minutes on a bucket that has never been pruned (493k keys
    // ≈ 493 round trips). Say so rather than looking hung. Once the backlog is
    // cleared it drops to a few seconds.
    console.log("[prune] _next/: listing objects, this can take several minutes...");
    const objects = listBucket(bucket, "_next/");
    const stale = objects
      .filter((row) => !keep.has(row.key) && row.modified < cutoff)
      .map((row) => row.key);

    console.log(
      `[prune] _next/: ${objects.length} objects, ${keep.size} referenced, ${stale.length} stale ` +
        `(older than ${graceDays}d)`
    );
    totalDeleted += deleteKeys(bucket, stale, { dryRun, label: "_next" });
  }

  // 4. Manifests are written last: if a prune dies halfway, the previous
  //    manifest still describes what is up there and the next run redoes the
  //    same diff instead of forgetting the leftovers.
  if (!dryRun) {
    for (const name of selected) {
      const tmp = path.join(os.tmpdir(), `ttw-put-${name}-${process.pid}.json`);
      fs.writeFileSync(tmp, JSON.stringify(manifests[name]), "utf8");
      try {
        aws([
          "s3",
          "cp",
          tmp,
          `s3://${bucket}/${manifestKey(name)}`,
          "--cache-control",
          "no-store",
          "--only-show-errors",
        ]);
      } finally {
        fs.rmSync(tmp, { force: true });
      }
    }
    console.log(`[prune] manifests updated for: ${selected.join(", ")}`);
  }

  console.log(`[prune] done — ${totalDeleted} object(s) deleted`);
};

/* ------------------------------------------------------------------- cli */

if (require.main === module) {
  const [command, ...rest] = process.argv.slice(2);
  const flag = (name, fallback) => {
    const hit = rest.find((arg) => arg.startsWith(`--${name}=`));
    return hit ? hit.split("=").slice(1).join("=") : fallback;
  };

  try {
    if (command === "build") {
      build(flag("groups", ""));
    } else if (command === "prune") {
      const bucket = flag("bucket", "");
      if (!bucket) throw new Error("usage: s3Manifest.js prune --bucket=<name> [options]");
      prune(bucket, {
        reconcile: rest.includes("--reconcile"),
        dryRun: rest.includes("--dry-run"),
        skipAssets: rest.includes("--no-asset-prune"),
        graceDays: Number(flag("grace-days", 2)),
      });
    } else {
      console.error(
        "usage: s3Manifest.js build --groups=<csv>\n" +
          "       s3Manifest.js prune --bucket=<name> [--reconcile] [--grace-days=N] [--dry-run]"
      );
      process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { build, prune };
