import React from "react";

const PriceSummary = () => {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Price Card */}
      <div className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        {/* Check Icon */}
        <div className="absolute top-4 right-4 text-purple-500">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 12l2 2 4-4" />
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <p className="text-gray-500 text-[16px]">Total Price</p>

        <div className="mt-2 flex items-center gap-3">
          <h2 className="text-[20px] font-bold">₹ 39,000/-</h2>

          <span className="rounded-md bg-red-400 px-3 py-1 text-sm font-medium text-white">
            20% Off
          </span>
        </div>

        <p className="mt-1 text-gray-400 line-through">₹ 45,000/-</p>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2 text-white font-medium">
          View Cart
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900">
            12
          </span>
        </button>
      </div>

      {/* AI Buddy Card */}
      <div className="relative rounded-[8px] bg-[linear-gradient(180deg,#FEFFDF_0%,#FFF6DB_46.15%,#FDF0E3_75.48%,#FDF0E3_100%)] shadow-[0_4px_34px_1px_rgba(195,195,195,0.25)]">
        <div className="flex items-start gap-4">
          <img
            src="https://i.pravatar.cc/48?img=47"
            alt="Kaira"
            className="h-12 w-12 rounded-full"
          />

          <div>
            <h3 className="font-semibold text-lg">
              Hey, I'm Kaira – Your AI Travel Buddy
            </h3>
            <p className="mt-1 text-gray-600 text-sm">
              Ready to plan your perfect trip? Let’s customize your itinerary
              together!
            </p>
          </div>
        </div>

        {/* Floating Button */}
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
          ⤢
        </button>
      </div>
    </div>
  );
};

export default PriceSummary;
