import { useEffect, useState } from "react";
import SlabElement from "./SlabElement";
import media from "../../media";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { useSelector } from "react-redux";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]); 
  const {finalized_status} = useSelector(state=>state.ItineraryStatus);
  useEffect(() => {
    let elements = [];
    for (let elem of props.day.slab_elements) {
      if (["activity", "recommendation"].includes(elem.element_type)) {
        elements.push(elem);
      }
    }

    setElements(elements);
  }, [props.day?.slab_elements]);

  function convertDateFormat(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const matchingIntracityBookings = props?.intracityBookings?.filter((booking) => {
  const checkInDate = booking?.check_in?.split(" ")[0]; 
  return checkInDate === props?.day?.date;
});

  const formattedTaxiDetails = matchingIntracityBookings?.map((booking, index) => ({
  ...booking,
  id: booking.id,
  date: `Day ${index + 1}, ${new Date(booking.check_in).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  })}`,
  fromLocation: booking.transfer_details?.source?.name || 'Unknown Source',
  toLocation: booking.transfer_details?.destination?.name || 'Unknown Destination',
  passengers:
    booking.number_of_adults +
    booking.number_of_children +
    booking.number_of_infants,
  // duration: booking.transfer_details?.duration?.text || 'N/A',
}));
  return (
    <div id="cityday" className="flex flex-col md:flex-row md:border-b-2">
      <div
        className={`md:w-[20%] text-[14px] md:text-[16px] font-semibold py-2 px-1  md:border-r-2 md:text-center md:text-black bg-[#ECECEC] md:bg-white`}
      >
        {props?.day?.date &&
          (isPageWide ? (
            <span>{convertDateFormat(props?.day?.date)}</span>
          ) : (
            <span>{convertDateFormat(props?.day?.date)}</span>
          ))}
        <span className="text-[#ABABAB] font-normal">
          {" "}
          (Day {props.index + 1})
        </span>
      </div>

      <div className="flex flex-col p-3 md:w-[85%]">
        {elements.map((element, index) => (
          <>
            <SlabElement
              itinerary_city_id={props?.itinerary_city_id}
              key={index}
              element={element}
              dayIndex={props?.index}
              slabIndex={index}
              setShowLoginModal={props?.setShowLoginModal}
            />

            {index !== elements.length - 1 ? <hr /> : null}
          </>
        ))}

        {(finalized_status === "PENDING") ? 
         <div className="mt-3 w-48 h-[20px] bg-gray-300 rounded animate-pulse"></div> 
         :
         <button
          onClick={() => setShowAddDrawer(true)}
          className="mt-3  w-fit text-[14px] text-blue underline font-semibold"
        >
          + Add activities on {convertDateFormat(props?.day?.date)}
        </button>


}

        {matchingIntracityBookings && formattedTaxiDetails && (matchingIntracityBookings?.length > 0) && (
        <>
        <hr />
        <div className="text-sm font-normal flex flex-col gap-1 w-auto md:flex-row mt-2 b-2">
          <div className="text-[14px] font-medium leading-[22px] w-[80px]">
            Taxi:
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formattedTaxiDetails.map((taxi) => (
                <div key={taxi.id} className="flex flex-col hover:cursor-pointer hover:bg-[rgb(254_250_216)]">
                  <div className="text-[12px] text-gray-600 mb-1">
                    {taxi.date}
                  </div>
                  <div className="w-full h-px bg-gray-200 mb-2"></div>
                  <div className="text-[14px] font-medium text-black mb-1">
                    <span>{taxi?.name ? taxi.name : taxi.fromLocation + 'to' + taxi.toLocation}</span>
                  </div>
                  <div className="text-[12px] text-gray-600">
                    {taxi.passengers} passengers | Duration: {taxi.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
      )}
        {/* <div className="py-3">
          <button className="bg-[#F7E700] text-black text-sm font-normal py-1 px-3 rounded border-1 border-black">
            + Add Sightseeing Taxi
          </button>
        </div> */}
      </div>

      <ActivityAddDrawer
        showDrawer={showAddDrawer}
        mercuryItinerary={props?.mercuryItinerary}
        setShowDrawer={setShowAddDrawer}
        cityName={props.city.name}
        cityID={props.city.id}
        date={props?.day?.date}
        setItinerary={props?.setItinerary}
        itinerary_city_id={props?.itinerary_city_id}
        day={`Day ${props.index + 1}`}
        duration={props.duration}
        start_date={props?.start_date}
        day_slab_index={props?.index}
        setShowLoginModal={props?.setShowLoginModal}
        activityBookings={props?.activityBookings}
        setActivityBookings={props?.setActivityBookings}
      ></ActivityAddDrawer>
    </div>
  );
};

export default CityDay;
