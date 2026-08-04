import React from "react";

const Line = ({ className = "" }) => (
  <div className={`bg-[#ececec] rounded ${className}`} />
);

/**
 * Placeholder for the taxi / train / bus / ferry detail drawer while its
 * booking loads. Mirrors the real drawer's shell — white pane, sticky header
 * row, journey card, vehicle card — so nothing shifts when the data lands.
 */
const VehicleDetailLoader = () => {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden animate-pulse">
      <div className="flex-1 overflow-hidden px-6 max-ph:px-4 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 py-4">
          <Line className="w-6 h-4 shrink-0" />
          <Line className="w-52 max-w-full h-5" />
        </div>

        <div className="pt-2">
          {/* Journey card */}
          <div className="mb-4">
            <Line className="w-16 h-3 mb-2" />
            <div className="rounded-2xl border border-[#ececec] overflow-hidden">
              <div className="bg-[#f4f3ec] px-4 py-3">
                <Line className="w-32 h-4 mb-1.5 bg-[#e2e0d6]" />
                <Line className="w-24 h-3 bg-[#e2e0d6]" />
              </div>

              <div className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ececec] shrink-0" />
                  <span className="flex-1 border-t border-dashed border-[#ececec]" />
                  <Line className="w-24 h-4 rounded-full" />
                  <span className="flex-1 border-t border-dashed border-[#ececec]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ececec] shrink-0" />
                </div>

                <div className="flex items-start justify-between gap-4 mt-3">
                  <div className="flex-1">
                    <Line className="w-28 max-w-full h-4 mb-1.5" />
                    <Line className="w-20 max-w-full h-3 mb-1" />
                    <Line className="w-24 max-w-full h-3" />
                  </div>
                  <div className="flex-1 flex flex-col items-end">
                    <Line className="w-28 max-w-full h-4 mb-1.5" />
                    <Line className="w-20 max-w-full h-3 mb-1" />
                    <Line className="w-24 max-w-full h-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 max-ph:grid-cols-1 gap-px bg-[#ececec] border-t border-[#ececec]">
                {[0, 1].map((i) => (
                  <div key={i} className="bg-white px-4 py-3">
                    <Line className="w-16 h-3 mb-1.5" />
                    <Line className="w-24 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle card */}
          <div>
            <Line className="w-16 h-3 mb-2" />
            <div className="rounded-2xl border border-[#ececec] overflow-hidden">
              <div className="bg-[#f4f3ec] px-4 py-3">
                <Line className="w-24 h-4 bg-[#e2e0d6]" />
              </div>
              <div className="border-b border-[#ececec] px-4 py-4 flex justify-center">
                <Line className="w-full max-w-[220px] h-[120px] rounded-xl" />
              </div>
              <div className="grid grid-cols-2 max-ph:grid-cols-1 gap-px bg-[#ececec]">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-white px-4 py-3">
                    <Line className="w-16 h-3 mb-1.5" />
                    <Line className="w-20 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-[#ececec] bg-white px-6 max-ph:px-4 py-4 flex gap-3">
        <Line className="flex-1 h-11 rounded-full" />
        <Line className="flex-1 h-11 rounded-full" />
      </div>
    </div>
  );
};

export default VehicleDetailLoader;
