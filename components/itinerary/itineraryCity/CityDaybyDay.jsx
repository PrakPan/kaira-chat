import CityDay from "./CityDay";

const CityDaybyDay = (props) => {
  return (
    <div id="citydaybyday" className="bg-[#FBFBFB]">
      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex border-b border-[#E8E8E8]">
          <div className="w-32 px-4 py-1 bg-[#F8F8F8] border-r border-[#E8E8E8]">
            <span className="text-sm font-medium">DAYS</span>
          </div>
          <div className="flex-1 px-4 py-1 bg-[#F8F8F8]">
            <span className="text-sm font-medium ">ACTIVITIES</span>
          </div>
        </div>

        {/* Table Body - Days */}
        {props.city?.day_by_day.map((day, index) => (
          <CityDay
            mercuryItinerary={props?.mercuryItinerary}
            key={day.slab_id}
            index={index}
            day={day}
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
          />
        ))}

      </div>
    </div>
  );
};

export default CityDaybyDay;