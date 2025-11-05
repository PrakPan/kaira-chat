import RoutesMap from '../../../containers/itinerary/breif/RoutesMap';
function renderRoutesMapSection({ isDesktop, containerHeight, routes, destinationChanges, key }) {
  console.log("routes is: ", routes)
  return (
    <div
      key={key}
      className={`w-full  flex flex-col gap-3 items-center h-[260px] md:h-[380px] ${
        isDesktop ? `sm:h-[${containerHeight}px]` : "mb-4"
      }`}
    >
      <div className="flex-1 h-full w-full" style={{ pointerEvents: 'auto', touchAction: 'manipulation' }}>
        <RoutesMap key={`routesmap-${key}`} locations={routes.slice(1, routes.length - 1)} />
      </div>

    </div>
  );
}


export default renderRoutesMapSection