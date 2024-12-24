import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import CitySummary from "./CitySummary";
import CityDaybyDay from "./CityDaybyDay";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";
import { getYear } from "../../../helper/DateUtils";

const ItineraryCity = (props) => {
  const [viewMore, setViewMore] = useState(false);

  return (
    <div
      data-city-id={props.city.id}
      ref={(el) => (props.cityRefs.current[props.city.id] = el)}
      className="border-1 border-gray-200 p-3 rounded-lg flex flex-col space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className={`${viewMore ? "md:text-lg font-bold" : "text-base font-semibold"}`}>
          {convertDateFormat(props.city.start_date)},{" "}
          {getYear(props.city.start_date)} - {props.city.city.name}
        </div>

        <button
          onClick={() => setViewMore((prev) => !prev)}
          className="flex items-center text-sm font-semibold hover:text-white hover:bg-black py-1 px-2 rounded-lg"
        >
          {viewMore ? (
            <>
              View Less
              <RiArrowDropUpLine className="text-2xl" />
            </>
          ) : (
            <>
              View More
              <RiArrowDropDownLine className="text-2xl" />
            </>
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
