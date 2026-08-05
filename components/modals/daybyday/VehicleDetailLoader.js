import React from "react";

const Line = ({ className = "" }) => (
  <div className={`bg-[#ececec] rounded ${className}`} />
);

/**
 * Placeholder for the taxi / train / bus / ferry detail drawer while its
 * booking loads. Mirrors the loaded shell — ink band, rail, fact chips, action
 * bar — so nothing shifts when the data lands.
 */
const VehicleDetailLoader = () => {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden animate-pulse">
      <div className="flex-1 overflow-hidden">
        {/* Ink band */}
        <div className="bg-[#0b1220] px-4 pt-3.5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-[17px] h-[17px] rounded bg-white/20 shrink-0" />
            <div className="w-7 h-7 rounded-lg bg-white/15 shrink-0" />
            <div className="h-4 flex-1 max-w-[180px] rounded bg-white/15" />
          </div>
          <div className="flex items-center justify-between gap-3 mt-2.5">
            <div className="h-2.5 w-28 rounded bg-white/10" />
            <div className="h-2.5 w-20 rounded bg-white/10" />
          </div>
        </div>

        {/* Rail */}
        <div className="px-4 pt-5">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="grid gap-x-3"
              style={{ gridTemplateColumns: "68px 14px minmax(0,1fr)" }}
            >
              <div className="flex flex-col items-end gap-1.5">
                {row === 1 ? null : (
                  <>
                    <Line className="w-11 h-3" />
                    <Line className="w-8 h-2" />
                  </>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-[#ececec] top-0 bottom-0" />
                {row === 1 ? null : (
                  <span className="relative block w-2.5 h-2.5 rounded-full mx-auto mt-1 bg-[#ececec]" />
                )}
              </div>
              <div className={row === 2 ? "pb-5" : "pb-6"}>
                {row === 1 ? (
                  <Line className="w-40 max-w-full h-9 rounded-[10px]" />
                ) : (
                  <>
                    <Line className="w-32 max-w-full h-4 mb-2" />
                    <Line className="w-44 max-w-full h-3" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Booking section */}
        <div className="h-px bg-[#efede6] mx-4 mb-4" />
        <Line className="w-16 h-2.5 mx-4 mb-3" />
        <div className="flex flex-wrap gap-2 px-4">
          <Line className="w-32 h-8 rounded-lg" />
          <Line className="w-24 h-8 rounded-lg" />
          <Line className="w-20 h-8 rounded-lg" />
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-[#e2e0d6] bg-white px-4 py-3.5 flex gap-2.5">
        <Line className="flex-1 h-10 rounded-full" />
        <Line className="flex-1 h-10 rounded-full" />
      </div>
    </div>
  );
};

export default VehicleDetailLoader;
