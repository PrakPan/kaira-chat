import { useState, useEffect } from "react";
import ImageLoader from "../../../components/ImageLoader";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { logEvent } from "../../../services/ga/Index";

export default function ActivityCard(props) {
  const [show, setShow] = useState(false);
  const [stars, setStars] = useState(null);

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
      onClick={handleActivityClick}
      className="cursor-pointer p-2 border-2 rounded-xl gap-3 flex flex-col mx-1 hover:border-yellow-300"
    >
      <div className="">
        <ImageLoader
          url={props?.data?.image}
          dimensions={{ width: 500, height: 250 }}
          dimensionsMobile={{ width: 500, height: 250 }}
          borderRadius="10px"
          noLazy
          hoverpointer
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-lg font-semibold line-clamp-2">
          {props?.data?.name}
        </div>
        {stars && (
          <span className="flex flex-row items-center gap-1 text-sm text-[#7a7a7a]">
            <span className="flex flex-row text-[#FFD201]">{stars}</span>
            <span className="">{props.data?.rating} . </span>
            <span className="underline">
              {props?.data?.user_ratings_total} user reviews
            </span>
          </span>
        )}
        <div className="text-[14px] font-[300] line-clamp-3">
          {props?.data?.short_description}
        </div>
        <div className="text-[14px] font-[300] text-gray-500">...more</div>
      </div>
      {props?.data?.cost ? (
        <div className="flex flex-col">
          <div className="flex flex-row items-center text-[20px] font-bold">
            {getIndianPrice(props.data.cost)}
            <span className="text-[12px] font-[400] ml-2">per person*</span>
          </div>
          <div className="text-sm font-light text-gray-600">
            Excluding applicable taxes
          </div>
        </div>
      ) : null}
      <POIDetailsDrawer
        show={show}
        ActivityiconId={props.data.id}
        handleCloseDrawer={handleCloseDrawer}
        name={props.data.name}
      />
    </div>
  );
}
