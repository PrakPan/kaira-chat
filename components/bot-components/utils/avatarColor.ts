// ─── Letter-avatar color (Google-Workspace style) ──────────────────────────
// When a logged-in user has no profile picture we show the first letter of
// their name on a solid colored disc. The color is chosen once and persisted
// in localStorage so it never changes for that user on this device.

// Solid background palette. Each color reads well with white, bold initials at
// small sizes and sits nicely against the app's navy / cream / yellow UI.
export const AVATAR_COLORS = [
  "#2563EB", // blue
  "#7C3AED", // violet
  "#DB2777", // pink
  "#0B8043", // green
  "#C2410C", // burnt orange
];

const AVATAR_COLOR_KEY = "user_avatar_color";

// Deterministic string hash → palette index, so the same name maps to the same
// color even before anything is persisted.
const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * Returns a stable background color for the user's letter avatar.
 * Reads from localStorage first so the color can't change once assigned; on the
 * first call it derives the color from the user's name (random when no name is
 * available) and persists it.
 */
export const getUserAvatarColor = (name?: string | null): string => {
  if (typeof window === "undefined") return AVATAR_COLORS[0];

  try {
    const stored = localStorage.getItem(AVATAR_COLOR_KEY);
    if (stored && AVATAR_COLORS.includes(stored)) return stored;
  } catch {
    // localStorage unavailable — fall through to a fresh pick
  }

  const idx =
    name && name.trim()
      ? hashString(name.trim()) % AVATAR_COLORS.length
      : Math.floor(Math.random() * AVATAR_COLORS.length);
  const color = AVATAR_COLORS[idx];

  try {
    localStorage.setItem(AVATAR_COLOR_KEY, color);
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
  return color;
};

/**
 * Deterministic palette color for an arbitrary person's name, with NO
 * persistence. Use for people other than the logged-in user (e.g. the customer
 * of an itinerary someone is viewing) so we never overwrite the logged-in
 * user's own stored color. The same name always maps to the same color.
 */
export const getAvatarColorForName = (name?: string | null): string => {
  if (!name || !name.trim()) return AVATAR_COLORS[0];
  return AVATAR_COLORS[hashString(name.trim()) % AVATAR_COLORS.length];
};

/** First alphabetic character of the user's name, uppercased. Falls back to "U". */
export const getUserInitial = (name?: string | null): string => {
  if (!name || !name.trim()) return "U";
  const trimmed = name.trim();
  const match = trimmed.match(/[a-zA-Z]/);
  return (match ? match[0] : trimmed[0]).toUpperCase();
};

/** Clears the persisted avatar color (call on logout so a new user gets a fresh one). */
export const clearUserAvatarColor = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AVATAR_COLOR_KEY);
  } catch {
    // ignore
  }
};
