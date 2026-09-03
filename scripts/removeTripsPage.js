// Takes pages/trips out of the tree for the duration of a build, and puts it
// back afterwards. Driven by s3-deploy.sh: only `./s3-deploy.sh <env> -trips`
// rebuilds the trips pages, because they are 1,718 prerendered leaves plus 146
// hubs and generating them on every release would dominate build time.
//
// It moves the whole directory rather than the single leaf file it used to
// move. The trips route is now three pages (root, destination hub, leaf) and a
// file-by-file list would silently go stale the next time one is added — with
// the failure mode being a normal deploy that quietly spends ten minutes
// building trips pages it was meant to skip.
//
// The backup lives outside pages/ on purpose: anything left inside, whatever it
// is named, is still scanned for routes, and a directory of .js files parked
// under pages/ would be published as real URLs.

const fs = require("fs");
const path = require("path");

const TRIPS_DIR = path.join(process.cwd(), "pages", "trips");
const BACKUP_DIR = path.join(process.cwd(), ".trips-pages-backup");

const move = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.log(`[trips-pages] nothing to move at ${path.relative(process.cwd(), src)}`);
    return;
  }

  if (fs.existsSync(dest)) {
    throw new Error(
      `[trips-pages] ${path.relative(process.cwd(), dest)} already exists — ` +
        "a previous build was interrupted; reconcile the two by hand before rebuilding"
    );
  }

  fs.renameSync(src, dest);
  console.log(
    `[trips-pages] ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dest)}`
  );
};

const [command] = process.argv.slice(2);

try {
  if (command === "prebuild") {
    move(TRIPS_DIR, BACKUP_DIR);
  } else if (command === "postbuild") {
    move(BACKUP_DIR, TRIPS_DIR);
  } else {
    console.error("Usage: node scripts/removeTripsPage.js <prebuild|postbuild>");
    process.exit(1);
  }
} catch (err) {
  // Exiting non-zero matters here: s3-deploy.sh runs this with `|| exit`, and a
  // silent failure at `prebuild` would build all 1,718 trips pages unasked,
  // while one at `postbuild` would leave the working tree without its pages.
  console.error(err.message);
  process.exit(1);
}
