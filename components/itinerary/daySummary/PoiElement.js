import { useState } from "react";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../../services/ga/Index";

export default function PoiElement(props) {
  const { pois, setViewMore } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [poi, setPoi] = useState(0);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = (e) => {
    setPoi(e.target.id);
    setShowDrawer(true);

    logEvent({
      action: "Details_View",
      params: {
        page: "Itinerary Page",
        event_category: "Click",
        event_value: pois[e.target.id].heading,
        event_action: "Day by Day Itinerary",
      },
    });
  };

  const hanldeSeeMore = () => {
    setViewMore(true);

    logEvent({
      action: "Navigation",
      params: {
        page: "Itinerary Page",
        event_category: "Button Click",
        event_label: "see more",
        event_action: "Day by Day Itinerary",
      },
    });
  };

  return (
    <Container className="pt-0">
      <div className="flex flex-col space-y-3 items-start w-full md:pl-2 lg:pl-2">
        <div className="flex flex-row items-center w-full">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="text-sm font-normal flex flex-row items-center flex-wrap gap-1 w-full">
            <span className="text-[14px] font-medium leading-[22px]">
              Explore:{" "}
            </span>
            {pois.map(
              (poi, index) =>
                index < 3 && (
                  <span
                    onClick={handleActivity}
                    key={index}
                    id={index}
                    className="cursor-pointer hover:text-blue border-2 rounded-full px-2 lg:px-3 md:px-3 py-1"
                  >
                    {poi.heading}
                  </span>
                )
            )}
            <span
              onClick={hanldeSeeMore}
              className="ml-2 text-blue hover:underline font-[600] text-[12px] leading-[22px] cursor-pointer"
            >
              {pois.length > 3 ? "1+ more" : "see more"}
            </span>
          </div>
        </div>
      </div>

      <POIDetailsDrawer
        itineraryDrawer
        show={showDrawer}
        iconId={
          pois[poi]?.poi?.id ? pois[poi]?.poi?.id : pois[poi]?.activity_data?.id
        }
        handleCloseDrawer={handleCloseDrawer}
        name={pois[poi].heading}
        image={pois[poi].image}
        text={pois[poi].text}
        Topheading={"Select Our Point Of Interest"}
      />
    </Container>
  );
}
