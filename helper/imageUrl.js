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
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  return `${MEDIA_HOST}${trimmed.replace(/^\/+/, "")}`;
};

export default resolveImageUrl;
