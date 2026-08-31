import { MERCURY_HOST } from "../constants";

// ─────────────────────────────────────────────────────────────────────────────
//  Itinerary PDF export.
//
//  The endpoint is bearer-protected, so this can never be a plain window.open
//  or an <a href> — an unauthenticated GET comes back 401 and the browser shows
//  the error page instead of a file. The PDF is fetched with the token and
//  handed to the browser as a blob.
//
//  `AuthError` is raised (rather than swallowed) so callers can tell "you need
//  to sign in" apart from "the export failed": the first wants a login prompt,
//  the second wants an error message, and collapsing them shows the wrong one.
// ─────────────────────────────────────────────────────────────────────────────

export class PdfAuthError extends Error {
  constructor() {
    super("Not authorised to export this itinerary");
    this.name = "PdfAuthError";
  }
}

export const itineraryPdfUrl = (itineraryId) => {
  const host = (MERCURY_HOST || "").replace(/\/$/, "");
  if (!itineraryId || !host) return null;
  return `${host}/api/v1/itinerary/${itineraryId}/export-pdf/`;
};

/** Fetches the export as a Blob. Throws PdfAuthError on 401/403. */
export const fetchItineraryPdf = async (itineraryId, token) => {
  const url = itineraryPdfUrl(itineraryId);
  if (!url || !token) throw new PdfAuthError();

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401 || res.status === 403) throw new PdfAuthError();
  if (!res.ok) throw new Error(`PDF export failed: ${res.status}`);
  return res.blob();
};

/**
 * Fetches the export and saves it. Returns nothing; throws as above.
 *
 * The object URL is revoked on a timer rather than immediately after click():
  * the browser has only been *handed* the URL at that point and has not
 * necessarily finished reading it, and revoking too early produces an empty
 * download on Safari.
 */
export const downloadItineraryPdf = async (
  itineraryId,
  token,
  filename = "itinerary",
) => {
  const blob = await fetchItineraryPdf(itineraryId, token);
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${filename || "itinerary"}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
};
