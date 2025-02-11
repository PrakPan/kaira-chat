import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Flight from "../../../components/modals/flights/new-flight-searched/Index";

const SearchFlights = () => {
  const router = useRouter();
  const [results, setResults] = useState([]);

  const {
    tripType,
    from,
    to,
    departure,
    adults,
    children,
    infants,
    flightCabinClass,
  } = router.query;

  useEffect(() => {
    const FetchResults = async () => {
      try {
        const res = await axios.post(
          "https://mercury.tarzanway.com/api/v1/transfers/flight/search/",
          {
            adult_count: Number(adults),
            child_count: Number(children),
            infant_count: Number(infants),
            direct_flight: "true",
            journey_type: "1",
            origin: from,
            destination: to,
            preferred_departure_time: departure + "T00:00:00",
            flight_cabin_class: Number(flightCabinClass),
          }
        );

        if (res.data?.results.length) {
          let options = [];
          for (var i = 0; i < res.data.results.length; i++) {
            options.push(
              <Flight
                //   itinerary_id={props.itinerary_id}
                data={res.data.results[i]}
                //   selectedBooking={props.selectedBooking}
                //   _updateBookingHandler={_newUpdateBookingHandler}
                isSelected={false}
                provider={res.data?.provider}
                //   filtersState={filtersState}
              ></Flight>
            );
          }
          setResults(options);
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };

    FetchResults();
  }, []);

  return (
    <div>
      <h1>Search Flights</h1>

      <div>{results}</div>
    </div>
  );
};

export default SearchFlights;
