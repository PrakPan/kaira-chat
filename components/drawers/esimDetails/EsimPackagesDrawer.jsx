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
import SearchLoaderOverlay from "../../ui/SearchLoaderOverlay";

const EsimCard = ({ pkg, onSelect, currency }) => {
  const currCode = currency?.currency || "INR";
  const symbol = currencySymbols?.[currCode] || "₹";
  const displayPrice = pkg?.prices?.recommended_retail_price?.[currCode];
  const bgStyle = pkg?.gradient_start && pkg?.gradient_end
    ? { background: `linear-gradient(135deg, ${pkg.gradient_start}, ${pkg.gradient_end})` }
    : { background: "#1B1B1B" };

  return (
    <div
      className="rounded-2xl border border-[#ececec] bg-white p-4 cursor-pointer hover:bg-[#f4f3ec] transition-colors flex gap-4 mt-3 w-full"
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
            <span className="text-white ttw-type-small font-700">{pkg?.country_code || "eSIM"}</span>
            {pkg?.day && (
              <span className="text-white ttw-type-small opacity-80">{pkg.day}d</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0 gap-1">
        <div className="ttw-type-body font-600 text-[#0b1220] line-clamp-1">{pkg?.title}</div>

        <div className="flex items-center gap-2 ttw-type-small text-[#445069]">
          {pkg?.data && (
            <span className="font-600 text-[#0b1220]">{pkg.data}</span>
          )}
          {pkg?.data && pkg?.day && <span>·</span>}
          {pkg?.day && (
            <span>{pkg.day} day{pkg.day > 1 ? "s" : ""}</span>
          )}
          {pkg?.is_roaming && <><span>·</span><span className="text-[#1f8a5a]">Roaming ✓</span></>}
        </div>

        <div className="flex flex-wrap gap-1">
          {pkg?.esim_type && (
            <span className="ttw-type-small bg-[#eef2fb] text-[#1a2436] px-2 py-0.5 rounded-full">
              {pkg.esim_type}
            </span>
          )}
          {pkg?.rechargeability && (
            <span className="ttw-type-small bg-[#e7f5ee] text-[#1f8a5a] px-2 py-0.5 rounded-full">
              Rechargeable
            </span>
          )}
          {pkg?.plan_type && (
            <span className="ttw-type-small bg-[#f4f3ec] text-[#445069] px-2 py-0.5 rounded-full capitalize border border-[#ececec]">
              {pkg.plan_type}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          {displayPrice != null ? (
            <div className="ttw-type-body font-700 font-mono text-[#0b1220]">
              {symbol}{getIndianPrice(Math.round(displayPrice))}
            </div>
          ) : (
            <div className="ttw-type-small text-[#445069]">View pricing</div>
          )}
          <button className="ttw-type-small font-500 text-[#0b1220] underline flex-shrink-0">
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
        bgColor="#fafaf5"
        style={{ zIndex }}
        className="!overflow-y-hidden"
        onHide={onHide}
      >
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4">
          {/* Header */}
          <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0">
            <div>
              <Image
                src="/backarrow.svg"
                className="cursor-pointer"
                width={22}
                height={2}
                onClick={onHide}
              />
            </div>
            <div className="ttw-type-h2 font-semibold text-[#0b1220]">Add eSIM</div>

            {!loading && packages.length > 0 && (
              <div className="ttw-type-body text-[#445069]">
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
                <div key={i} className="rounded-2xl border border-[#ececec] p-4 animate-pulse">
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
              <div className="text-[#445069] text-center">{error}</div>
              <button
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
                onClick={() => fetchPackages(1, false)}
              >
                Retry
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 gap-2">
              <div className="text-[#445069] text-center">
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
                  className="w-full mt-4 py-3 rounded-xl border border-[#ececec] ttw-type-small font-500 text-[#0b1220] hover:bg-[#f4f3ec] transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : `Load more (${meta.total - packages.length} remaining)`}
                </button>
              )}
            </div>
          )}
        </div>
      </Drawer>

      <SearchLoaderOverlay
        isVisible={show && loading}
        displayText="Finding best eSIM plans for you"
        zIndex={zIndex + 5}
      />

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
