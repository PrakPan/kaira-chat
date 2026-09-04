import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import AncillaryShell from "../AncillaryShell";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import { visaDetail, visaBooking } from "../../../services/ancillaries/visaServices";
import { getAncillaryBookingDetail } from "../../../services/ancillaries/ancillaryBookingServices";
import { openNotification } from "../../../store/actions/notification";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { currencySymbols } from "../../../data/currencySymbols";
import { useAnalytics } from "../../../hooks/useAnalytics";
import VisaSearchDrawer from "./VisaSearchDrawer";

export default function VisaDetailDrawer({ show, visa, onHide, onBooked, onAdded, onRemoved, bookingId, drawerZIndex = 1710, showManageActions = false, variant = "drawer" }) {
  const router = useRouter();
  const dispatch = useDispatch();
  // sessionId is how the chat itinerary route carries the same id.
  const itineraryId =
    useSelector((state) => state.ItineraryId) || router.query?.id || router.query?.sessionId;
  const itinerary = useSelector((state) => state.Itinerary);
  const currency = useSelector((state) => state.currency);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);

  const [detail, setDetail] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);

  // Viewing a visa that is already booked (cart row / bookings list) vs. picking
  // a new one out of the search drawer. The booked view reads the stored
  // booking; only the picker needs a fresh quote and its trace_id.
  const isBookingDetail = showManageActions && !!bookingId;

  const symbol = currencySymbols?.[currency?.currency] || "₹";

  const { trackVisaBookingAdd } = useAnalytics();

  useEffect(() => {
    if (!show) return;
    if (isBookingDetail) fetchBookingDetail();
    else if (visa?.id) fetchDetail();
  }, [show, visa?.id, isBookingDetail, bookingId, itineraryId]);

  // Same endpoint the activity booking drawer uses, with "ancillary" as the
  // booking type — the booking carries its visa snapshot in external_data.
  const fetchBookingDetail = async () => {
    if (!itineraryId || !bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAncillaryBookingDetail(itineraryId, bookingId);
      const data = res?.data || null;
      setBookingDetail(data);
      // external_data.visa is the snapshot taken when the visa was booked;
      // booking.visa is the live master row, which is what carries `text`.
      // Either can be missing (an unlinked visa, a snapshot-less booking), so
      // layer them rather than picking one.
      const snapshot = data?.external_data?.visa;
      setDetail(
        snapshot || data?.visa ? { ...(snapshot || {}), ...(data?.visa || {}) } : null,
      );
      setTraceId(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message?.[0] ||
        "Failed to load visa details.",
      );
    }
    setLoading(false);
  };

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await visaDetail.post("/", {
        visa_id: visa.id,
        start_date: itinerary?.start_date || "",
        end_date: itinerary?.end_date || "",
        number_of_adults: itinerary?.number_of_adults || 1,
        number_of_children: itinerary?.number_of_children || 0,
        number_of_infants: itinerary?.number_of_infants || 0,
        currency: currency?.currency || "INR",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      // Detail may return { data: { visa: {...}, trace_id } } or { data: {...}, trace_id }
      const d = res.data?.data;
      setDetail(d?.visa || (typeof d === "object" && !Array.isArray(d) ? d : null));
      setTraceId(res.data?.trace_id || d?.trace_id);
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to load visa details.");
    }
    setLoading(false);
  };

  const loadDetail = () => (isBookingDetail ? fetchBookingDetail() : fetchDetail());

  const displayVisa = detail || visa;

  // One long legal paragraph reads as a wall; break it on its own line breaks
  // when it has them, otherwise on sentence ends, and clamp it behind a toggle.
  const terms = bookingDetail?.terms_and_guidelines?.trim();
  const termsPoints = terms
    ? (terms.includes("\n")
        ? terms.split(/\n+/)
        // Split on ". " before a new sentence; the separator eats the period,
        // so put it back. (No lookbehind — older iOS Safari can't parse it.)
        : terms.split(/\.\s+(?=[A-Z])/).map((point, i, all) =>
            i < all.length - 1 ? `${point}.` : point,
          )
      )
        .map((point) => point.trim())
        .filter(Boolean)
    : [];
  const termsCollapsible = termsPoints.length > 3;
  const visibleTerms = termsCollapsible && !termsExpanded ? termsPoints.slice(0, 3) : termsPoints;

  const handleBook = async () => {
    const tid = traceId || displayVisa?.id;
    if (!tid) return;
    setBooking(true);
    try {
      const payload = { trace_id: tid };
      if (bookingId) payload.booking_id = bookingId;
      const res = await visaBooking.post(`${itineraryId}/bookings/visa/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      const newBooking = res?.data?.ancillary_booking || res?.data?.data || res?.data;
      trackVisaBookingAdd?.(itineraryId, displayVisa?.id || "");
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));
      dispatch(openNotification({
        type: "success",
        heading: "Success!",
        text: `Visa added to your itinerary`,
      }));
      onAdded?.(newBooking, bookingId || null);
      onBooked?.();
    } catch (err) {
      dispatch(openNotification({
        type: "error",
        heading: "Error!",
        text: err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to add visa. Please try again.",
      }));
    }
    setBooking(false);
  };

  const handleRemove = async () => {
    if (!bookingId) return;
    setRemoving(true);
    try {
      await visaBooking.delete(`${itineraryId}/ancillary-booking/${bookingId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));
      dispatch(openNotification({
        type: "success",
        heading: "Removed!",
        text: "Visa removed from your itinerary",
      }));
      onRemoved?.(bookingId);
      onBooked?.();
    } catch (err) {
      dispatch(openNotification({
        type: "error",
        heading: "Error!",
        text: err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to remove visa. Please try again.",
      }));
    }
    setRemoving(false);
  };

  const formatLabel = (val) =>
    val ? val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null;

  // stay_period / validity / processing_time are free text and some rows come
  // in as "0Upto 90 Days" — drop a leading zero that runs straight into a word.
  const formatPeriod = (val) =>
    val ? String(val).replace(/^0(?=[A-Za-z])/, "").trim() : null;

  const formatDate = (val) => {
    if (!val) return null;
    const date = new Date(val);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Booking status reads as a state, not a label — colour it by what it means.
  // Server values: Added, Quoted, Paid, Confirmed, Cancelled, Refunded,
  // Expired, Hold.
  const statusTone = (status) => {
    switch (status) {
      case "Confirmed":
      case "Paid":
        return "bg-[#e7f5ee] text-[#1f7a52] border-[#c7e7d7]";
      case "Cancelled":
      case "Refunded":
      case "Expired":
        return "bg-[#fdeeeb] text-[#b42318] border-[#f5d4cd]";
      case "Hold":
      case "Quoted":
        return "bg-[#fff6df] text-[#8a6100] border-[#f0e0b4]";
      default:
        return "bg-[#eef2fb] text-[#2b4a8b] border-[#d7e0f3]";
    }
  };

  // Booked view only: what the traveller actually holds, not a sales pitch.
  const bookedAdults = bookingDetail?.number_of_adults || 0;
  const bookedChildren = bookingDetail?.number_of_children || 0;
  const bookedInfants = bookingDetail?.number_of_infants || 0;
  const paxLabel = [
    bookedAdults ? `${bookedAdults} adult${bookedAdults > 1 ? "s" : ""}` : null,
    bookedChildren ? `${bookedChildren} child${bookedChildren > 1 ? "ren" : ""}` : null,
    bookedInfants ? `${bookedInfants} infant${bookedInfants > 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const checkIn = formatDate(bookingDetail?.check_in);
  const checkOut = formatDate(bookingDetail?.check_out);

  const visaFacts = [
    { label: "Visa type", value: formatLabel(displayVisa?.category) },
    { label: "Entry", value: formatLabel(displayVisa?.entry_type) },
    { label: "Purpose", value: formatLabel(displayVisa?.purpose) },
    { label: "Processing", value: formatLabel(displayVisa?.processing_type) },
    { label: "Processing time", value: formatPeriod(displayVisa?.processing_time) },
    { label: "Stay period", value: formatPeriod(displayVisa?.stay_period) },
    { label: "Validity", value: formatPeriod(displayVisa?.validity) },
  ].filter((fact) => fact.value);

  // The detail endpoint's payload does NOT always carry `text` — the name is
  // the search row's. Falling through to the `visa` prop keeps the title (and
  // with it the sheet's ✕, which Sheet only draws when there IS a title) from
  // vanishing the moment the quote lands.
  const heading =
    displayVisa?.text || visa?.text || bookingDetail?.name || "Visa details";

  // The CTA is the shell's footer — Sheet's footer slot on the phone, a sticky
  // bar inside the drawer on desktop. Shown for a loaded booking in manage
  // mode; otherwise the quote's traceId, falling back to visa.id.
  const canAct =
    !loading &&
    !error &&
    Boolean(isBookingDetail ? bookingDetail : traceId || displayVisa?.id);

  const cta = canAct ? (
    showManageActions ? (
      <BookingDetailActions
        onDelete={handleRemove}
        deleting={removing}
        deleteLabel="Remove from Itinerary"
        confirmItemLabel="visa"
        onChange={() => setShowSearch(true)}
        changeLabel="Change Visa"
        changeDisabled={removing}
      />
    ) : (
      <button
        className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
        onClick={handleBook}
        disabled={booking}
      >
        {booking ? <PulseLoader size={8} color="#000" /> : "Add Visa to Cart"}
      </button>
    )
  ) : null;

  return (
    <>
    <AncillaryShell
      variant={variant}
      show={show}
      onHide={onHide}
      zIndex={drawerZIndex}
      title={heading}
      footer={cta}
      drawerHeader={
        <BookingDetailHeader title={heading} loading={loading} onBack={onHide} />
      }
    >
          {loading ? (
            <div className="flex flex-col gap-4 mt-2">
              <div className="w-full h-[200px] bg-gray-200 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${70 + i * 5}%` }} />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center mt-16 gap-3">
              <div className="text-[#445069] text-center">{error}</div>
              <button
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
                onClick={loadDetail}
              >
                Retry
              </button>
            </div>
          ) : isBookingDetail ? (
            /* ---------- Booked visa ---------- */
            <>
              {/* Summary — country, status, who it covers and when */}
              <div className="rounded-2xl border border-[#ececec] overflow-hidden mb-4">
                <div className="flex items-start justify-between gap-3 bg-[#f4f3ec] px-4 py-3">
                  <div className="min-w-0">
                    <div className="ttw-type-small text-[#445069]">Visa for</div>
                    <div className="ttw-type-body font-600 text-[#0b1220] truncate">
                      {displayVisa?.country?.name || bookingDetail?.name || "Your trip"}
                    </div>
                  </div>
                  {bookingDetail?.status && (
                    <span
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 rounded-full flex-shrink-0 ttw-type-small font-600 leading-none tracking-[0.02em] ${statusTone(bookingDetail.status)}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                      {bookingDetail.status}
                    </span>
                  )}
                </div>

                {(paxLabel || checkIn) && (
                  <div className="grid grid-cols-2 max-ph:grid-cols-1 divide-x max-ph:divide-x-0 max-ph:divide-y divide-[#ececec] border-t border-[#ececec]">
                    {paxLabel && (
                      <div className="px-4 py-3">
                        <div className="ttw-type-small text-[#8a93a6] mb-0.5">Travellers</div>
                        <div className="ttw-type-small font-500 text-[#0b1220]">{paxLabel}</div>
                      </div>
                    )}
                    {checkIn && (
                      <div className="px-4 py-3">
                        <div className="ttw-type-small text-[#8a93a6] mb-0.5">Travel dates</div>
                        <div className="ttw-type-small font-500 text-[#0b1220]">
                          {checkOut && checkOut !== checkIn ? `${checkIn} – ${checkOut}` : checkIn}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Visa details */}
              {visaFacts.length > 0 && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-2">Visa details</div>
                  <div className="rounded-2xl border border-[#ececec] divide-y divide-[#ececec]">
                    {visaFacts.map((fact) => (
                      <div key={fact.label} className="flex items-start justify-between gap-4 px-4 py-2.5">
                        <span className="ttw-type-small text-[#8a93a6]">{fact.label}</span>
                        <span className="ttw-type-small font-500 text-[#0b1220] text-right">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist — the one thing the traveller has to act on */}
              {displayVisa?.checklist_file && (
                <a
                  href={displayVisa.checklist_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-[#ececec] px-4 py-3 mb-4 text-[#0b1220] no-underline hover:bg-[#faf9f4] transition-colors"
                >
                  <span className="w-9 h-9 rounded-xl bg-[#f4f3ec] flex items-center justify-center flex-shrink-0">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M9 15h6" />
                      <path d="M9 11h3" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block ttw-type-small font-600 text-[#0b1220]">Document checklist</span>
                    <span className="block ttw-type-small text-[#445069]">
                      Everything you need to submit with this application
                    </span>
                  </span>
                  <span className="ttw-type-small font-500 underline flex-shrink-0">Download</span>
                </a>
              )}

              {/* Terms & guidelines — carried on the booking itself */}
              {termsPoints.length > 0 && (
                <div className="rounded-2xl border border-[#ececec] bg-[#faf9f4] p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-[#ececec] flex items-center justify-center flex-shrink-0 text-[#0b1220]">
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
                    <div className="ttw-type-body font-600 text-[#0b1220]">Terms &amp; Guidelines</div>
                  </div>

                  <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                    {visibleTerms.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 ttw-type-small text-[#445069] leading-relaxed">
                        <span className="mt-[7px] w-1 h-1 rounded-full bg-[#8a93a6] flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {termsCollapsible && (
                    <button
                      type="button"
                      className="ttw-type-small font-500 text-[#0b1220] underline mt-3"
                      onClick={() => setTermsExpanded((open) => !open)}
                    >
                      {termsExpanded ? "Show less" : `Read all ${termsPoints.length} points`}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* ---------- Picking a visa (search → detail → add) ---------- */
            <>
              {/* Country & badges — the visa name lives in the header above */}
              <div className="mb-3">
                {displayVisa?.country?.name && (
                  <div className="ttw-type-body text-[#445069] mt-1">{displayVisa.country.name}</div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {displayVisa?.category && (
                    <span className="ttw-type-small bg-[#eef2fb] text-[#1a2436] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.category)}
                    </span>
                  )}
                  {displayVisa?.entry_type && (
                    <span className="ttw-type-small bg-[#e7f5ee] text-[#1a2436] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.entry_type)}
                    </span>
                  )}
                  {displayVisa?.processing_type && (
                    <span className="ttw-type-small bg-[#fff1ee] text-[#1a2436] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.processing_type)}
                    </span>
                  )}
                  {displayVisa?.purpose && (
                    <span className="ttw-type-small bg-[#e7f5ee] text-[#1a2436] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.purpose)}
                    </span>
                  )}
                  {displayVisa?.stay_period && (
                    <span className="ttw-type-small bg-[#f0e9d6] text-[#1a2436] px-2 py-0.5 rounded-full">
                      Stay: {displayVisa.stay_period}
                    </span>
                  )}
                </div>
              </div>

              {/* Price card — the booked view deliberately has none, matching
                  every other booking's detail view */}
              {displayVisa?.price != null && (
                <div className="bg-[#f4f3ec] rounded-xl p-4 mb-4">
                  <div className="ttw-type-small text-[#445069] mb-1">Visa Fee</div>
                  <div className="ttw-type-h2 font-700 font-mono text-[#0b1220]">
                    {symbol}{getIndianPrice(Math.round(displayVisa.price))}
                    <span className="ttw-type-body font-400 font-sans text-[#445069] ml-1">/ person</span>
                  </div>
                  <div className="ttw-type-small text-[#445069] mt-1">
                    For {itinerary?.number_of_adults || 1} adult{(itinerary?.number_of_adults || 1) > 1 ? "s" : ""}
                    {itinerary?.number_of_children ? `, ${itinerary.number_of_children} child${itinerary.number_of_children > 1 ? "ren" : ""}` : ""}
                  </div>
                </div>
              )}

              {/* Checklist file */}
              {displayVisa?.checklist_file && (
                <a
                  href={displayVisa.checklist_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 ttw-type-small text-[#0b1220] font-500 underline mb-4"
                >
                  📄 Download Visa Checklist

                </a>
              )}

              {/* Description */}
              {displayVisa?.description && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-1">Description</div>
                  <div className="ttw-type-small text-[#445069] leading-relaxed">{displayVisa.description}</div>
                </div>
              )}

              {/* Requirements */}
              {displayVisa?.requirements && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-1">Requirements</div>
                  <div className="ttw-type-small text-[#445069] leading-relaxed">{displayVisa.requirements}</div>
                </div>
              )}

              {/* Inclusions */}
              {displayVisa?.inclusions?.length > 0 && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-2">Inclusions</div>
                  <div className="space-y-1">
                    {displayVisa.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 ttw-type-small text-[#445069]">
                        <span className="text-[#1f8a5a]">✓</span> {inc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
    </AncillaryShell>

    {showSearch && (
      <VisaSearchDrawer
        show={showSearch}
        bookingId={bookingId}
        zIndex={drawerZIndex + 10}
        variant={variant}
        onHide={() => setShowSearch(false)}
        onAdded={onAdded}
        onRemoved={onRemoved}
        onBooked={() => {
          setShowSearch(false);
          onBooked?.();
        }}
      />
    )}
    </>
  );
}
