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
    <div className="flex flex-col gap-3 mt-5 max-w-[60vw]">
      <h1 className="text-[#262626] text-3xl font-bold cursor-pointer group transition duration-300 max-w-fit">
        Day By Day Itinerary
        <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </h1>

      <CityNavigation cities={cities} cityRefs={cityRefs} />

      <div className="flex flex-col gap-[80px]">
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
