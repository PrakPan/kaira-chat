#!/bin/bash
#
# Build and publish the static export.
#
# Usage: ./s3-deploy.sh <dev|prod|yourtrips> [options]
#
#   --groups=a,b     page groups to build (see `node scripts/pageGroups.js list`)
#   --all            build every group
#
# With no --groups flag the selection is taken from the GROUPS environment
# variable, else from the tag name (prod-trips-v4.8.0 -> +trips,
# prod-destinations-v4.8.0 -> +destinations, prod-all-v4.8.0 -> everything),
# else DEFAULT_GROUPS.
#   -trips           legacy alias for --groups=<defaults>,trips
#   --build-only     build and write the manifest, do not touch S3 (CI build step)
#   --deploy-only    upload/invalidate/prune an out/ that already exists (CI deploy step)
#   --reconcile      also sweep group-owned prefixes (clears the legacy /trips/* pages)
#   --no-prune       upload only, leave stale objects alone
#   --dry-run        build + report what would be deleted, change nothing on S3
#
# Two things differ from the version this replaces, both deliberate:
#
# 1. It no longer builds the whole site every time. `output: "export"` renders
#    every route in pages/, and destinations (2,306 pages, each making mercury
#    calls in getStaticProps) plus trips (1,865 pages and a ~3 min crawl) are
#    most of the build. Both change on a slow cadence, so they are opt-in.
#    DEFAULT_GROUPS below is what a plain release ships.
#
# 2. It never passes --delete to `aws s3 sync`. That flag deletes everything in
#    the bucket absent from the local out/ — for a partial build that is most of
#    the site — and it interleaves deletes with uploads in key order, so the
#    origin loses assets while the CDN is still serving pages that need them.
#    Stale objects are removed afterwards, from a record of what each group
#    published: scripts/s3Manifest.js.
#
# Order matters and is: upload -> invalidate -> WAIT -> delete. Nothing
# disappears from the origin until every edge is already serving the new build.

set -x
set -e
trap "exit" INT

# Groups a release ships when none are named. destinations and trips are the
# expensive ones and must be asked for.
DEFAULT_GROUPS="core,themes,events"

deploy_env=""
groups=""
trips=false
build_only=false
deploy_only=false
reconcile=false
prune=true
dry_run=false

positional_args=()

print_usage() {
  echo "Usage: $0 <deploy_env> [options]"
  echo "deploy_env > dev, prod, yourtrips"
  echo "options    > --groups=a,b | --all | -trips | --build-only | --deploy-only"
  echo "             --reconcile | --no-prune | --dry-run"
  echo
  echo "page groups:"
  node scripts/pageGroups.js list
}

while [[ $# -gt 0 ]]; do
  case $1 in
    -trips)      trips=true; shift ;;
    --all)       groups="all"; shift ;;
    --groups=*)  groups="${1#--groups=}"; shift ;;
    --build-only)  build_only=true; shift ;;
    --deploy-only) deploy_only=true; shift ;;
    --reconcile) reconcile=true; shift ;;
    --no-prune)  prune=false; shift ;;
    --dry-run)   dry_run=true; shift ;;
    -h|--help)   print_usage; exit 0 ;;
    *)           positional_args+=("$1"); shift ;;
  esac
done

