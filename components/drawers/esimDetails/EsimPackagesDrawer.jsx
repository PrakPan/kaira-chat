import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Drawer from "../../ui/Drawer";
import { esimPackages } from "../../../services/ancillaries/esimServices";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { currencySymbols } from "../../../data/currencySymbols";
import { useAnalytics } from "../../../hooks/useAnalytics";
import EsimDetailDrawer from "./EsimDetailDrawer";

const EsimCard = ({ pkg, onSelect, currency }) => {
  const currCode = currency?.currency || "INR";
  const symbol = currencySymbols?.[currCode] || "₹";
  const displayPrice = pkg?.prices?.recommended_retail_price?.[currCode];
  const bgStyle = pkg?.gradient_start && pkg?.gradient_end
    ? { background: `linear-gradient(135deg, ${pkg.gradient_start}, ${pkg.gradient_end})` }
    : { background: "#1B1B1B" };

  return (
    <div
      className="rounded-2xl border border-[#E5E5E5] p-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors flex gap-4 mt-3 w-full"
      onClick={() => onSelect(pkg)}
    >
      <div className="flex-shrink-0">
        {pkg?.image ? (
          <img
            src={typeof pkg.image === "string" ? pkg.image : pkg.image?.url}
            alt={pkg.title}
            className="w-[72px] h-[56px] object-cover rounded-xl"
          />
        ) : (
          <div
            className="w-[72px] h-[56px] rounded-xl flex flex-col items-center justify-center gap-0.5"
            style={bgStyle}
          >
            <span className="text-white text-[11px] font-700">{pkg?.country_code || "eSIM"}</span>
            {pkg?.day && (
              <span className="text-white text-[9px] opacity-80">{pkg.day}d</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0 gap-1">
        <div className="text-[14px] font-600 text-[#01202B] line-clamp-1">{pkg?.title}</div>

        <div className="flex items-center gap-2 text-[12px] text-[#6E757A]">
          {pkg?.data && (
            <span className="font-600 text-[#01202B]">{pkg.data}</span>
          )}
          {pkg?.data && pkg?.day && <span>·</span>}
          {pkg?.day && (
            <span>{pkg.day} day{pkg.day > 1 ? "s" : ""}</span>
          )}
          {pkg?.is_roaming && <><span>·</span><span className="text-[#2A6800]">Roaming ✓</span></>}
        </div>

        <div className="flex flex-wrap gap-1">
          {pkg?.esim_type && (
            <span className="text-[10px] bg-[#F5F0FF] text-[#5B1DB3] px-2 py-0.5 rounded-full">
              {pkg.esim_type}
            </span>
          )}
          {pkg?.rechargeability && (
            <span className="text-[10px] bg-[#DDF4C5] text-[#2A6800] px-2 py-0.5 rounded-full">
              Rechargeable
            </span>
          )}
          {pkg?.plan_type && (
            <span className="text-[10px] bg-[#F8F8F8] text-[#6E757A] px-2 py-0.5 rounded-full capitalize border border-[#E5E5E5]">
              {pkg.plan_type}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          {displayPrice != null ? (
            <div className="text-[14px] font-700 text-[#01202B]">
              {symbol}{getIndianPrice(Math.round(displayPrice))}
            </div>
          ) : (
            <div className="text-[12px] text-[#6E757A]">View pricing</div>
          )}
          <button className="text-[12px] font-500 text-[#01202B] underline flex-shrink-0">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EsimPackagesDrawer({ show, onHide, onBooked, onAdded, onRemoved, bookingId, zIndex = 1700 }) {
  const router = useRouter();
  const itineraryId = useSelector((state) => state.ItineraryId) || router.query?.id;
  const currency = useSelector((state) => state.currency);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const { trackEsimSearchList } = useAnalytics();

  useEffect(() => {
    if (show && itineraryId) {
      fetchPackages(1, false);
    }
  }, [show, currency?.currency]);

  const fetchPackages = async (page = 1, append = false) => {
    if (!itineraryId) return;
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await esimPackages.post("/", {
        itinerary_id: itineraryId,
        page,
        currency: currency?.currency || "INR",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      const payload = res.data?.data;
      const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
      const pageMeta = payload?.meta || res.data?.meta || null;
      setPackages((prev) => append ? [...prev, ...list] : list);
      setMeta(pageMeta);
      if (!append) trackEsimSearchList?.(itineraryId);
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to load eSIM packages.");
    }
    if (append) setLoadingMore(false);
    else setLoading(false);
  };

  const handleLoadMore = () => {
    if (!meta?.has_next || loadingMore) return;
    fetchPackages(meta.page + 1, true);
  };

  return (
    <>
      <Drawer
        show={show}
        anchor="right"
        backdrop
        width="50%"
        mobileWidth="100%"
        style={{ zIndex }}
        className="!overflow-y-hidden"
        onHide={onHide}
      >
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4">
          {/* Header */}
          <div className="py-4 bg-white z-[900] flex flex-col gap-3 pb-2 sticky top-0">
            <div>
              <Image
                src="/backarrow.svg"
                className="cursor-pointer"
                width={22}
                height={2}
                onClick={onHide}
              />
            </div>
            <div className="text-[24px] font-semibold">Add eSIM</div>

            {!loading && packages.length > 0 && (
              <div className="text-sm text-[#6E757A]">
                {meta?.total
                  ? `${packages.length} of ${meta.total} package${meta.total !== 1 ? "s" : ""} available`
                  : `${packages.length} package${packages.length !== 1 ? "s" : ""} available`}
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col gap-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-[#E5E5E5] p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-[70px] h-[50px] bg-gray-200 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center mt-16 gap-3">
              <div className="text-[#6E757A] text-center">{error}</div>
              <button
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg text-sm font-500"
                onClick={() => fetchPackages(1, false)}
              >
                Retry
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 gap-2">
              <div className="text-[#6E757A] text-center">
                No eSIM packages found for this itinerary.
              </div>
            </div>
          ) : (
            <div className="pb-8">
              {packages.map((pkg, i) => (
                <EsimCard
                  key={pkg?.id || i}
                  pkg={pkg}
                  onSelect={(p) => { setSelectedPackage(p); setShowDetail(true); }}
                  currency={currency}
                />
              ))}
              {meta?.has_next && (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full mt-4 py-3 rounded-xl border border-[#E5E5E5] text-[13px] font-500 text-[#01202B] hover:bg-[#FAFAFA] transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : `Load more (${meta.total - packages.length} remaining)`}
                </button>
              )}
            </div>
          )}
        </div>
      </Drawer>

      {showDetail && selectedPackage && (
        <EsimDetailDrawer
          show={showDetail}
          pkg={selectedPackage}
          bookingId={bookingId}
          drawerZIndex={zIndex + 10}
          onHide={() => setShowDetail(false)}
          onAdded={onAdded}
          onRemoved={onRemoved}
          onBooked={() => {
            setShowDetail(false);
            onBooked?.();
            onHide();
          }}
        />
      )}
    </>
  );
}
