import { useRouter } from "next/router";

export const useHandleClose = () => {
  const router = useRouter();

  return () => {
    const {
      drawer, bookingId, oItineraryCity, dItineraryCity,
      drawerType, transferType, doj, poi_id, type,
      dayIndex, index, itinerary_city_id, idx, date,
      city_id, booking, scroll, clickType, itineraryCityId,
      hotel_duration, check_in, check_out, city_name,
      ...restQuery
    } = router.query;

    router.push(
      { pathname: router.pathname, query: restQuery },
      undefined,
      { scroll: false }
    );
  };
};