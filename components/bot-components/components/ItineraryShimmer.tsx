import React from "react";

interface ShimmerCity {
  name?: string;
  duration?: number;
  nights?: number;
}

interface ItineraryShimmerProps {
  /**
   * Optional route data (from the tailored-form basic_route). When present we
   * render the real city names + durations so the skeleton mirrors the final
   * itinerary structure instead of showing anonymous grey bars.
   */
  cities?: ShimmerCity[];
}

const shimmer = "bg-gray-200 rounded animate-pulse";

// One day-by-day row — mirrors DayRow in CitySection (date column + content).
const DayRowShimmer: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className="flex border-b border-[#E8E8E8]">
    {/* Date column — matches DayRow w-20 md:w-24 */}
    <div className="w-20 md:w-24 px-2 md:px-4 py-3 md:py-4 border-r border-[#E8E8E8] flex items-start">
      <div className={`h-3 w-12 md:w-14 ${shimmer}`} />
    </div>
    {/* Content column — activity rows */}
    <div className="flex-1 px-2 md:px-4 py-2 md:py-3 min-w-0">
      <div className="flex flex-col gap-3 py-1">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 ${shimmer}`} />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className={`h-3 ${shimmer}`} style={{ width: wide ? "70%" : "55%" }} />
            <div className="flex gap-2">
              <div className={`h-4 w-16 rounded-full ${shimmer}`} />
              <div className={`h-3 w-10 ${shimmer}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// One city card — mirrors CitySection (header + day-by-day list).
const CityCardShimmer: React.FC<{ city?: ShimmerCity }> = ({ city }) => {
  const duration = city?.duration ?? city?.nights ?? 2;
  const dayCount = Math.min(Math.max(duration || 1, 1), 4);
  const name = city?.name;

  return (
    <div className="border-1 rounded-t-lg flex flex-col w-full bg-[#FFF5EF] mb-1">
      {/* City header — matches CitySection top bar */}
      <div className="flex items-start justify-between p-3 rounded-t-lg w-full border-1 border-[#FBEAC7]">
        <div className="space-y-2 font-inter w-full min-w-0">
          {/* City name + duration */}
          {name ? (
            <div className="md:ttw-type-h4 text-[16px] md:text-[18px] font-semibold leading-snug truncate">
              {name}
              {duration ? ` - ${duration} ${duration > 1 ? "Nights" : "Night"}` : ""}
            </div>
          ) : (
            <div className={`h-4 md:h-5 w-2/5 ${shimmer}`} />
          )}
          {/* Hotel row */}
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded ${shimmer}`} />
            <div className={`h-3 w-1/3 ${shimmer}`} />
          </div>
        </div>
      </div>

      {/* Day-by-day */}
      <div className="bg-[#FBFBFB]">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {Array.from({ length: dayCount }).map((_, i) => (
            <DayRowShimmer key={i} wide={i % 2 === 0} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ItineraryShimmer: React.FC<ItineraryShimmerProps> = ({ cities }) => {
  const list =
    Array.isArray(cities) && cities.length > 0
      ? cities
      : [undefined, undefined, undefined];

  return (
    <div className="px-3 md:px-6 pt-4 pb-6">
      {/* Itinerary title — matches ItineraryContent h3 */}
      <div className="mb-5 md:mb-6">
        <div className={`h-6 md:h-7 w-3/4 mb-2 ${shimmer}`} />
        <div className={`h-3 md:h-4 w-1/2 ${shimmer}`} />
      </div>

      {list.map((city, i) => (
        <CityCardShimmer key={i} city={city} />
      ))}
    </div>
  );
};

export default ItineraryShimmer;
