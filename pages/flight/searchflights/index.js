import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
const SearchFlights = () => {
    const router = useRouter();
    useEffect(() => {   
        const FetchResults = async () => {
            const res=await axios.post("https://dev.mercury.tarzanway.com/api/v1/transfers/flight/search/",{
                    "adultCount": Number(adults),
                    "childCount": Number(children),
                    "infantCount": Number(infants),
                    "directFlight": "true",
                    "journeyType":"1",
                    "origin": from,
                    "destination": to,
                    "preferredDepartureTime": departure+"T00:00:00",
                    "flightCabinClass": Number(flightCabinClass),
            });
            console.log(res)
            }
            FetchResults()
    },[]);
    const { tripType,from,to ,departure,adults,children,infants,flightCabinClass} = router.query;
    return (
        <div>
        <h1>Search Flights</h1>
        </div>
    );
    }

export default SearchFlights;