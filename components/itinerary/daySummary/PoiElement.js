import { useState } from "react";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";

export default function PoiElement(props) {
  const { activities } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [activity, setActivity] = useState(0);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShowDrawer(false);
  };

  const handleActivity = (e) => {
    setActivity(e.target.id);
    setShowDrawer(true);
  };

  return (
    <Container className="pt-0">
      <div className="flex flex-col space-y-3 items-start w-full md:pl-2 lg:pl-2">
        <div className="flex flex-row items-center w-full">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="text-sm font-normal flex flex-wrap gap-1 w-full">
            <span>Explore</span>
            {activities.map((activity, index) => (
              <span
                onClick={handleActivity}
                key={index}
                id={index}
                className="cursor-pointer hover:text-blue-500"
              >
                {activity.heading}
                {index < activities.length - 1 && ","}
              </span>
            ))}
          </div>
        </div>
      </div>

      <POIDetailsDrawer
        itineraryDrawer
        show={showDrawer}
        iconId={
          activities[activity]?.poi?.id
            ? activities[activity]?.poi?.id
            : activities[activity]?.activity_data?.id
        }
        ActivityiconId={activities[activity]?.activity?.id}
        handleCloseDrawer={handleCloseDrawer}
        name={activities[activity].heading}
        image={activities[activity].image}
        text={activities[activity].text}
        Topheading={"Select Our Point Of Interest"}
      />
    </Container>
  );
}
