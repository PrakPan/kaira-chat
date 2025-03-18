import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import ItineraryCity from "../../components/itinerary/itineraryCity";
import CityItem from "./VerticalLayout";
import media from "../../components/media";
import Drawer from "../../components/ui/Drawer";

const CITY_COLOR_CODES = [
  "#359EBF", // shade of blue
  "#F0C631", // shade of yellow
  "#BF3535", // shade of red
  "#47691e", // shade of green
  "#cc610a", // shade of orange
  "#008080", // shade of teal
  "#7d5e7d", // shade of purple
];

const DaybyDay = ({ itineraryDaybyDay, transferBookings ,width,setItinerary,activityBookings,setActivityBookings,itinerary}) => {
  let isPageWide = media("(min-width: 768px)");
  console.log("Inside DaybyDay Itinerary",itinerary);
  const cityRefs = useRef({});
  let startCity = itineraryDaybyDay?.start_city;
  let endCity = itineraryDaybyDay?.end_city;

  useEffect(() => {
    let array = [];

    for (const city of itineraryDaybyDay?.cities) {
      array.push({
        id: city.id,
        name: city.city.name,
        duration: city.duration,
      });
    }

  }, [itineraryDaybyDay]);

  return (
    <div className={`flex flex-col gap-3 mt-5 ${!isPageWide ? "max-w-fit" : "max-w-[54vw]"}`}>
      <h1 className="text-[#262626] text-3xl font-bold cursor-pointer group transition duration-300 max-w-fit">
        Day By Day Itinerary
        <span className="mt-1 block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-[#262626]"></span>
      </h1>

      {/* to navigate between cities in frontend */}
      {/* <CityNavigation cities={cities} cityRefs={cityRefs} /> */}

      <div className="flex flex-col">
        <CityItem
          key={startCity?.place_id}
          city={startCity?.city_name}
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          downPresent={false}
          upPresent={false}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
        />
        <CityItem
          key={startCity?.gmaps_place_id}
          bookingIdToDelete={startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id}
          city={
            transferBookings?.intercity?.[
              startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
            ]?.name
          }
          duration={
            transferBookings?.intercity?.[
              startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
            ]?.duration
          }
          booking_type={
            transferBookings?.intercity?.[
              startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
            ]?.booking_type
          }
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          downPresent={true}
          upPresent={true}
          booking_id={transferBookings?.intercity?.[
            startCity?.gmaps_place_id + ":" + itineraryDaybyDay?.cities[0]?.id
          ]?.id}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
          origin_city_id={startCity?.gmaps_place_id || startCity?.city_id}
          destination_city_id={itineraryDaybyDay?.cities[0]?.city?.id}
          origin_city_name={startCity?.city_name}
          destination_city_name={itineraryDaybyDay?.cities[0]?.city?.name}
        />
        {itineraryDaybyDay?.cities.map((city, index) => {
          var idMapping =
            city?.id + ":" + itineraryDaybyDay?.cities[index + 1]?.id;
          return (
            <>
              <ItineraryCity key={city.id} city={city} cityRefs={cityRefs} setItinerary={setItinerary} activityBookings={activityBookings} setActivityBookings={setActivityBookings}/>
              {index != itineraryDaybyDay?.cities.length - 1 && (
                <div>
                  <CityItem
                    mercury
                    bookingIdToDelete={idMapping}
                    key={city.id}
                    city={transferBookings?.intercity?.[idMapping]?.name}
                    duration={
                      transferBookings?.intercity?.[idMapping]?.duration
                    }
                    booking_type={
                      transferBookings?.intercity?.[idMapping]?.booking_type
                    }
                    pinColour={CITY_COLOR_CODES[index % 7]}
                    onClick={() => alert(`Clicked`)}
                    upPresent={true}
                    downPresent={true}
                    booking_id={transferBookings?.intercity?.[idMapping]?.id}
                    width={width}
                    length={itineraryDaybyDay?.cities?.length}
                    origin_city_id={city?.city?.id}
                    destination_city_id={itineraryDaybyDay?.cities[index + 1]?.city?.id}
                    origin_city_name={city?.city?.name}
                    destination_city_name={itineraryDaybyDay?.cities[index + 1]?.city?.name}
                  />
                </div>
              )}
            </>
          );
        })}
        <CityItem
          key={endCity?.gmaps_place_id}
          city={
            transferBookings?.intercity?.[
              itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]
                ?.id +
                ":" +
                endCity?.gmaps_place_id
            ]?.name
          }
          booking_type={
            transferBookings?.intercity?.[
              itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]
                ?.id +
                ":" +
                endCity?.gmaps_place_id
            ]?.booking_type
          }
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          upPresent={true}
          downPresent={true}
          booking_id={transferBookings?.intercity?.[
            itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]
              ?.id +
              ":" +
              endCity?.gmaps_place_id
          ]?.id}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
          origin_city_id={itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]?.city?.id}
          destination_city_id={endCity?.gmaps_place_id}
          origin_city_name={itineraryDaybyDay?.cities[itineraryDaybyDay?.cities.length - 1]?.city?.name}
          destination_city_name={endCity?.city_name}
        />
        <CityItem
          key={endCity?.place_id}
          city={endCity?.city_name}
          pinColour={CITY_COLOR_CODES[0 % 7]}
          onClick={() => alert(`Clicked`)}
          downPresent={false}
          upPresent={false}
          width={width}
          length={itineraryDaybyDay?.cities?.length}
        />
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
