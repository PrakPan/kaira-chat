import { useSelector } from "react-redux";
import CityDay from "./CityDay";

const CityDaybyDay = (props) => {
  return (
    <div className="flex flex-col">
      {props.city?.day_by_day.map((day, index) => (
        <>
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
          />
        </>
      ))}
    </div>
  );
};

export default CityDaybyDay;
