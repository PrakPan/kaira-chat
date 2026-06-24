import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { requestOfflineQuote } from "../../services/bookings/OfflineQuote";
import { openNotification } from "../../store/actions/notification";

const isDateInPast = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
};

/**
 * CTA shown below search-error states across hotel/flight/taxi drawers.
 *
 * - If the trip date is in the past → shows "Update Dates" which closes the
 *   parent drawer (via onEditDates) and dispatches an `open-itinerary-settings`
 *   window event so the top-level container can open the itinerary Settings.
 * - Otherwise → shows "Request Offline Quote" which POSTs to
 *   /api/v1/itinerary/{itinerary_id}/get-offline-quote/?type={type}.
 *
 * Once a quote request is submitted successfully the button is disabled to
 * prevent duplicate submissions in the same session.
 */
const OfflineQuoteCTA = ({
  itinerary_id,
  type,
  payload,
  startDate,
  onEditDates,
  token,
  className,
  fullWidth = false,
  // Optional controlled "submitted" state. When the same CTA position is
  // reused across tabs (e.g. the taxi drawer's multicity/sightseeing/airport
  // tabs), the parent tracks submission per tab and passes it in so a quote
  // requested on one tab does NOT leak as "Quote Requested" onto another tab.
  submitted: submittedProp,
  onSubmitted,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submittedInternal, setSubmittedInternal] = useState(false);
  // Controlled when the parent passes `submitted`; otherwise self-managed.
  const submitted =
    submittedProp !== undefined ? submittedProp : submittedInternal;
  const pastDate = isDateInPast(startDate);

  const handleClick = async () => {
    if (pastDate) {
      if (typeof onEditDates === "function") onEditDates();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("open-itinerary-settings"));
      }
      return;
    }
    if (submitted || loading) return;
    if (!itinerary_id) {
      dispatch(
        openNotification({
          type: "error",
          text: "Missing itinerary reference. Please refresh and try again.",
          heading: "Error!",
        })
      );
      return;
    }
    setLoading(true);
    try {
      await requestOfflineQuote({ itinerary_id, type, payload, token });
      setSubmittedInternal(true);
      if (typeof onSubmitted === "function") onSubmitted();
      dispatch(
        openNotification({
          type: "success",
          text: "Our team will reach out shortly with a custom quote.",
          heading: "Offline quote requested",
        })
      );
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.[0]?.message?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        "Could not submit your request. Please try again later.";
      dispatch(
        openNotification({
          type: "error",
          text: typeof msg === "string" ? msg : "Could not submit your request.",
          heading: "Error!",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const label = pastDate
    ? "Update Dates"
    : submitted
    ? "Quote Requested"
    : "Request Offline Quote";

  // Active (yellow) kaira state vs. the muted "Quote Requested" resting state.
  const isResting = submitted && !pastDate;

  const leadingIcon = isResting ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : pastDate ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || isResting}
      className={`${isResting ? "" : "ttw-btn-offline-quote"} ${className || ""}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "11px 22px",
        borderRadius: "9999px",
        fontFamily: "var(--font-family-montserrat, 'Montserrat', sans-serif)",
        fontSize: 14,
        fontWeight: 600,
        cursor: loading || isResting ? "not-allowed" : "pointer",
        transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
        minWidth: 180,
        width: fullWidth ? "100%" : undefined,
        opacity: loading ? 0.85 : 1,
        ...(isResting
          ? {
              border: "1px solid #d8dbe2",
              background: "#eef1f5",
              color: "#445069",
            }
          : {}),
      }}
    >
      {loading ? (
        <PulseLoader size={6} color="#07213A" speedMultiplier={0.6} />
      ) : (
        <>
          {leadingIcon}
          {label}
        </>
      )}
    </button>
  );
};

export default OfflineQuoteCTA;
