/**
 * Small in-memory + sessionStorage buffer used to hand off context from
 * the homepage hero (a static page) to the BotApp chat (different route).
 *
 * `files` cannot be serialised, so they're kept in module memory. Module
 * scope survives client-side route navigations within the same tab,
 * which is the only case we care about for the hero handoff.
 *
 * Everything else (seed prompt, attachment names) is mirrored into
 * sessionStorage so a hard reload of /chat after the handoff doesn't
 * lose the seed text, even though the files would.
 */

const SEED_KEY = "ttw_hero_seed";
const META_KEY = "ttw_hero_attachments_meta";
// Structured context that rides alongside the seed prompt when a theme page
// hands off to /chat — the items the user selected on the page and a slug that
// identifies the theme. Serialisable, so (unlike files) it lives entirely in
// sessionStorage and survives a hard reload of /chat. Read-once, like the seed.
const SEED_META_KEY = "ttw_hero_seed_meta";

let pendingFiles = [];

const safeSession = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const setPendingFiles = (files) => {
  pendingFiles = Array.isArray(files) ? files.filter(Boolean) : [];
  const ss = safeSession();
  if (!ss) return;
  if (pendingFiles.length === 0) {
    ss.removeItem(META_KEY);
    return;
  }
  const meta = pendingFiles.map((f) => ({
    name: f.name,
    size: f.size,
    type: f.type,
  }));
  try {
    ss.setItem(META_KEY, JSON.stringify(meta));
  } catch {
    /* noop */
  }
};

export const takePendingFiles = () => {
  const out = pendingFiles;
  pendingFiles = [];
  const ss = safeSession();
  if (ss) ss.removeItem(META_KEY);
  return out;
};

export const peekPendingFileMeta = () => {
  const ss = safeSession();
  if (!ss) return [];
  try {
    return JSON.parse(ss.getItem(META_KEY) || "[]");
  } catch {
    return [];
  }
};

export const setPendingSeed = (seed) => {
  const ss = safeSession();
  if (!ss) return;
  if (seed) ss.setItem(SEED_KEY, seed);
  else ss.removeItem(SEED_KEY);
};

export const takePendingSeed = () => {
  const ss = safeSession();
  if (!ss) return null;
  const val = ss.getItem(SEED_KEY);
  if (val) ss.removeItem(SEED_KEY);
  return val || null;
};

/**
 * Stash structured theme context (`{ items, slug }`) to hand off to /chat
 * alongside the seed prompt. `items` is the list the user selected on the
 * theme page; `slug` identifies the theme (e.g. "hokkaido-powder"). Passing a
 * falsy/empty value clears any previously-stored context so a later plain seed
 * doesn't inherit a stale selection.
 */
export const setPendingSeedMeta = (meta) => {
  const ss = safeSession();
  if (!ss) return;
  const items = Array.isArray(meta?.items) ? meta.items.filter(Boolean) : [];
  const slug = meta?.slug || "";
  if (!slug && items.length === 0) {
    ss.removeItem(SEED_META_KEY);
    return;
  }
  try {
    ss.setItem(SEED_META_KEY, JSON.stringify({ items, slug }));
  } catch {
    /* noop */
  }
};

/** Read-once counterpart to setPendingSeedMeta. Returns `null` when nothing
 *  was stashed, else `{ items, slug }`. */
export const takePendingSeedMeta = () => {
  const ss = safeSession();
  if (!ss) return null;
  const raw = ss.getItem(SEED_META_KEY);
  if (!raw) return null;
  ss.removeItem(SEED_META_KEY);
  try {
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
      slug: typeof parsed?.slug === "string" ? parsed.slug : "",
    };
  } catch {
    return null;
  }
};
