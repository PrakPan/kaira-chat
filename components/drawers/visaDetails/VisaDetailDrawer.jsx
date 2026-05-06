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

export default function VisaDetailDrawer({ show, visa, onHide, onBooked, bookingId, drawerZIndex = 1710, showManageActions = false }) {
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
      await visaBooking.post(`${itineraryId}/bookings/visa/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      trackVisaBookingAdd?.(itineraryId, displayVisa?.id || "");
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));
      dispatch(openNotification({
        type: "success",
        heading: "Success!",
        text: `Visa added to your itinerary`,
      }));
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
      style={{ zIndex: drawerZIndex }}
      className="!overflow-y-hidden"
      onHide={onHide}
    >
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="overflow-y-scroll flex-1 px-6 max-ph:px-4 pb-24">
          {/* Back */}
          <div className="py-4 bg-white sticky top-0 z-10 flex items-center justify-between">
            <Image
              src="/backarrow.svg"
              className="cursor-pointer"
              width={22}
              height={2}
              onClick={onHide}
            />
            {showManageActions && (
              <button
                className="ttw-btn-secondary whitespace-nowrap text-sm"
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
              <div className="text-[#6E757A] text-center">{error}</div>
              <button
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg text-sm font-500"
                onClick={fetchDetail}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Title & country */}
              <div className="mb-3">
                <div className="text-[22px] font-600 text-[#01202B] leading-snug">
                  {displayVisa?.text}
                </div>
                {displayVisa?.country?.name && (
                  <div className="text-[14px] text-[#6E757A] mt-1">{displayVisa.country.name}</div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {displayVisa?.category && (
                    <span className="text-[12px] bg-[#F5F0FF] text-[#5B1DB3] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.category)}
                    </span>
                  )}
                  {displayVisa?.entry_type && (
                    <span className="text-[12px] bg-[#DDF4C5] text-[#2A6800] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.entry_type)}
                    </span>
                  )}
                  {displayVisa?.processing_type && (
                    <span className="text-[12px] bg-[#fadadd] text-[#8B0000] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.processing_type)}
                    </span>
                  )}
                  {displayVisa?.purpose && (
                    <span className="text-[12px] bg-[#d5f5d3] text-[#006400] px-2 py-0.5 rounded-full">
                      {formatLabel(displayVisa.purpose)}
                    </span>
                  )}
                  {displayVisa?.stay_period && (
                    <span className="text-[12px] bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-full">
                      Stay: {displayVisa.stay_period}
                    </span>
                  )}
                </div>
              </div>

              {/* Price card */}
              {displayVisa?.price != null && (
                <div className="bg-[#F8F8F8] rounded-xl p-4 mb-4">
                  <div className="text-[13px] text-[#6E757A] mb-1">Visa Fee</div>
                  <div className="text-[24px] font-700 text-[#01202B]">
                    {symbol}{getIndianPrice(Math.round(displayVisa.price))}
                    <span className="text-[14px] font-400 text-[#6E757A] ml-1">/ person</span>
                  </div>
                  {displayVisa?.service_fee != null && (
                    <div className="text-[12px] text-[#6E757A] mt-1">
                      + {symbol}{getIndianPrice(Math.round(displayVisa.service_fee))} service fee
                    </div>
                  )}
                  <div className="text-[12px] text-[#6E757A] mt-1">
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
                  className="flex items-center gap-2 text-[13px] text-[#01202B] font-500 underline mb-4"
                >
                  📄 Download Visa Checklist
                </a>
              )}

              {/* Description */}
              {displayVisa?.description && (
                <div className="mb-4">
                  <div className="text-[14px] font-600 text-[#01202B] mb-1">Description</div>
                  <div className="text-[13px] text-[#6E757A] leading-relaxed">{displayVisa.description}</div>
                </div>
              )}

              {/* Requirements */}
              {displayVisa?.requirements && (
                <div className="mb-4">
                  <div className="text-[14px] font-600 text-[#01202B] mb-1">Requirements</div>
                  <div className="text-[13px] text-[#6E757A] leading-relaxed">{displayVisa.requirements}</div>
                </div>
              )}

              {/* Inclusions */}
              {displayVisa?.inclusions?.length > 0 && (
                <div className="mb-4">
                  <div className="text-[14px] font-600 text-[#01202B] mb-2">Inclusions</div>
                  <div className="space-y-1">
                    {displayVisa.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 text-[13px] text-[#6E757A]">
                        <span className="text-green-500">✓</span> {inc}
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
          <div className="border-t border-[#E5E5E5] px-6 py-4 bg-white">
            {showManageActions ? (
              <button
                className="w-full bg-[#ef4444]  text-white font-500 text-[15px] py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={handleRemove}
                disabled={removing}
              >
                {removing ? <PulseLoader size={8} color="#ffffff" /> : "Remove from Itinerary"}
              </button>
            ) : (
              <button
                className="w-full bg-[#f7e700] text-black font-500 text-[15px] py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
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
        onBooked={() => {
          setShowSearch(false);
          onBooked?.();
        }}
      />
    )}
    </>
  );
}
