import { useEffect, useState } from "react";
import SlabElement from "./SlabElement";
import media from "../../media";
import ActivityAddDrawer from "../../drawers/poiDetails/activityAddDrawer";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";

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

  return (
    <div className="flex flex-col md:flex-row md:border-b-2">
      <div
        className={`md:w-[15%] text-[14px] md:text-[16px] font-semibold py-2 px-1  md:border-r-2 md:text-center md:text-[#7A7A7A] bg-[#ECECEC] md:bg-white`}
      >
        Day {props.index + 1}
        {isPageWide ? <span>, {convertDateFormat(props?.day?.date)}</span> : <span>, {convertDateFormat(props?.day?.date)}</span>}
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
          className="mt-3 ml-4 w-fit text-[14px] text-blue underline font-semibold"
        >
          +Add activities
        </button>
      </div>

      <ActivityAddDrawer
        showDrawer={showAddDrawer}
        setShowDrawer={setShowAddDrawer}
        cityName={props.city.name}
        cityID={props.city.id}
        // date={props?.Days?.date}
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
