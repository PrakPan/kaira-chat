import React from "react";

const Line = ({ className = "" }) => (
  <div className={`bg-[#ececec] rounded ${className}`} />
);

/**
 * Placeholder for the flight detail drawer while its booking loads — the same
 * shell the loaded drawer uses (header, flight card, itinerary card, action
 * bar) so the layout doesn't jump when the data arrives.
 */
const FlightDetailLoader = () => {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden animate-pulse">
      <div className="flex-1 overflow-hidden px-6 max-ph:px-4 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 py-4">
          <Line className="w-6 h-4 shrink-0" />
          <Line className="w-52 max-w-full h-5" />
        </div>

        <div className="pt-2">
          {/* Flight card */}
          <div className="mb-4">
            <Line className="w-14 h-3 mb-2" />
            <div className="rounded-2xl border border-[#ececec] overflow-hidden">
              <div className="bg-[#f4f3ec] px-4 py-3">
                <Line className="w-36 h-4 mb-1.5 bg-[#e2e0d6]" />
                <Line className="w-28 h-3 bg-[#e2e0d6]" />
              </div>
              <div className="px-4 py-4 flex items-center gap-3">
                <Line className="w-11 h-11 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <Line className="w-16 h-3" />
                    <Line className="w-14 h-3" />
                    <Line className="w-16 h-3" />
                  </div>
                  <Line className="w-full h-3 mb-2" />
                  <div className="flex justify-between">
                    <Line className="w-12 h-4" />
                    <Line className="w-12 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Itinerary card */}
          <div>
            <Line className="w-16 h-3 mb-2" />
            <div className="rounded-2xl border border-[#ececec] p-4 flex flex-col gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex gap-3">
                  <Line className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Line className="w-40 max-w-full h-4 mb-2" />
                    <Line className="w-56 max-w-full h-3 mb-1.5" />
                    <Line className="w-32 max-w-full h-3" />
                  </div>
                </div>
              ))}
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

export default FlightDetailLoader;
