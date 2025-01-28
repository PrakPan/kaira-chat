import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";

const ItineraryCity = (props) => {
  const [viewMore, setViewMore] = useState(false);

  return (
    <div
      data-city-id={props.city.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-2 border-gray-200 rounded-t-lg flex flex-col"
    >
      <div className="flex items-center justify-between p-3 rounded-t-lg bg-[#FEFAD8] border-b-2">
        <div className={`md:text-[18px] font-semibold`}>
          {props.city.city.name}
          {" - "}
          {props.city.duration} {props.city.duration === 1 ? "Night" : "Nights"}
        </div>

        <button
          onClick={() => setViewMore((prev) => !prev)}
          className="flex items-center text-sm font-semibold"
        >
          {viewMore ? (
            <RiArrowDropUpLine className="text-3xl" />
          ) : (
            <RiArrowDropDownLine className="text-3xl" />
          )}
        </button>
      </div>

      {viewMore ? (
        <CityDaybyDay city={props.city} />
      ) : (
        <CitySummary city={props.city} setViewMore={setViewMore} />
      )}
    </div>
  );
};

export default ItineraryCity;
