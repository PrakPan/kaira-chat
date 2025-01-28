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
      <div className="flex items-start justify-between p-3 rounded-t-lg bg-[#FEFAD8] border-b-2">
        <div className="space-y-1">
          <div className={`md:text-[18px] font-semibold`}>
            {props.city.city.name}
            {" - "}
            {props.city.duration}{" "}
            {props.city.duration === 1 ? "Night" : "Nights"}
          </div>

          {props.city.hotels && (
            <div className="flex flex-col gap-1">
              <div className="text-[14px] font-medium leading-0 underline">
                {props.city.hotels[0].name}
              </div>
              <div className="text-[12px]">
                {props.city.hotels[0].duration}
                {props.city.hotels[0].duration > 1 ? " Nights" : " Night"}
              </div>
            </div>
          )}
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
