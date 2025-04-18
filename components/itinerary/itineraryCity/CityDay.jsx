import { useEffect, useState } from "react";
import SlabElement from "./SlabElement";
import media from "../../media";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]); 
  console.log("updated itinerary is:",props.day.slab_elements) 
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

  return (
    <div className="flex flex-col md:flex-row md:border-b-2">
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

        <button
          onClick={() => setShowAddDrawer(true)}
          className="mt-3  w-fit text-[14px] text-blue underline font-semibold"
        >
          + Add activities on {convertDateFormat(props?.day?.date)}
        </button>

        <div className="py-3">
          <button className="bg-[#F7E700] text-black text-sm font-normal py-1 px-3 rounded border-1 border-black">
            + Add Sightseeing Taxi
          </button>
        </div>
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
