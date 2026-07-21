import React from "react";

/**
 * Skeleton loader for the in-chat pricing form. Shown while the backend
 * `pricing_form_shimmer` effect is in flight (state.loading === true), before
 * the prefill (pricing-form widget) arrives. Mirrors the real card's chrome —
 * header title lines, the departure chip, the yes/no toggle rows, and the
 * footer action — so the swap to the live form doesn't shift the layout.
 */
const PricingFormSkeleton: React.FC = () => {
  return (
    <div
      className="ml-10 w-[calc(100%-40px)] max-ph:ml-0 max-ph:-mx-1 max-ph:w-auto rounded-[20px] max-ph:rounded-none bg-white"
      style={{ maxWidth: 480, border: "1px solid #ececec" }}
      role="status"
      aria-busy="true"
      aria-label="Loading pricing form"
    >
      {/* Header */}
      <div
        className="px-5 py-[16px] rounded-t-[20px] max-ph:rounded-t-none"
        style={{
          background: "linear-gradient(135deg,#fffde7 0%,#fff 100%)",
          borderBottom: "1px solid #f4f3ec",
        }}
      >
        <div className="ttw-pricing-skel h-[18px] w-[45%] rounded-[6px] mb-[10px]" />
        <div className="ttw-pricing-skel h-[12px] w-[75%] rounded-[6px]" />
      </div>

      {/* Body */}
      <div className="px-4 py-[18px]">
        {/* Departure city — label + search input */}
        <div className="ttw-pricing-skel h-[10px] w-[30%] rounded-[6px] mb-[10px]" />
        <div className="ttw-pricing-skel h-[42px] w-full rounded-[11px] mb-[18px]" />

        {/* Toggle rows */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between mb-[14px]">
            <div className="flex items-center gap-[11px]">
              <div className="ttw-pricing-skel h-[34px] w-[34px] rounded-[10px]" />
              <div className="ttw-pricing-skel h-[14px] w-[120px] rounded-[6px]" />
            </div>
            <div className="ttw-pricing-skel h-[34px] w-[96px] rounded-[11px]" />
          </div>
        ))}
      </div>

      {/* Footer action */}
      <div className="px-3 pt-2 pb-[18px]">
        <div className="ttw-pricing-skel h-[42px] w-full rounded-[11px]" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ttwPricingShimmer { 0% { background-position: -320px 0; } 100% { background-position: 320px 0; } }
        .ttw-pricing-skel {
          background: linear-gradient(90deg, #ece9e1 0%, #f6f4ee 50%, #ece9e1 100%);
          background-size: 640px 100%;
          animation: ttwPricingShimmer 1.3s linear infinite;
        }
      ` }} />
    </div>
  );
};

export default PricingFormSkeleton;