if [[ ${#positional_args[@]} -gt 0 ]]; then
  deploy_env=${positional_args[0]}
fi

if [ -z "$deploy_env" ]; then
    echo "Please provide deployment environment"
    print_usage
    exit 1
elif [ "$deploy_env" != "dev" ] && [ "$deploy_env" != "prod" ] && [ "$deploy_env" != "yourtrips" ]; then
    echo "Invalid deployment environment"
    print_usage
    exit 1
fi

# ---- where the group selection comes from ---------------------------------
#
# Precedence: an explicit --groups/--all flag, then a GROUPS environment
# variable (the deploy-prod / deploy-dev custom pipelines set it), then the tag
# name, then DEFAULT_GROUPS.
#
# The tag is in there because a Bitbucket tag push carries no pipeline
# variables at all — so in a tag-only workflow the tag name is the only place a
# selection can be expressed. `prod-trips-v4.8.0` publishes the trips pages;
# `prod-v4.8.0` stays cheap. Tokens are matched as whole `-<token>-` segments,
# so a `yourtrips-*` tag does not accidentally read as "trips".
groups_from_tag() {
  local tag="$1" picked=""

  case "$tag" in
    *-all-*|*-all) echo "all"; return ;;
  esac

  # Only the opt-in expensive groups are addressable this way. themes and
  # events are in DEFAULT_GROUPS already, so naming them would be a no-op.
  for group in trips destinations; do
    case "$tag" in
      *-$group-*|*-$group) picked="$picked,$group" ;;
    esac
  done

  if [ -n "$picked" ]; then
    echo "${DEFAULT_GROUPS}${picked}"
  fi

  # Explicit, and not `[ -n "$picked" ] && echo ...`: that form leaves the
  # function returning 1 when the tag names no group, and `set -e` turns that
  # into a dead build on every ordinary release tag.
  return 0
}

# `printenv`, not "$GROUPS": GROUPS is a bash builtin holding the current user's
# group IDs, and it is always set. Reading the shell variable therefore picks up
# "0" (root, in CI) on any build that did NOT set a GROUPS pipeline variable,
# and pageGroups.js rejects it with `unknown page group(s): 0` — every tag
# deploy would fail. printenv sees only the real environment.
groups_var="$(printenv GROUPS || true)"
if [ -z "$groups" ] && [ -n "$groups_var" ]; then
  groups="$groups_var"
  echo "Page groups from GROUPS variable: $groups"
fi

if [ -z "$groups" ] && [ -n "$BITBUCKET_TAG" ]; then
  from_tag=$(groups_from_tag "$BITBUCKET_TAG" || true)
  if [ -n "$from_tag" ]; then
    groups="$from_tag"
    echo "Page groups from tag $BITBUCKET_TAG: $groups"
  fi
fi

# `-trips` used to mean "this build includes the trips pages"; keep it working.
if [ -z "$groups" ]; then
  groups="$DEFAULT_GROUPS"
fi
if $trips && [ "$groups" != "all" ]; then
  groups="$groups,trips"
fi

if [ "$deploy_env" == 'dev' ]; then
  s3_bucket="nextjs-dev-2"
  cf_id="E3T22L50EDEN1W"
  env_file=".env.development"
elif [ "$deploy_env" == 'prod' ]; then
  s3_bucket="ttw-nextjs"
  cf_id="EW37HZUU6T8S9"
  env_file=".env.production"
else
  s3_bucket="yourtrips-nextjs"
  cf_id="E28HVCR7LF1VH2"
  env_file=".env.production"
fi

echo S3_Bucket: $s3_bucket
echo CloudFront_Distribution: $cf_id
echo Page_Groups: $groups

# ----------------------------------------------------------------- build

if ! $deploy_only; then
  cp "$env_file" .env.local

  # Written before the build, not after: appended afterwards it only ever
  # reached the *next* build, so every release was tagged with the previous
  # one's number. .env.local is regenerated from $env_file above, so this also
  # stops the committed env file collecting a duplicate line per deploy.
  if [ ! -z "$BUILD_NUMBER" ]; then
    echo "NEXT_PUBLIC_SENTRY_RELEASE=$BUILD_NUMBER" >> .env.local
  fi

  # Whatever happens next — a failed build, a Ctrl-C — pages/ goes back to how
  # it was. Leaving a group parked outside the tree would silently drop those
  # routes from the following build.
  trap 'node scripts/pageGroups.js restore || true' EXIT

  node scripts/pageGroups.js select "$groups"
  npm run build
  node scripts/pageGroups.js restore
  trap - EXIT

  if [ ! -d "out" ]; then
      echo "Build folder not found"
      exit 1
  fi

  # Create index file for every path
  python3 index_path.py

  # dev.thetarzanway.com is a byte-for-byte copy of the site on its own
  # hostname, so left alone it competes with production for the same queries and
  # gets indexed as duplicate content. public/robots.txt is production's, so the
  # dev copy is written here rather than in the tree — the export is the only
  # place the two environments can differ.
  #
  # Deliberately NOT `Disallow: /`. Deindexing is done by the noindex meta tag
  # that _document.js emits from NEXT_PUBLIC_NOINDEX, and a crawler that is
  # forbidden to fetch the page can never read that tag — blocking the crawl
  # would freeze any already-indexed dev URL in place instead of removing it.
  # Once Search Console reports the dev host at zero indexed pages, this can
  # become a full disallow.
  #
  # The Sitemap line goes: it points at production's sitemap, which is an
  # invitation to crawl 1,700+ URLs from the wrong hostname.
  if [ "$deploy_env" == 'dev' ]; then
    printf 'User-agent: *\nDisallow: /dashboard/\nDisallow: /itinerary/\nDisallow: /preview-travel-experience/\nDisallow: /test/\nDisallow: /500/\nDisallow: /404/\n' > out/robots.txt
    echo "Wrote dev out/robots.txt (crawlable, no sitemap — noindex meta does the deindexing)"
  fi

  # Attribute every exported file to the group that owns it. Local only, no AWS
  # credentials needed, so this runs in CI's build step and travels to the
  # deploy step as an artifact.
  node scripts/s3Manifest.js build --groups="$groups"
fi

if $build_only; then
  echo "Build complete (--build-only); nothing was uploaded."
  exit 0
fi

if [ ! -d "out" ]; then
    echo "Build folder not found"
    exit 1
fi

# ---------------------------------------------------------------- upload

if $dry_run; then
  echo "[dry-run] skipping upload and invalidation"
else
  echo Synching Build Folder: $s3_bucket...

  # Content-hashed and buildId-scoped, so it can be cached forever and never
  # needs invalidating.
  #
  # Source maps are excluded: @sentry/nextjs turns them on to upload them, but
  # SENTRY_AUTH_TOKEN is unset so nothing ever collects them — they were just
  # sitting in the bucket, publicly fetchable, reconstructing the original
  # source for anyone who asked. 177 files, 79 MB, 37% of the _next payload and
  # the only uploads that were failing on a long-haul link. They are still
  # written to out/ if you need to read one locally. To publish them again,
  # drop this --exclude (and keep scripts/s3Manifest.js in step).
  aws s3 sync out/ s3://$s3_bucket \
    --exclude "*" --include "_next/*" --exclude "*.map" \
    --cache-control "public,max-age=31536000,immutable" \
    --only-show-errors

  # Everything else — HTML, sitemaps, robots.txt, public assets — is served at
  # a stable URL, so a year-long TTL made every deploy depend on a full
  # invalidation landing before anyone saw the new build. Five minutes at the
  # edge costs a rounding error in origin requests and removes that cliff.
  aws s3 sync out/ s3://$s3_bucket \
    --exclude "_next/*" --exclude "*.DS_Store" \
    --cache-control "public,max-age=300,must-revalidate" \
    --only-show-errors

  # ------------------------------------------------------------ invalidate

  if [ ! -z "$cf_id" ]; then
      echo Invalidating cloudfront cache
      invalidation_id=$(aws cloudfront create-invalidation \
        --distribution-id $cf_id --paths "/*" \
        --query Invalidation.Id --output text)

      # Waiting is the point: the prune below removes objects the old HTML
      # references, and the old HTML is gone from the edges only once this
      # returns.
      aws cloudfront wait invalidation-completed \
        --distribution-id $cf_id --id "$invalidation_id"
  fi
fi

# ----------------------------------------------------------------- prune

if $prune; then
  # `if` rather than `cmd && append`: under `set -e` a false left-hand side is a
  # failing command at the end of the script and would abort the deploy.
  prune_args=(prune "--bucket=$s3_bucket")
  if $reconcile; then prune_args+=(--reconcile); fi
  if $dry_run; then prune_args+=(--dry-run); fi
  node scripts/s3Manifest.js "${prune_args[@]}"
else
  echo "Skipping prune (--no-prune); stale objects left in place."
fi

echo "Deployment completed successfully!"
