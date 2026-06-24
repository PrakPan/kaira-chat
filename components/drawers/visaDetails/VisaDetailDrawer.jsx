import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import Drawer from "../../ui/Drawer";
import { visaDetail, visaBooking } from "../../../services/ancillaries/visaServices";
import { openNotification } from "../../../store/actions/notification";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { currencySymbols } from "../../../data/currencySymbols";
import { useAnalytics } from "../../../hooks/useAnalytics";
import VisaSearchDrawer from "./VisaSearchDrawer";

export default function VisaDetailDrawer({ show, visa, onHide, onBooked, onAdded, onRemoved, bookingId, drawerZIndex = 1710, showManageActions = false }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const itineraryId = useSelector((state) => state.ItineraryId) || router.query?.id;
  const itinerary = useSelector((state) => state.Itinerary);
  const currency = useSelector((state) => state.currency);
  const CallPaymentInfo = useSelector((state) => state.CallPaymentInfo);

  const [detail, setDetail] = useState(null);
  const [traceId, setTraceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [removing, setRemoving] = useState(false);

  const symbol = currencySymbols?.[currency?.currency] || "₹";

  const { trackVisaBookingAdd } = useAnalytics();

  useEffect(() => {
    if (show && visa?.id) fetchDetail();
  }, [show, visa?.id]);

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

  const displayVisa = detail || visa;

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

  return (
    <>
    <Drawer
      show={show}
      anchor="right"
      backdrop
      width="50%"
      mobileWidth="100%"
      bgColor="#fafaf5"
      style={{ zIndex: drawerZIndex }}
      className="!overflow-y-hidden"
      onHide={onHide}
    >
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="overflow-y-scroll flex-1 px-6 max-ph:px-4 pb-24">
          {/* Back */}
          <div className="py-4 bg-[#fafaf5] sticky top-0 z-10 flex items-center justify-between">
            <Image
              src="/backarrow.svg"
              className="cursor-pointer"
              width={22}
              height={2}
              onClick={onHide}
            />
            {showManageActions && (
              <button
                className="ttw-btn-secondary whitespace-nowrap ttw-type-body"
                onClick={() => setShowSearch(true)}
              >
                Change
              </button>
            )}
          </div>

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
                onClick={fetchDetail}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Title & country */}
              <div className="mb-3">
                <div className="ttw-type-h3 font-600 text-[#0b1220] leading-snug">
                  {displayVisa?.text}
                </div>
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

              {/* Price card */}
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
        </div>

        {/* Sticky CTA — show when detail loaded (traceId present) or fall back to visa.id */}
        {!loading && !error && (traceId || displayVisa?.id) && (
          <div className="sticky bottom-0 z-10 border-t border-[#ececec] px-6 py-4 bg-[#fafaf5]">
            {showManageActions ? (
              <button
                className="ttw-btn-remove-pill"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? (
                  <PulseLoader size={8} color="#ef4444" />
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M8 6V4.5A1.5 1.5 0 019.5 3h5A1.5 1.5 0 0116 4.5V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M18.5 6l-.7 12.1a2 2 0 01-2 1.9H8.2a2 2 0 01-2-1.9L5.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 10.5v5M14 10.5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    Remove from Itinerary
                  </>
                )}
              </button>
            ) : (
              <button
                className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={handleBook}
                disabled={booking}
              >
                {booking ? <PulseLoader size={8} color="#000" /> : "Add Visa to Cart"}
              </button>
            )}
          </div>
        )}
      </div>
    </Drawer>

    {showSearch && (
      <VisaSearchDrawer
        show={showSearch}
        bookingId={bookingId}
        zIndex={drawerZIndex + 10}
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
