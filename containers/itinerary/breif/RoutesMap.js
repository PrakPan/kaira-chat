import dynamic from "next/dynamic";
import { getHumanDate } from "../../../services/getHumanDate";
import WeatherWidget from "../../../components/WeatherWidget/WeatherWidget";
import ImageLoader from "../../../components/ImageLoader.js";
const MapBox = dynamic(() => import("../../../components/MapBox.js"), {
  ssr: false,
});

export default function RoutesMap({
  locations,
  setShowDrawer,
  setShowDrawerData,
  setEditRoute,
}) {
  function scrollToTargetAdjusted(id) {
    if (setEditRoute) {
      setEditRoute(false);
    }

    const element = document.getElementById(id);
    const headerOffset = 90;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  const InfoWindowContainer = (location) => (
    <div className="w-full flex flex-row gap-3">
      {location?.cityData?.image && (
        <ImageLoader
          borderRadius="8px"
          url={location?.cityData?.image}
          height={150}
          width={150}
          heightMobile="auto"
          dimensionsMobile={{ width: 150, height: 150 }}
        ></ImageLoader>
      )}

      <div className="flex flex-col gap-2">
        <div>
          <div className="font-bold text-lg text-[#270e0e] text-nowrap">
            {location.name}
            {location?.duration ? ` - ${location.duration} Nights` : null}
          </div>
          <div className="font-semibold">{getHumanDate(location.date)}</div>
        </div>

        <WeatherWidget
          location={location}
          city={location?.name}
          description={location?.cityData?.short_description}
          setShowDrawer={setShowDrawer}
          setShowDrawerData={setShowDrawerData}
          noSkeleton
        />

        {location?.dayId && (
          <div
            className={`text-nowrap relative rounded w-fit cursor-pointer bg-slate-600 px-2 py-2 text-xs font-semibold text-white shadow-sm  hover:bg-[#BF3535] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            onClick={() => scrollToTargetAdjusted(location.dayId)}
          >
            View {location.name} in your Itinerary
          </div>
        )}
      </div>
    </div>
  );

  return locations?.length >= 1 ? (
    <MapBox
      height="100%"
      InfoWindowContainer={InfoWindowContainer}
      locations={locations}
      setShowDrawer={setShowDrawer}
      setShowDrawerData={setShowDrawerData}
    />
  ) : null;
}
