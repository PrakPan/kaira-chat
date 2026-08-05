// lib/mediaImage.js
//
// Single source of truth for turning our own S3-backed media into resized,
// edge-compressed variants via the AWS Serverless Image Handler (SIH).
//
// Our media is stored in the `thetarzanway-web` bucket and is currently served
// RAW (full-resolution originals) through two hosts:
//   • https://d31aoa0ehgvjdi.cloudfront.net/media/...   (also fronts the SIH)
//   • https://images.thetarzanway.com/media/...         (raw origin, no resize)
// Serving originals is what blew up CloudFront egress (e.g. a 3.6 MB PNG shown
// in a ~400px card). This helper rewrites those URLs to an SIH request that
// resizes to the display width and re-encodes — visually identical, ~30-100×
// smaller. Anything that is NOT our media (booking.com, Google, local /public
// assets, data: URIs, or an already-built SIH request) is returned untouched,
// so there is no visible change anywhere.

const SIH_HOST = "https://d31aoa0ehgvjdi.cloudfront.net";
const SIH_BUCKET = "thetarzanway-web";

// Hosts whose objects live in our media bucket and can be resized by the SIH.
const OWN_MEDIA_HOSTS = new Set([
  "d31aoa0ehgvjdi.cloudfront.net",
  "images.thetarzanway.com",
]);

// Key prefixes that exist in the media bucket.
const KEY_PREFIXES = ["media/", "crm/"];

function base64(str) {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(str);
  }
  return Buffer.from(str, "utf-8").toString("base64");
}

function hasMediaPrefix(path) {
  return KEY_PREFIXES.some((p) => path.startsWith(p));
}

// Returns the S3 key ("media/...") for a src we own, or null if the src is not
// ours to resize (external host, local asset, data URI, or an SIH request).
function extractKey(src) {
  if (/^https?:\/\//i.test(src)) {
    let u;
    try {
      u = new URL(src);
    } catch (e) {
      return null;
    }
    if (!OWN_MEDIA_HOSTS.has(u.hostname)) return null; // external CDN
    const rawPath = u.pathname.replace(/^\/+/, "");
    // decodeURIComponent throws on a malformed % sequence in a filename — fall
    // back to the raw path so a bad URL never breaks rendering/export.
    let path;
    try {
      path = decodeURIComponent(rawPath);
    } catch (e) {
      path = rawPath;
    }
    // A path that isn't under media/ or crm/ is already an SIH base64 request
    // (or something else we shouldn't touch) — leave it alone.
    if (!hasMediaPrefix(path)) return null;
    return path;
  }
  // data:/blob:/local public assets ("/KairaInsta.jpg") — not ours to resize.
  if (src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/")) {
    return null;
  }
  // Bare key, e.g. "media/cities/xxx.jpg".
  if (hasMediaPrefix(src)) return src;
  return null;
}

// Build an SIH URL for `src`, resized (never enlarged) to `width` px and
// re-encoded at `quality`. Non-media srcs are returned unchanged.
function optimizedMediaUrl(src, opts = {}) {
  if (!src || typeof src !== "string") return src;
  // Whole body guarded: an optimization must NEVER throw and break render/export.
  try {
    const key = extractKey(src);
    // Never route vector/animated formats through the raster resizer — SIH would
    // rasterize an SVG or drop a GIF's animation (a visible change).
    if (!key || /\.(svg|gif)$/i.test(key)) return src;

    const width = Math.round(Number(opts.width) || 0);
    const quality = Math.min(100, Math.max(1, Math.round(Number(opts.quality) || 80)));

    const resize = { fit: "inside", withoutEnlargement: true };
    if (width > 0) resize.width = width;

    // SIH applies whichever encoder matches the negotiated output format; the
    // browser's Accept header lets it serve WebP/AVIF automatically.
    const edits = {
      resize,
      jpeg: { quality, progressive: true },
      webp: { quality },
    };
    // Optional gaussian blur (sharp sigma) for tiny LQIP placeholders.
    const blur = Number(opts.blur) || 0;
    if (blur > 0) edits.blur = Math.min(1000, Math.max(0.3, blur));

    const request = JSON.stringify({ bucket: SIH_BUCKET, key, edits });
    return `${SIH_HOST}/${base64(request)}`;
  } catch (e) {
    return src; // never break rendering over an optimization
  }
}

module.exports = { optimizedMediaUrl };
