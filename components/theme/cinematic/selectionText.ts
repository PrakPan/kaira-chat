// components/theme/cinematic/selectionText.ts
//
// Renders a theme page's saved selection as a line of plain English.
//
// The /chatkit request body carries NO structured `items` field — the request
// format is the same one every other chat surface uses (see
// buildFirstMessageBody in hooks/useChat.ts). So the picks a reader made on a
// theme page travel in the message text and nowhere else: this module is the
// single place that turns them into words, used by both hand-off paths (the
// plain card seed in useSeedChat, and the themed mini-form's submission).

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
