import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Flight from "../../../components/modals/flights/new-flight-searched/Index";
import { FilterComponent } from "../../../components/flights/filterComponent";
import Layout from "../../../components/Layout";
import FlightSearchSmall from "../../../components/flights/flightSearchSmall";
import { Container } from "../../../components/modals/flights/new-flight-searched/FlightStyles";
import { MERCURY_HOST } from "../../../services/constants";
import NewHotelBooking from "../../../components/modals/bookingupdated/new-accommodation-searched/NewHotelBooking";
const SearchHotels = () => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const { city, checkIn, checkOut, ppl, price } = router.query;

  const [input, setInput] = useState([]);

  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready
    console.log("query is", router.query);
    const FetchResults = async () => {
      try {
        const occupancies = ppl.split("t");
        const num_adults = occupancies[0];
        var child_ages = [];
        if (occupancies[1] > 0) {
          child_ages = occupancies.slice(2);
        }
        const priceRange = price.split("t");
        const res = await axios.post(`${MERCURY_HOST}/api/v1/hotels/search/`, {
          check_in: checkIn,
          check_out: checkOut,
          city_id: city,
          occupancies: [
            {
              num_adults: Number(num_adults),
              child_ages: child_ages,
            },
          ],
          filter_by: {
            price_lower_range: Number(priceRange[0]),
            price_upper_range: Number(priceRange[1]),
          },
        });
        setInput(res?.data?.data);
        console.log("data from response is", res?.data?.data);
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };

    FetchResults();
  }, [router.isReady, router.query]);

  return (
    <Layout page="Flights">
      {router.isReady && (
        <>
          {input.length != 0 &&
            input.map((item) => <NewHotelBooking booking={item} />)}
        </>
      )}
    </Layout>
  );
};

export default SearchHotels;
