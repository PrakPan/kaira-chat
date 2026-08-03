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

// Shimmer sweep — mirrors the `dbd-skel` skeleton in
// containers/itinerary/DaybyDay.jsx one-for-one, so the tailored-form /
// left-panel loading state looks identical to the day-by-day skeleton shown
// when the `shimmer_day_by_day` client effect lands. Scoped class names
// (`is-skel*`) + a uniquely named keyframe so it can't clash with the
// DaybyDay copy when both mount.
const shimmerStyles = `
  @keyframes itinShimmerSweep {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .is-skel {
    background: linear-gradient(90deg, #e9eaee 0%, #f4f5f7 50%, #e9eaee 100%);
    background-size: 800px 100%;
    animation: itinShimmerSweep 1.4s linear infinite;
    border-radius: 6px;
  }
  /* Restaurant (peach-soft) tint — mirrors getActivityStyle's #FFF4E8 fill so
     the skeleton previews dining cards alongside plain activities. */
  .is-skel-food {
    background: linear-gradient(90deg, #ffe9d4 0%, #fff6ec 50%, #ffe9d4 100%);
    background-size: 800px 100%;
    animation: itinShimmerSweep 1.4s linear infinite;
    border-radius: 6px;
  }
  @media (prefers-reduced-motion: reduce) {
    .is-skel, .is-skel-food { animation: none; }
  }
`;

// One day-by-day row — date column + activity row (round icon + title line +
// tag pills). `food` tints the icon + tag with the restaurant peach. Widths
// use % / md: breakpoints so it scales and lines up on mobile.
const SkelDayRow: React.FC<{ last?: boolean; food?: boolean }> = ({
  last,
  food,
}) => {
  const accent = food ? "is-skel-food" : "is-skel";
  return (
    <div
      className={`flex ${last ? "" : "border-b border-[#E8E8E8]"}`}
      aria-hidden="true"
    >
      {/* Date column — matches CityDaybyDay: w-20 md:w-24, px-2 md:px-4, py-3 md:py-4 */}
      <div className="w-20 md:w-24 px-2 md:px-4 py-3 md:py-4 border-r border-[#E8E8E8] flex items-start">
        <div className="is-skel h-3 w-10 md:w-12" />
      </div>
      {/* Activities column */}
      <div className="flex-1 px-2 md:px-4 py-3 md:py-4 flex items-start gap-3 min-w-0">
        <div className={`${accent} w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0`} />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="is-skel h-3 w-3/4" />
          <div className="flex gap-2">
            <div className={`${accent} h-4 w-16 md:w-20 rounded-full`} />
            <div className="is-skel h-4 w-12 md:w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

// One city card — header (city name + Activity/Taxi pills, then hotel line)
// followed by a few day rows. When a real city `name`/`duration` is supplied
// (tailored-form basic_route) we paint them in place of the grey name bar so
// the skeleton mirrors the final itinerary structure.
const SkelCity: React.FC<{ city?: ShimmerCity }> = ({ city }) => {
  const duration = city?.duration ?? city?.nights ?? 2;
  const dayCount = Math.min(Math.max(duration || 1, 1), 4);
  const name = city?.name;

  return (
    <div className="rounded-lg flex flex-col w-full bg-white border-[0.5px] border-[#e5e5e5] overflow-hidden">
      {/* Header — city name + Activity/Taxi pills, then hotel line */}
      <div className="px-4 pt-4 pb-3 border-b border-[#EBEBEB] flex flex-col gap-2.5 font-inter">
        <div className="flex items-center justify-between gap-3 min-w-0">
          {name ? (
            <div className="text-[16px] md:text-[18px] font-semibold leading-snug truncate min-w-0">
              {name}
              {duration
                ? ` - ${duration} ${duration > 1 ? "Nights" : "Night"}`
                : ""}
            </div>
          ) : (
            <div className="is-skel h-4 md:h-[18px] w-[38%] max-w-[180px]" />
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="is-skel h-7 w-[68px] md:w-[80px] rounded-[8px]" />
            <div className="is-skel h-7 w-[56px] md:w-[64px] rounded-[8px]" />
          </div>
        </div>
        {/* Hotel line */}
        <div className="flex items-center gap-2">
          <div className="is-skel h-3 w-[110px]" />
          <div className="is-skel h-3 w-[70px]" />
        </div>
      </div>
      {/* Day rows — every other row previews a restaurant (peach) card */}
      {Array.from({ length: dayCount }).map((_, i) => (
        <SkelDayRow key={`skel-day-${i}`} last={i === dayCount - 1} food={i % 2 === 1} />
      ))}
    </div>
  );
};

// Connector between cards — the inter-city transfer pin + label.
const SkelConnector: React.FC = () => (
  <div className="flex items-center gap-3 py-1 pl-1" aria-hidden="true">
    <div className="is-skel w-4 h-4 rounded-full flex-shrink-0" />
    <div className="is-skel h-3 w-[45%] max-w-[220px]" />
  </div>
);

const ItineraryShimmer: React.FC<ItineraryShimmerProps> = ({ cities }) => {
  const list: (ShimmerCity | undefined)[] =
    Array.isArray(cities) && cities.length > 0
      ? cities
      : [{ duration: 3 }, { duration: 2 }, { duration: 2 }];

  return (
    // Mirrors the fromChat DaybyDay wrapper — 22px side gutters + a vertical
    // stack of city cards joined by transfer connectors.
    <div
      className="flex flex-col gap-3 px-[22px] pt-3 pb-4"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading itinerary"
    >
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      {list.map((city, i) => (
        <React.Fragment key={`skel-city-${i}`}>
          <SkelCity city={city} />
          {i < list.length - 1 && <SkelConnector />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ItineraryShimmer;
