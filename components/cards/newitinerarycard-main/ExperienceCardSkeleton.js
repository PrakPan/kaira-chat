// Skeleton matching `ItineraryCardV2` shape:
//   • Mobile (<640px): image stacks on top, body below.
//   • Tablet+ (>=640px): image on the left (~220px), body on the right.
// Uses Tailwind only so it stays self-contained and inherits app styles.
export default function ExperienceCardSkeleton() {
  return (
    <div className="w-full bg-white border border-[#e5e7eb] rounded-[22px] overflow-hidden flex flex-col sm:flex-row animate-pulse">
      {/* Image area */}
      <div className="relative bg-gray-200 w-full sm:w-[220px] sm:flex-shrink-0 h-[180px] sm:h-auto sm:min-h-[260px]">
        {/* Mock "nights" pill (top-left) */}
        <div className="absolute top-3 left-3 h-5 w-16 bg-gray-300 rounded-full" />
        {/* Mock "tier" pill (top-right) */}
        <div className="absolute top-3 right-3 h-5 w-20 bg-gray-300 rounded-full" />
      </div>

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
        {/* Route line */}
        <div className="h-3 w-1/2 bg-gray-200 rounded" />

        {/* Title (two lines) */}
        <div className="space-y-2">
          <div className="h-4 w-11/12 bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>

        {/* Includes grid — 4 cells matching itinIncludes */}
        <div className="grid grid-cols-4 gap-2 mt-1">
          {[0, 1, 2, 3].map((k) => (
            <div key={k} className="space-y-1">
              <div className="h-3 w-5 bg-gray-200 rounded" />
              <div className="h-2 w-10 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        {/* Footer — price + CTA */}
        <div className="mt-auto pt-3 border-t border-[#f1f5f9] flex items-end justify-between">
          <div className="space-y-1">
            <div className="h-2 w-8 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
