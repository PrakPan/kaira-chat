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
