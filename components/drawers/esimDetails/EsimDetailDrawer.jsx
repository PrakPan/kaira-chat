import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import Drawer from "../../ui/Drawer";
import { esimPackageDetail, esimBooking } from "../../../services/ancillaries/esimServices";
import { openNotification } from "../../../store/actions/notification";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { currencySymbols } from "../../../data/currencySymbols";
import { useAnalytics } from "../../../hooks/useAnalytics";
import EsimPackagesDrawer from "./EsimPackagesDrawer";

export default function EsimDetailDrawer({ show, pkg, onHide, onBooked, bookingId, drawerZIndex = 1710, showManageActions = false }) {
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
  const displayPkg = detail || pkg;

  const { trackEsimBookingAdd } = useAnalytics();

  const bgStyle = displayPkg?.gradient_start && displayPkg?.gradient_end
    ? { background: `linear-gradient(135deg, ${displayPkg.gradient_start}, ${displayPkg.gradient_end})` }
    : { background: "#1B1B1B" };

  useEffect(() => {
    if (show && pkg?.id) fetchDetail();
  }, [show, pkg?.id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await esimPackageDetail.post("/", {
        package_id: pkg.id,
        start_date: itinerary?.start_date || "",
        number_of_adults: itinerary?.number_of_adults || 1,
        number_of_children: itinerary?.number_of_children || 0,
        number_of_infants: itinerary?.number_of_infants || 0,
        currency: currency?.currency || "INR",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      // Response: { data: { package: {...} }, trace_id }
      const d = res.data?.data;
      setDetail(d?.package || (typeof d === "object" && !Array.isArray(d) ? d : null));
      setTraceId(res.data?.trace_id || d?.trace_id);
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to load eSIM details.");
    }
    setLoading(false);
  };

  const handleBook = async () => {
    const tid = traceId || displayPkg?.id;
    if (!tid) return;
    setBooking(true);
    try {
      const payload = { trace_id: tid };
      if (bookingId) payload.booking_id = bookingId;
      await esimBooking.post(`${itineraryId}/bookings/esim/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      trackEsimBookingAdd?.(itineraryId, displayPkg?.id || "");
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));
      dispatch(openNotification({
        type: "success",
        heading: "Success!",
        text: "eSIM package added to your itinerary",
      }));
      onBooked?.();
    } catch (err) {
      dispatch(openNotification({
        type: "error",
        heading: "Error!",
        text: err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to add eSIM. Please try again.",
      }));
    }
    setBooking(false);
  };

  const handleRemove = async () => {
    if (!bookingId) return;
    setRemoving(true);
    try {
      await esimBooking.delete(`${itineraryId}/ancillary-booking/${bookingId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));
      dispatch(openNotification({
        type: "success",
        heading: "Removed!",
        text: "eSIM removed from your itinerary",
      }));
      onBooked?.();
    } catch (err) {
      dispatch(openNotification({
        type: "error",
        heading: "Error!",
        text: err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to remove eSIM. Please try again.",
      }));
    }
    setRemoving(false);
  };

  // Strip HTML tags for plain text display
  const stripHtml = (html) => html?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

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
              <div className="w-full h-[160px] bg-gray-200 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
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
              {/* Hero */}
              {displayPkg?.image ? (
                <img
                  src={typeof displayPkg.image === "string" ? displayPkg.image : displayPkg.image?.url}
                  alt={displayPkg?.title}
                  className="w-full h-[160px] object-cover rounded-2xl mb-4"
                />
              ) : (
                <div className="w-full h-[160px] rounded-2xl mb-4 flex flex-col items-center justify-center gap-1" style={bgStyle}>
                  <span className="text-white text-[26px] font-700">{displayPkg?.country_code || "eSIM"}</span>
                  {displayPkg?.title && (
                    <span className="text-white text-[13px] opacity-80">{displayPkg.title}</span>
                  )}
                </div>
              )}

              {/* Title */}
              <div className="text-[22px] font-600 text-[#01202B] leading-snug mb-1">
                {displayPkg?.title}
              </div>

              {/* Key specs row */}
              <div className="flex items-center gap-3 text-[13px] text-[#6E757A] mb-3">
                {displayPkg?.data && (
                  <span className="font-600 text-[#01202B]">{displayPkg.data}</span>
                )}
                {displayPkg?.day != null && (
                  <><span>·</span><span>{displayPkg.day} day{displayPkg.day > 1 ? "s" : ""}</span></>
                )}
                {displayPkg?.is_unlimited && (
                  <><span>·</span><span className="text-[#2A6800]">Unlimited</span></>
                )}
                {displayPkg?.is_roaming && (
                  <><span>·</span><span className="text-[#2A6800]">Roaming ✓</span></>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {displayPkg?.esim_type && (
                  <span className="text-[11px] bg-[#F5F0FF] text-[#5B1DB3] px-2 py-0.5 rounded-full">
                    {displayPkg.esim_type}
                  </span>
                )}
                {displayPkg?.rechargeability && (
                  <span className="text-[11px] bg-[#DDF4C5] text-[#2A6800] px-2 py-0.5 rounded-full">
                    Rechargeable
                  </span>
                )}
                {displayPkg?.plan_type && (
                  <span className="text-[11px] bg-[#F8F8F8] text-[#6E757A] px-2 py-0.5 rounded-full border border-[#E5E5E5] capitalize">
                    {displayPkg.plan_type}
                  </span>
                )}
                {displayPkg?.activation_policy && (
                  <span className="text-[11px] bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-full capitalize">
                    {displayPkg.activation_policy.replace(/-/g, " ")}
                  </span>
                )}
              </div>

              {/* Price card — detail.price is already in the requested currency */}
              {displayPkg?.price != null && (
                <div className="bg-[#F8F8F8] rounded-xl p-4 mb-4">
                  <div className="text-[13px] text-[#6E757A] mb-1">Price</div>
                  <div className="text-[24px] font-700 text-[#01202B]">
                    {symbol}{getIndianPrice(Math.round(displayPkg.price))}
                  </div>
                  <div className="text-[11px] text-[#6E757A] mt-0.5">
                    Per traveller · {itinerary?.number_of_adults || 1} adult{(itinerary?.number_of_adults || 1) > 1 ? "s" : ""}
                  </div>
                </div>
              )}

              {/* Warning */}
              {displayPkg?.warning && (
                <div className="bg-[#FFF8E1] border border-[#FFD740] rounded-xl p-3 mb-4 flex gap-2">
                  <span>⚠️</span>
                  <div className="text-[12px] text-[#7A5800]">{displayPkg.warning}</div>
                </div>
              )}

              {/* Package info bullet points */}
              {displayPkg?.info?.length > 0 && (
                <div className="mb-4">
                  <div className="text-[14px] font-600 text-[#01202B] mb-2">What's Included</div>
                  <div className="space-y-1.5">
                    {displayPkg.info.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-[13px] text-[#6E757A]">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other info */}
              {displayPkg?.other_info && (
                <div className="mb-4">
                  <div className="text-[14px] font-600 text-[#01202B] mb-1">Coverage Info</div>
                  <div className="text-[13px] text-[#6E757A] leading-relaxed">{displayPkg.other_info}</div>
                </div>
              )}

              {/* Fair usage policy */}
              {displayPkg?.fair_usage_policy && (
                <div className="bg-[#F0F4FF] rounded-xl p-3 mb-4">
                  <div className="text-[12px] font-600 text-[#01202B] mb-0.5">Fair Usage Policy</div>
                  <div className="text-[12px] text-[#6E757A]">{displayPkg.fair_usage_policy}</div>
                </div>
              )}

              {/* APN Setup */}
              {(displayPkg?.apn_type || displayPkg?.apn_value) && (
                <div className="bg-[#F5F0FF] rounded-xl p-4 mb-4">
                  <div className="text-[13px] font-600 text-[#01202B] mb-2">APN Setup</div>
                  {displayPkg.apn_type && (
                    <div className="text-[12px] text-[#6E757A]">
                      Type: <span className="text-[#01202B] font-500">{displayPkg.apn_type}</span>
                    </div>
                  )}
                  {displayPkg.apn_value && (
                    <div className="text-[12px] text-[#6E757A] mt-0.5">
                      APN: <span className="text-[#01202B] font-600 font-mono">{displayPkg.apn_value}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Install window */}
              {displayPkg?.install_window_days != null && (
                <div className="text-[12px] text-[#6E757A] mb-4">
                  📅 Must be installed within <span className="font-600 text-[#01202B]">{displayPkg.install_window_days} days</span> of purchase
                </div>
              )}

              {/* Installation instructions */}
              {displayPkg?.qr_installation && (
                <div className="mb-4">
                  <div className="text-[14px] font-600 text-[#01202B] mb-1">QR Installation</div>
                  <div className="text-[12px] text-[#6E757A] leading-relaxed">
                    {stripHtml(displayPkg.qr_installation)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky CTA */}
        {!loading && !error && (traceId || displayPkg?.id) && (
          <div className="border-t border-[#E5E5E5] px-6 py-4 bg-white">
            {showManageActions ? (
              <button
                className="w-full bg-[#ef4444] text-white font-500 text-[15px] py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
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
                {booking ? <PulseLoader size={8} color="#000" /> : "Add eSIM to Cart"}
              </button>
            )}
          </div>
        )}
      </div>
    </Drawer>

    {showSearch && (
      <EsimPackagesDrawer
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
