// components/theme/cinematic/selectionText.ts
//
// Renders a theme page's saved selection as a line of plain English.
//
// On this branch the picks ALSO travel structurally — the first /chatkit body
// carries them as `items`/`intake.items` (see buildFirstMessageBody in
// hooks/useChat.ts), so this module is not their only route to the backend. It
// exists so the themed mini-form's message still READS complete on its own:
// the summary a human sees names the picks rather than referring to a payload
// they can't see. Used by the mini-form's submission only — the plain card
// seed (useSeedChat) hands its items over structurally and leaves the seed
// text alone.

export interface SelectedItemLike {
  kind?: string;
  label?: string;
  short?: string;
  id?: string;
}

/** `{ kind: "activity", label: "YONA floating beach club" }` → `"YONA floating
 *  beach club (activity)"`. Falls back to whichever name is present, and drops
 *  the qualifier when there's no kind to state. */
const nameOf = (item: SelectedItemLike): string => {
  const name = (item.label || item.short || "").trim();
  if (!name) return "";
  const kind = (item.kind || "").trim().toLowerCase();
  return kind ? `${name} (${kind})` : name;
};

/**
 * A sentence naming everything the reader saved, ready to append to the message
 * being sent to Kaira. Returns "" for an empty selection so callers can
 * concatenate it unconditionally.
 *
 * `lead` overrides the opening clause for callers that need it to read
 * differently in context (the mini-form already says "here are my details").
 */
export function composeSelectionText(
  items: SelectedItemLike[] = [],
  lead?: string,
): string {
  const named = items.map(nameOf).filter(Boolean);
  if (named.length === 0) return "";
  const plural = named.length === 1 ? "pick" : "picks";
  const them = named.length === 1 ? "it" : "them";
  const opening =
    lead ?? `I saved ${named.length} ${plural} on the page — build the trip around ${them}:`;
  return `${opening} ${named.join(", ")}.`;
}

export default composeSelectionText;
