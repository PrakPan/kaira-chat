import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Flight from "../../../components/modals/flights/new-flight-searched/Index";
import { FilterComponent } from "../../../components/flights/filterComponent";
import Layout from "../../../components/Layout";
import FlightSearchSmall from "../../../components/flights/flightSearchSmall";
import { Container } from "../../../components/modals/flights/new-flight-searched/FlightStyles";
import { MERCURY_HOST } from "../../../services/constants";
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
    returnDate
  } = router.query;
  const [filters, setFilters] = useState({
    price_order: "",
    duration_order: "",
    departure_time_period: "",
    arrival_time_period: "",
    adults: Number(adults),
    children: Number(children),
    infants: Number(infants),
    flightCabinClass:1,
    tripType: tripType,
    from: from,
    to : to,
    departure: departure,
    returnDate: returnDate,
    applyFilter:false
  });

  useEffect(() => {
    if (!router.isReady) return; // Wait until router is ready
    console.log("query is",router.query)
    const FetchResults = async () => {
      try {
        const res = await axios.post(
          `${MERCURY_HOST}/api/v1/transfers/flight/search/`,
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
          },
          {
            params: {
              price_order: filters.price_order,
              duration_order: filters.duration_order,
              departure_time_period: filters.departure_time_period,
              arrival_time_period: filters.arrival_time_period,
            },
          }
        );
        localStorage.setItem(res.data?.provider+"_trace_id",res.data?.trace_id);

        if (res.data?.results.length) {
          let options = res.data.results.map((flightData) => (
            <Flight
              data={flightData}
              isSelected={false}
              provider={res.data?.provider}
            />
          ));
          setResults(options);
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };
    setFilters((prev) => {
      return {
        ...prev,
        adults: Number(adults),
        children: Number(children),
        infants: Number(infants),
        flightCabinClass: Number(flightCabinClass),
        tripType: tripType,
        from: from,
        to : to,
        departure: departure,
        returnDate: returnDate
      };
    });
    console.log(flightCabinClass);

    FetchResults();
  }, [router.isReady,router.query]);
  useEffect(() => {
    const FetchResults = async () => {
      try {
        const res = await axios.post(
          `${MERCURY_HOST}/api/v1/transfers/flight/search/`,
          {
            adult_count: Number(filters.adults),
            child_count: Number(filters.children),
            infant_count: Number(filters.infants),
            direct_flight: "true",
            journey_type: "1",
            origin: from,
            destination: to,
            preferred_departure_time: departure + "T00:00:00",
            flight_cabin_class: Number(filters.flightCabinClass),
          },
          {
            params: {
              price_order: filters.price_order,
              duration_order: filters.duration_order,
              departure_time_period: filters.departure_time_period,
              arrival_time_period: filters.arrival_time_period,
            },
          }
        );
        localStorage.setItem(res.data?.provider+"_trace_id",res.data?.trace_id);

        if (res.data?.results.length) {
          let options = res.data.results.map((flightData) => (
            <Flight
              data={flightData}
              isSelected={false}
              provider={res.data?.provider}
            />
          ));
          setResults(options);
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    };

    FetchResults();
  }, [filters.price_order, filters.duration_order,filters.applyFilter]);

  return (
    <Layout page="Flights">        
    {router.isReady&&<FlightSearchSmall input={filters} setInput={setFilters}/>}

      <Container className="font-lexend">
        <div className="grid grid-cols-[auto,1fr] gap-2">
          {/* left sorted filters */}
          <div>
            <FilterComponent input={filters} setInput={setFilters} />
          </div>
          <div>
            <div className="flex justify-end items-center">
              <div className="bg-white border rounded-lg flex gap-2 items-center justify-center p-1 mb-2 shadow-md">
                <label className="text-gray-700 font-medium">Sort by</label>
                <select
                  className="bg-transparent px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setFilters({
                        ...filters,
                        price_order: "",
                        duration_order: "",
                      });
                    } else if (value === "price") {
                      setFilters({
                        ...filters,
                        price_order: "asc",
                        duration_order: "",
                      });
                    } else if (value === "duration") {
                      setFilters({
                        ...filters,
                        duration_order: "asc",
                        price_order: "",
                      });
                    }
                  }}
                >
                  <option value="">None</option>
                  <option value="price">Price</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            <div>{results}</div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default SearchFlights;
