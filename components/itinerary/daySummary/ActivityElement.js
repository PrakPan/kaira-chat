import { use, useState } from "react";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import POIDetailsDrawer from "../../drawers/poiDetails/POIDetailsDrawer";
import POIAddDrawer from "../../drawers/poiDetails/poiAddDrawer";
import { convertDateFormat } from "../../../helper/ConvertDateFormat";

export default function ActivityElement(props) {
  const {
    activities,
    date,
    day_slab_index,
    itinerary_id,
    getPaymentHandler,
    getAccommodationAndActivitiesHandler,
    setShowLoginModal,
    setItinerary,
  } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
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
        <div className="flex flex-row items-center w-full">
          <div className="lg:w-[11%] md:w-[21%]"></div>
          <div className="flex w-full">
            {!props.payment?.is_registration_needed &&
              props.payment?.user_allowed_to_pay &&
              !props.payment.paid_user && (
                <button
                  onClick={() => setShowAddDrawer(true)}
                  className="text-sm font-normal text-blue-500 hover:underline"
                >
                  + Add Activity on {convertDateFormat(date)}
                </button>
              )}
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

      <POIAddDrawer
        showDrawer={showAddDrawer}
        setShowDrawer={setShowAddDrawer}
        cityName={activities[0]?.activity_data?.city?.name}
        cityID={activities[0]?.activity_data?.city?.id}
        date={date}
        itinerary_id={itinerary_id}
        day_slab_index={day_slab_index}
        getPaymentHandler={getPaymentHandler}
        getAccommodationAndActivitiesHandler={
          getAccommodationAndActivitiesHandler
        }
        setShowLoginModal={setShowLoginModal}
        setItinerary={setItinerary}
      ></POIAddDrawer>
    </Container>
  );
}
