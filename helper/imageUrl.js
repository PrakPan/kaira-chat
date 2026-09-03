import { optimizedMediaUrl } from "../lib/mediaImage";

/**
 * Our own media bucket is served through CloudFront, and the API returns keys
 * into it rather than URLs — a taxi category arrives as
 * `media/crm/taxis/1785933318618327856063842.jpg` with `image_source: "s3"`.
 * Rendered as-is that resolves against the current page and 404s.
 *
 * Supplier images, by contrast, come back as absolute links to the supplier's
 * own CDN and must be left alone.
 *
 * The host is currently repeated as a literal in ImageLoader,
 * BackgroundImageLoader, SwiperGallery and Map; this is the shared version.
 * Those call sites still carry their own copies — worth folding in, but not
 * something to change from here.
 */
const MEDIA_HOST = "https://d31aoa0ehgvjdi.cloudfront.net/";

export const resolveImageUrl = (path) => {
  if (typeof path !== "string") return null;

  const trimmed = path.trim();
  if (!trimmed) return null;

  // Already absolute (supplier CDN, protocol-relative, or an inline data URI).
  //
  // Upgrade plain http:// to https://. 93% of the archive's hotel photos are
  // http:// URLs on Agoda's CDNs, and a browser blocks those as mixed content
  // on our https pages — they render as broken images. Those hosts all serve
  // https (verified 200), so the upgrade is safe and is the only way the photo
  // loads at all.
  if (/^http:\/\//i.test(trimmed)) {
    return `https://${trimmed.slice("http://".length)}`;
  }
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  return `${MEDIA_HOST}${trimmed.replace(/^\/+/, "")}`;
};

// The image-handler distribution only answers base64 SIH requests — it does not
// serve raw `media/...` paths (they come back 400/404). Same host/bucket as
// lib/mediaImage.
const SIH_HOST = "https://d31aoa0ehgvjdi.cloudfront.net";
const SIH_BUCKET = "thetarzanway-web";

const base64 = (str) =>
  typeof window !== "undefined" && typeof window.btoa === "function"
    ? window.btoa(str)
    : Buffer.from(str, "utf-8").toString("base64");

/**
 * Resolve an image reference — bare key or absolute URL — to something an
 * <img src> can actually load, resized at the edge where possible.
 *
 * Two things this handles that `optimizedMediaUrl` alone does not:
 *
 *  1. Bare keys. The archive stores `media/...` and `crm/...` keys, which
 *     resolve against the current page and 404 if used directly.
 *  2. Vectors. `optimizedMediaUrl` returns its input untouched for .svg/.gif
 *     rather than rasterizing them — sensible for next/image, but the untouched
 *     value is a path this distribution won't serve. Every taxi icon is an SVG,
 *     so that silently broke most transfer rows. Verified the handler serves
 *     SVGs as-is (200, image/svg+xml), so those get a plain SIH request.
 *
 * External hosts (hotel CDNs) pass through unchanged.
 */
export const optimizedImageUrl = (path, opts = {}) => {
  const resolved = resolveImageUrl(path);
  if (!resolved) return "";

  const optimized = optimizedMediaUrl(resolved, { width: 400, ...opts });
  if (optimized !== resolved) return optimized;

  // Unchanged means it declined to optimize. If that left a bare path on our
  // own media host, build the SIH request ourselves.
  //
  // The edits matter: asked for the object with no edits, the handler returns
  // the raw SVG and the browser refuses to render it as an <img> (verified —
  // plain request ERROR, resized request OK 64x64). With a resize the handler
  // rasterizes to a bitmap, which loads. Rasterizing is exactly what
  // optimizedMediaUrl avoids, and right here: these are small fixed-size icons.
  if (!resolved.startsWith(`${SIH_HOST}/`)) return resolved;
  try {
    const key = decodeURIComponent(
      new URL(resolved).pathname.replace(/^\/+/, ""),
    );
    const width = Math.round(Number(opts.width) || 400);
    const request = {
      bucket: SIH_BUCKET,
      key,
      edits: {
        resize: { fit: "inside", withoutEnlargement: true, width },
      },
    };
    return `${SIH_HOST}/${base64(JSON.stringify(request))}`;
  } catch (err) {
    return resolved;
  }
};

export default resolveImageUrl;
