import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import AncillaryShell from "../AncillaryShell";
import BookingDetailHeader from "../../revamp/common/components/BookingDetailHeader";
import BookingDetailActions from "../../revamp/common/components/BookingDetailActions";
import { esimPackageDetail, esimBooking } from "../../../services/ancillaries/esimServices";
import { getAncillaryBookingDetail } from "../../../services/ancillaries/ancillaryBookingServices";
import { openNotification } from "../../../store/actions/notification";
import SetCallPaymentInfo from "../../../store/actions/callPaymentInfo";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { currencySymbols } from "../../../data/currencySymbols";
import { useAnalytics } from "../../../hooks/useAnalytics";
import EsimPackagesDrawer from "./EsimPackagesDrawer";

export default function EsimDetailDrawer({ show, pkg, onHide, onBooked, onAdded, onRemoved, bookingId, drawerZIndex = 1710, showManageActions = false, variant = "drawer" }) {
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

  // Viewing a booking that already exists (cart row / bookings list) vs. picking
  // a new package out of the search drawer. The booked view reads the stored
  // booking; only the picker needs a fresh supplier quote and its trace_id.
  const isBookingDetail = showManageActions && !!bookingId;

  const displayPkg = detail || pkg;
  const symbol = currencySymbols?.[currency?.currency] || "₹";

  const { trackEsimBookingAdd } = useAnalytics();

  const bgStyle = displayPkg?.gradient_start && displayPkg?.gradient_end
    ? { background: `linear-gradient(135deg, ${displayPkg.gradient_start}, ${displayPkg.gradient_end})` }
    : { background: "#1B1B1B" };

  useEffect(() => {
    if (!show) return;
    if (isBookingDetail) fetchBookingDetail();
    else if (pkg?.id) fetchDetail();
  }, [show, pkg?.id, isBookingDetail, bookingId, itineraryId]);

  // Same endpoint the activity booking drawer uses, with "ancillary" as the
  // booking type — the booking carries its package snapshot in external_data.
  const fetchBookingDetail = async () => {
    if (!itineraryId || !bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getAncillaryBookingDetail(itineraryId, bookingId);
      const data = res?.data || null;
      setBookingDetail(data);
      setDetail(data?.external_data?.package || null);
      setTraceId(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message?.[0] ||
        "Failed to load eSIM details.",
      );
    }
    setLoading(false);
  };

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

  const loadDetail = () => (isBookingDetail ? fetchBookingDetail() : fetchDetail());

  const handleBook = async () => {
    const tid = traceId || displayPkg?.id;
    if (!tid) return;
    setBooking(true);
    try {
      const payload = { trace_id: tid };
      if (bookingId) payload.booking_id = bookingId;
      const res = await esimBooking.post(`${itineraryId}/bookings/esim/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      const newBooking = res?.data?.ancillary_booking || res?.data?.data || res?.data;
      trackEsimBookingAdd?.(itineraryId, displayPkg?.id || "");
      dispatch(SetCallPaymentInfo(!CallPaymentInfo));
      dispatch(openNotification({
        type: "success",
        heading: "Success!",
        text: "eSIM package added to your itinerary",
      }));
      onAdded?.(newBooking, bookingId || null);
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
      onRemoved?.(bookingId);
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

  // The package-detail payload does not always carry `title`; falling through
  // to the `pkg` prop keeps the title — and with it the sheet's ✕, which Sheet
  // only draws when there IS a title — from vanishing once the quote lands.
  const heading =
    displayPkg?.title || pkg?.title || bookingDetail?.name || "eSIM details";

  // The CTA is the shell's footer — Sheet's footer slot on the phone, a sticky
  // bar inside the drawer on desktop. Shown for a loaded booking in manage
  // mode; otherwise the quote's traceId, falling back to the package id.
  const canAct =
    !loading &&
    !error &&
    Boolean(isBookingDetail ? bookingDetail : traceId || displayPkg?.id);

  const cta = canAct ? (
    showManageActions ? (
      <BookingDetailActions
        onDelete={handleRemove}
        deleting={removing}
        deleteLabel="Remove from Itinerary"
        confirmItemLabel="eSIM"
        onChange={() => setShowSearch(true)}
        changeLabel="Change eSIM"
        changeDisabled={removing}
      />
    ) : (
      <button
        className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
        onClick={handleBook}
        disabled={booking}
      >
        {booking ? <PulseLoader size={8} color="#000" /> : "Add eSIM to Cart"}
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
              <div className="w-full h-[160px] bg-gray-200 rounded-2xl animate-pulse" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
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
                  <span className="text-white ttw-type-h2 font-700">{displayPkg?.country_code || "eSIM"}</span>
                  {displayPkg?.title && (
                    <span className="text-white ttw-type-small opacity-80">{displayPkg.title}</span>
                  )}
                </div>
              )}

              {/* Title lives in the header above */}

              {/* Key specs row */}
              <div className="flex items-center gap-3 ttw-type-small text-[#445069] mb-3">
                {displayPkg?.data && (
                  <span className="font-600 text-[#0b1220]">{displayPkg.data}</span>
                )}
                {displayPkg?.day != null && (
                  <><span>·</span><span>{displayPkg.day} day{displayPkg.day > 1 ? "s" : ""}</span></>
                )}
                {displayPkg?.is_unlimited && (
                  <><span>·</span><span className="text-[#1f8a5a]">Unlimited</span></>
                )}
                {displayPkg?.is_roaming && (
                  <><span>·</span><span className="text-[#1f8a5a]">Roaming ✓</span></>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {displayPkg?.esim_type && (
                  <span className="ttw-type-small bg-[#eef2fb] text-[#1a2436] px-2 py-0.5 rounded-full">
                    {displayPkg.esim_type}
                  </span>
                )}
                {displayPkg?.rechargeability && (
                  <span className="ttw-type-small bg-[#e7f5ee] text-[#1f8a5a] px-2 py-0.5 rounded-full">
                    Rechargeable
                  </span>
                )}
                {displayPkg?.plan_type && (
                  <span className="ttw-type-small bg-[#f4f3ec] text-[#445069] px-2 py-0.5 rounded-full border border-[#ececec] capitalize">
                    {displayPkg.plan_type}
                  </span>
                )}
                {displayPkg?.activation_policy && (
                  <span className="ttw-type-small bg-[#f0e9d6] text-[#1a2436] px-2 py-0.5 rounded-full capitalize">
                    {displayPkg.activation_policy.replace(/-/g, " ")}
                  </span>
                )}
              </div>

              {/* Price card — only while picking a package. A booked eSIM
                  shows no price, matching every other booking's detail view. */}
              {!isBookingDetail && displayPkg?.price != null && (
                <div className="bg-[#f4f3ec] rounded-xl p-4 mb-4">
                  <div className="ttw-type-small text-[#445069] mb-1">Price</div>
                  <div className="ttw-type-h2 font-700 font-mono text-[#0b1220]">
                    {symbol}{getIndianPrice(Math.round(displayPkg.price))}
                  </div>
                  <div className="ttw-type-small text-[#445069] mt-0.5">
                    Per traveller · {itinerary?.number_of_adults || 1} adult{(itinerary?.number_of_adults || 1) > 1 ? "s" : ""}
                  </div>
                </div>
              )}

              {/* Warning */}
              {displayPkg?.warning && (
                <div className="bg-[#fffde7] border border-[#f7e700] rounded-xl p-3 mb-4 flex gap-2">
                  <span>⚠️</span>
                  <div className="ttw-type-small text-[#445069]">{displayPkg.warning}</div>
                </div>
              )}

              {/* Package info bullet points */}
              {displayPkg?.info?.length > 0 && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-2">What's Included</div>
                  <div className="space-y-1.5">
                    {displayPkg.info.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 ttw-type-small text-[#445069]">
                        <span className="text-[#1f8a5a] mt-0.5 flex-shrink-0">✓</span>
                        <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other info */}
              {displayPkg?.other_info && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-1">Coverage Info</div>
                  <div className="ttw-type-small text-[#445069] leading-relaxed">{displayPkg.other_info}</div>
                </div>
              )}

              {/* Fair usage policy */}
              {displayPkg?.fair_usage_policy && (
                <div className="bg-[#eef2fb] rounded-xl p-3 mb-4">
                  <div className="ttw-type-small font-600 text-[#0b1220] mb-0.5">Fair Usage Policy</div>
                  <div className="ttw-type-small text-[#445069]">{displayPkg.fair_usage_policy}</div>
                </div>
              )}

              {/* APN Setup */}
              {(displayPkg?.apn_type || displayPkg?.apn_value) && (
                <div className="bg-[#eef2fb] rounded-xl p-4 mb-4">
                  <div className="ttw-type-small font-600 text-[#0b1220] mb-2">APN Setup</div>
                  {displayPkg.apn_type && (
                    <div className="ttw-type-small text-[#445069]">
                      Type: <span className="text-[#0b1220] font-500">{displayPkg.apn_type}</span>
                    </div>
                  )}
                  {displayPkg.apn_value && (
                    <div className="ttw-type-small text-[#445069] mt-0.5">
                      APN: <span className="text-[#0b1220] font-600 font-mono">{displayPkg.apn_value}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Install window */}
              {displayPkg?.install_window_days != null && (
                <div className="ttw-type-small text-[#445069] mb-4">
                  📅 Must be installed within <span className="font-600 text-[#0b1220]">{displayPkg.install_window_days} days</span> of purchase
                </div>
              )}

              {/* Installation instructions */}
              {displayPkg?.qr_installation && (
                <div className="mb-4">
                  <div className="ttw-type-body font-600 text-[#0b1220] mb-1">QR Installation</div>
                  <div className="ttw-type-small text-[#445069] leading-relaxed">
                    {stripHtml(displayPkg.qr_installation)}
                  </div>
                </div>
              )}
            </>
          )}
    </AncillaryShell>

    {showSearch && (
      <EsimPackagesDrawer
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
