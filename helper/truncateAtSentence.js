export function truncateAtSentence(text, maxWords = 300) {
  if (!text) return text;
  const words = String(text).split(/\s+/);
  if (words.length <= maxWords) return text;
  const truncated = words.slice(0, maxWords).join(" ");
  const lastEnd = Math.max(
    truncated.lastIndexOf("."),
    truncated.lastIndexOf("!"),
    truncated.lastIndexOf("?")
  );
  if (lastEnd > 0) return truncated.slice(0, lastEnd + 1);
  return truncated + "…";
}
