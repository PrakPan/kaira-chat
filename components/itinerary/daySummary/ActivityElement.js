import { use, useState } from "react";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import { Link } from "react-scroll";

export default function ActivityElement(props) {
  const { activities } = props;
  const [show, setShow] = useState(false);
  const [activity, setActivity] = useState(0);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const handleActivity = (e) => {
    setActivity(e.target.id);
    setShow(true);
  };

  return (
    <Container className="pt-0">
      <div className=" flex flex-row items-center w-full md:pl-2 lg:pl-2">
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
      <POIDetailsDrawer
        itineraryDrawer
        show={show}
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
