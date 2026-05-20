import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Drawer from "../../ui/Drawer";
import { visaSearch } from "../../../services/ancillaries/visaServices";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { currencySymbols } from "../../../data/currencySymbols";
import { useAnalytics } from "../../../hooks/useAnalytics";
import VisaDetailDrawer from "./VisaDetailDrawer";

const BADGE_LABELS = {
  single_entry: "Single Entry",
  multiple_entry: "Multiple Entry",
  standard: "Standard",
  express: "Express",
  urgent: "Urgent",
  tourist: "Tourist",
  business: "Business",
  "e-visa": "E-Visa",
};

const formatLabel = (val) => BADGE_LABELS[val] || (val ? val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : null);

const VisaCard = ({ visa, onSelect, currency }) => {
  const symbol = currencySymbols?.[currency?.currency] || "₹";
  const totalPrice = visa?.price != null ? visa.price : null;

  return (
    <div
      className="rounded-2xl border border-[#E5E5E5] p-4 cursor-pointer hover:bg-[#FAFAFA] transition-colors mt-3 w-full"
      onClick={() => onSelect(visa)}
    >
      <div className="flex flex-col gap-2">
        {/* Title */}
        <div className="ttw-type-body font-600 leading-snug text-[#01202B]">
          {visa?.text}
        </div>

        {/* Country */}
        {visa?.country?.name && (
          <div className="ttw-type-small text-[#6E757A]">{visa.country.name}</div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1">
          {visa?.category && (
            <span className="ttw-type-small bg-[#F5F0FF] text-[#5B1DB3] px-2 py-0.5 rounded-full">
              {formatLabel(visa.category)}
            </span>
          )}
          {visa?.entry_type && (
            <span className="ttw-type-small bg-[#DDF4C5] text-[#2A6800] px-2 py-0.5 rounded-full">
              {formatLabel(visa.entry_type)}
            </span>
          )}
          {visa?.processing_type && (
            <span className="ttw-type-small bg-[#fadadd] text-[#8B0000] px-2 py-0.5 rounded-full">
              {formatLabel(visa.processing_type)}
            </span>
          )}
          {visa?.purpose && (
            <span className="ttw-type-small bg-[#d5f5d3] text-[#006400] px-2 py-0.5 rounded-full">
              {formatLabel(visa.purpose)}
            </span>
          )}
          {visa?.stay_period && (
            <span className="ttw-type-small bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-full">
              Stay: {visa.stay_period}
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-1">
          {totalPrice != null ? (
            <div className="flex flex-col">
              <div className="ttw-type-body font-700 text-[#01202B]">
                {symbol}{getIndianPrice(Math.round(totalPrice))}
                <span className="ttw-type-small font-400 text-[#6E757A] ml-1">/ person</span>
              </div>
            </div>
          ) : (
            <div className="ttw-type-small text-[#6E757A]">View pricing</div>
          )}
          <button className="ttw-type-small font-500 text-[#01202B] underline flex-shrink-0">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VisaSearchDrawer({ show, onHide, onBooked, onAdded, onRemoved, bookingId, zIndex = 1700 }) {
  const router = useRouter();
  const itineraryId = useSelector((state) => state.ItineraryId) || router.query?.id;
  const itinerary = useSelector((state) => state.Itinerary);
  const currency = useSelector((state) => state.currency);

  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    purpose: "",
    processing_type: "",
    category: "",
    entry_type: "",
    country_id: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    purposes: [],
    processing_types: [],
    categories: [],
    entry_types: [],
  });

  const [selectedVisa, setSelectedVisa] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const { trackVisaSearchList } = useAnalytics();

  useEffect(() => {
    if (show) fetchVisas();
  }, [show, currency?.currency]);

  const fetchVisas = async (overrideFilters) => {
    if (!itineraryId) return;
    setLoading(true);
    setError(null);
    try {
      const f = overrideFilters || filters;
      const res = await visaSearch.post("/", {
        itinerary_id: itineraryId,
        country_id: f.country_id || "",
        purpose: f.purpose || "",
        processing_type: f.processing_type || "",
        category: f.category || "",
        entry_type: f.entry_type || "",
        currency: currency?.currency || "INR",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });

      // Response: { success, data: [...], results, next, previous }
      const items = res.data?.data;
      setVisas(Array.isArray(items) ? items : []);
      trackVisaSearchList?.(itineraryId);

      // Build filter options from the returned results
      if (Array.isArray(items) && items.length > 0) {
        const purposes = [...new Set(items.map((v) => v.purpose).filter(Boolean))];
        const processing_types = [...new Set(items.map((v) => v.processing_type).filter(Boolean))];
        const categories = [...new Set(items.map((v) => v.category).filter(Boolean))];
        const entry_types = [...new Set(items.map((v) => v.entry_type).filter(Boolean))];
        setFilterOptions({ purposes, processing_types, categories, entry_types });
      }
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.message?.[0] || "Failed to load visas. Please try again.");
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchVisas(updated);
  };

  const handleSelectVisa = (visa) => {
    setSelectedVisa(visa);
    setShowDetail(true);
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
            <div className="ttw-type-h2 font-semibold">Add Visa</div>

            {/* Filters */}
            {(filterOptions.purposes.length > 0 ||
              filterOptions.processing_types.length > 0 ||
              filterOptions.categories.length > 0 ||
              filterOptions.entry_types.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {filterOptions.purposes.length > 0 && (
                  <select
                    className="px-3 py-2 rounded-lg bg-white border border-[#979393] ttw-type-small font-medium"
                    value={filters.purpose}
                    onChange={(e) => handleFilterChange("purpose", e.target.value)}
                  >
                    <option value="">All Purposes</option>
                    {filterOptions.purposes.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                )}
                {filterOptions.processing_types.length > 0 && (
                  <select
                    className="px-3 py-2 rounded-lg bg-white border border-[#979393] ttw-type-small font-medium"
                    value={filters.processing_type}
                    onChange={(e) => handleFilterChange("processing_type", e.target.value)}
                  >
                    <option value="">All Processing Types</option>
                    {filterOptions.processing_types.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                )}
                {filterOptions.categories.length > 0 && (
                  <select
                    className="px-3 py-2 rounded-lg bg-white border border-[#979393] ttw-type-small font-medium"
                    value={filters.category}
                    onChange={(e) => handleFilterChange("category", e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
                {filterOptions.entry_types.length > 0 && (
                  <select
                    className="px-3 py-2 rounded-lg bg-white border border-[#979393] ttw-type-small font-medium"
                    value={filters.entry_type}
                    onChange={(e) => handleFilterChange("entry_type", e.target.value)}
                  >
                    <option value="">All Entry Types</option>
                    {filterOptions.entry_types.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {!loading && (
              <div className="ttw-type-body text-[#6E757A]">
                {visas.length > 0 ? `Showing ${visas.length} visa option${visas.length !== 1 ? "s" : ""}` : ""}
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col gap-3 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-[#E5E5E5] p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-[80px] h-[60px] bg-gray-200 rounded-xl flex-shrink-0" />
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
                className="bg-[#f7e700] border border-black text-black px-4 py-2 rounded-lg ttw-type-body-strong"
                onClick={() => fetchVisas()}
              >
                Retry
              </button>
            </div>
          ) : visas.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 gap-2">
              <div className="text-[#6E757A] text-center">
                No visa options available for this itinerary.
              </div>
            </div>
          ) : (
            <div className="pb-8">
              {visas.map((visa, i) => (
                <VisaCard
                  key={visa?.id || i}
                  visa={visa}
                  onSelect={handleSelectVisa}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </div>
      </Drawer>

      {showDetail && selectedVisa && (
        <VisaDetailDrawer
          show={showDetail}
          visa={selectedVisa}
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
