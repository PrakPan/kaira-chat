import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import ItineraryCity from "../../components/itinerary/itineraryCity";
import CityNavigation from "../../components/itinerary/itineraryCity/CityNavigation";

const DaybyDay = (props) => {
  const cityRefs = useRef({});
  const [cities, setCities] = useState([]);
  

  useEffect(() => {
    let array = [];

    for (const city of props.itineraryDaybyDay?.cities) {
      array.push({
        id: city.id,
        name: city.city.name,
        duration: city.duration,
      });
    }

    setCities(array);
  }, [props.itineraryDaybyDay]);

  return (
    <div className="flex flex-col gap-3 mt-5">
      <h1 className="text-[30px] font-bold">Day By Day Itinerary</h1>

      <CityNavigation cities={cities} cityRefs={cityRefs} />

      <div className="flex flex-col space-y-5">
        {props.itineraryDaybyDay?.cities.map((city) => (
          <ItineraryCity key={city.id} city={city} cityRefs={cityRefs} />
        ))}
      </div>
    </div>
  );
};

const mapStateToPros = (state) => {
  return {
    itineraryDaybyDay: state.ItineraryDaybyDay,
  };
};

export default connect(mapStateToPros)(DaybyDay);
