import { useSelector } from "react-redux";
import CityDay from "./CityDay";

const DayRowShimmer = () => (
  <div className="flex border-b border-[#E8E8E8] animate-pulse">
    {/* Date column */}
    <div className="w-20 md:w-24 px-2 md:px-4 py-3 md:py-4 border-r border-[#E8E8E8] flex items-start">
      <div className="h-3 bg-gray-200 rounded w-12" />
    </div>
    {/* Activities column */}
    <div className="flex-1 px-2 md:px-4 py-2 md:py-3 flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-4 bg-gray-100 rounded-full w-20" />
              <div className="h-3 bg-gray-100 rounded w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CityDaybyDay = (props) => {
  const { itinerary_status } = useSelector((state) => state.ItineraryStatus);

  return (
    <div id="citydaybyday">
      {itinerary_status === "PENDING" ? (
        [0, 1, 2, 3].map((i) => <DayRowShimmer key={i} />)
      ) : (
        props.city?.day_by_day.map((day, index) => (
          <CityDay
            mercuryItinerary={props?.mercuryItinerary}
            key={day.slab_id ?? `day-fallback-${index}`}
            index={index}
            day={day}
            cityId={props.city.city.id}
            city={props.city.city}
            setItinerary={props?.setItinerary}
            itinerary_city_id={props?.city?.id}
            duration={props.city.duration}
            start_date={props?.city?.start_date}
            setShowLoginModal={props?.setShowLoginModal}
            activityBookings={props?.activityBookings}
            setActivityBookings={props?.setActivityBookings}
            intracityBookings={props?.intracityBookings}
            getPaymentHandler={props?.getPaymentHandler}
            nextCity={props?.nextCity}
            isLastDay={index === props.city?.day_by_day.length - 1}
            setShowCityDrawer={props?.setShowCityDrawer}
            isInDrawer={true}
            isDraft={props?.isDraft}
          />
        ))
      )}
    </div>
  );
};

export default CityDaybyDay;