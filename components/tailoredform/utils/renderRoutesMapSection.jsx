import RoutesMap from '../../../containers/itinerary/breif/RoutesMap';
import { FaInfoCircle } from "react-icons/fa";
function renderRoutesMapSection({ isDesktop, containerHeight, routes, destinationChanges }) {
  return (
    <div
      className={`w-full sm:w-[50%] flex flex-col gap-3 items-center h-[600px] ${
        isDesktop ? `sm:h-[${containerHeight}px]` : "mb-4"
      }`}
    >
      <div className="flex-1 h-full w-full">
        <RoutesMap locations={routes} />
      </div>

      {destinationChanges && (
        <div className="flex flex-row items-center gap-2">
          <FaInfoCircle className="text-2xl text-yellow-500" />
          <div className="text-sm">Changes to be saved</div>
        </div>
      )}
    </div>
  );
}


export default renderRoutesMapSection