import { useState, useEffect } from "react";
import ImageLoader from "../../../components/ImageLoader";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { logEvent } from "../../../services/ga/Index";
import H8 from "../../../components/heading/H8";
import { DestinationCard } from "../../../components/revamp/common/components/card";

export default function ActivityCard(props) {
  const [show, setShow] = useState(false);
  const [stars, setStars] = useState(null);
  const [hover, setHover] = useState(false);
  const activityData = {
    type: "activity",
    id: props.dataid
  }

  useEffect(() => {
    if (props?.data && props.data?.rating) {
      const stars = [];
      for (let i = 0; i < Math.floor(props.data.rating); i++) {
        stars.push(<FaStar />);
      }
      if (Math.floor(props.data.rating) < props.data.rating) {
        stars.push(<FaStarHalfAlt />);
      }
      setStars(stars);
    }
  }, [props?.data]);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const handleActivityClick = (e) => {
    setShow(true);
    logEvent({
      action: "Details_View",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_value: props?.data?.name,
        event_action: `Things to do in ${props?.city}`,
      },
    });
  };

  return (
    <div
    >
      <DestinationCard
        title={props?.data?.display_name || props?.data?.name}
        description={props?.data?.short_description}
        one_liner_description={props?.data?.one_liner_description}
        height="280px"
        image={props?.data?.image}
        rating={props.data?.rating}
        reviewCount={props?.data?.user_ratings_total}
        showImageText={false}
        total_price={props?.data?.pricing?.total_price}
        onClick={() => handleActivityClick()}
      />

      <POIDetailsDrawer
        show={show}
        ActivityiconId={props.data.id}
        handleCloseDrawer={handleCloseDrawer}
        name={props.data.name}
        removeDelete={props?.removeDelete}
      // activityData={activityData}
      >
        {props.setEnquiryOpen ? (
          <button
            onClick={(e) => {
              props.setEnquiryOpen(true)
              handleCloseDrawer(e)
            }
            }
            className="md:text-lg font-medium text-black bg-[#F7E700] px-4 py-2 rounded-full">Schedule a Callback Now!</button>
        ) : null}
      </POIDetailsDrawer>
    </div>
  );
}
