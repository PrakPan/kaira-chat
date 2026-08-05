import React from "react";

/**
 * Cancellation / fare policy block. The copy arrives from the supplier as raw
 * HTML (loose <p>/<ul> soup that varies per provider), so it is set on a sand
 * card behind the `ttw-policy-html` class — globals.css normalises its list and
 * paragraph spacing there rather than leaving each drawer to guess.
 *
 * `html` may be an empty string or a bag of empty tags on some suppliers; the
 * card is skipped when there is nothing readable in it.
 */
const hasContent = (html) =>
  typeof html === "string" && html.replace(/<[^>]*>/g, "").trim().length > 0;

export default function PolicyNote({
  html,
  title = "Cancellation policy",
  className = "mb-4",
}) {
  if (!hasContent(html)) return null;

  return (
    <section className={className}>
      <div className="ttw-detail-card rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-full bg-[#f4f3ec] flex items-center justify-center flex-shrink-0 text-[#0b1220]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </span>
          <div className="ttw-type-body font-600 text-[#0b1220]">{title}</div>
        </div>

        <div
          className="ttw-policy-html ttw-type-small text-[#445069]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
