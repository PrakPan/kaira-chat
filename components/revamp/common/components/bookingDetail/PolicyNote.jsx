import React from "react";
import DetailSection from "./DetailSection";

/**
 * Cancellation / fare policy. The copy arrives from the supplier as raw HTML
 * (loose <p>/<ul> soup that varies per provider), set behind the
 * `ttw-policy-html` class — globals.css normalises its list and paragraph
 * spacing there rather than leaving each drawer to guess.
 *
 * A plain section now, not a card: it is the least urgent thing in the drawer
 * and had no business being the most heavily decorated.
 *
 * `html` may be an empty string or a bag of empty tags on some suppliers; the
 * section is skipped when there is nothing readable in it.
 */
const hasContent = (html) =>
  typeof html === "string" && html.replace(/<[^>]*>/g, "").trim().length > 0;

export default function PolicyNote({ html, title = "Cancellation", className = "" }) {
  if (!hasContent(html)) return null;

  return (
    <DetailSection label={title} className={className}>
      <div
        className="ttw-policy-html ttw-type-small text-[#445069] px-4 pb-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </DetailSection>
  );
}
