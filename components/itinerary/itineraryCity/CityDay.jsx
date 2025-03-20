import { useEffect, useState } from "react";
import SlabElement from "./SlabElement";
import media from "../../media";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";

const CityDay = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [elements, setElements] = useState([]);

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
       
        {isPageWide ? <span> {convertDateFormat(props?.day?.date)}</span> : <span>, {convertDateFormat(props?.day?.date)}</span>}
        <span className="text-[#ABABAB] font-normal"> (Day {props.index + 1})</span>
        
        {/* {elements.map((element, index) => (
          <>
            
            <div className="w-16 flex flex-col items-center py-4">
              <span className="text-xs text-gray-500">10:30 AM</span>
              <div className="h-6 w-6 flex items-center justify-center mt-1">
                <RiTimeLine className="text-gray-400" size={18} />
              </div>
            </div>
          </>
        ))} */}
        {/* <div className="flex flex-col items-center mt-1">
  {isPageWide && elements.map((time, index) => (
    <div key={index} className="flex items-start">
      {/* Left Section - Clock + Vertical Line */}
      {/* <div className="flex flex-col items-center"> */}
        {/* Clock Icon */}
        {/* <div className="h-6 w-6 flex items-center justify-center">
          <RiTimeLine className="text-gray-400" size={25} />
        </div> */}

        {/* Vertical Line (except for last item) */}
        {/* {index !== elements.length - 1 && (
          <div
          style={{
            width: "2px",
            height: "4.5rem",
            backgroundImage:
        "repeating-linear-gradient(transparent 0px, transparent 6px, gray 6px, gray 8px)",
            opacity: 0.5,
          }}
        ></div>
        )}
      </div>

      {/* Right Section - Time */}
      {/* <span className="ml-2 text-xs text-gray-500"></span>
    </div> */}
  {/* ))}  */}
{/* </div>  */}



      </div>

      <div className="flex flex-col p-3 md:w-[85%]">
        {elements.map((element, index) => (
          <>
            <SlabElement key={index} element={element} />

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
        setShowDrawer={setShowAddDrawer}
        cityName={props.city.name}
        cityID={props.city.id}
        date={props?.day?.date}
        setItinerary={props?.setItinerary}
        // day_slab_index={props?.indexDay}
        // getPaymentHandler={props?.getPaymentHandler}
        // getAccommodationAndActivitiesHandler={
        //   props?.getAccommodationAndActivitiesHandler
        // }
        // setShowLoginModal={props?.setShowLoginModal}
        // setItinerary={props?.setItinerary}
        // _GetInTouch={props._GetInTouch}
      ></ActivityAddDrawer>
    </div>
  );
};

export default CityDay;
