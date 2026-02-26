import React from "react";
import HotelInfo from "./HotelInfo";
import { Route } from "../types";
import DayByDay from "./DayByDay"


interface CitySectionProps {
  route: Route;
}

const CitySection: React.FC<CitySectionProps> = ({ route }) => {
  return (
    <>
      {/* City Header */}
      <div className="flex flex-col items-start gap-1 p-3 bg-[#FFF5EF] rounded-t-lg">
        <div className="flex items-center gap-1">
          {/* <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              backgroundColor: route.city.accent || "#4285F4",
            }}
          /> */}
          <h2 className="text-[18px] font-semibold mb-0">
            {route.city.name}
          </h2>
          <span className="text-[18px] font-semibold">
           - {route.city.duration}{" "}
            {route.city.duration === 1 ? "Night" : "Nights"}
          </span>
        </div>

        {route.hotels && <HotelInfo hotelName={route.hotels} />}
      </div>

      {/* Day by Day Itinerary */}
      <div className="border border-t-0 border-[#E8E8E8] rounded-b-lg overflow-hidden">
        {route.day_by_day?.map((day, dayIndex) => (
          <DayByDay
            key={day.date}
            day={day}
            index={dayIndex}
            city={route.city}
            itinerary_city_id={route.city.id}
            isLastDay={dayIndex === route.day_by_day.length - 1}
            nextCity={undefined}
            intracityBookings={[]}
            finalized_status="FINALIZED"
          />
        ))}
      </div>
    </>
  );
};

export default CitySection;