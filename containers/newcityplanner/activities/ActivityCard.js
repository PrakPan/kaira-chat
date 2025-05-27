import { useState, useEffect } from "react";
import ImageLoader from "../../../components/ImageLoader";
import POIDetailsDrawer from "../../../components/drawers/poiDetails/POIDetailsDrawer";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { getIndianPrice } from "../../../services/getIndianPrice";
import { logEvent } from "../../../services/ga/Index";
import H8 from "../../../components/heading/H8";

export default function ActivityCard(props) {
  const [show, setShow] = useState(false);
  const [stars, setStars] = useState(null);
  const [hover, setHover] = useState(false);

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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="h-[420px] group relative cursor-pointer p-2 border-2 rounded-xl gap-3 flex flex-col mx-1 hover:border-yellow-300"
    >
      <div
        className={`absolute transition w-fit flex place-self-center bottom-[60%] z-50 bg-gray-200 px-2 py-1 rounded-md drop-shadow-2xl text-sm ${hover ? "opacity-100" : "opacity-0"
          } `}
      >
        {props?.data?.name}
      </div>

      <div className="h-[45%]">
        <ImageLoader
          url={props?.data?.image}
          dimensions={{ width: 500, height: 250 }}
          dimensionsMobile={{ width: 500, height: 250 }}
          borderRadius="10px"
          noLazy
          hoverpointer
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="">
          <H8
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props?.data?.name}
          </H8>
        </div>

        <div className="w-full">
          {stars && (
            <span className="flex flex-row items-center gap-1 text-sm text-[#7A7A7A]">
              <span className="flex flex-row gap-1 text-[#FFD201]">
                {stars}
              </span>
              <span className="text-[12px] font-normal">
                {props.data?.rating}
                {` (${props?.data?.user_ratings_total})`}
              </span>
            </span>
          )}
        </div>

        <div className="text-[14px] font-[400] line-clamp-3">
          <div>{props?.data?.short_description}</div>
        </div>
      </div>

      {props?.data?.cost ? (
        <div className="flex flex-col">
          <div className="flex flex-row items-center text-[20px] font-bold">
            ₹{getIndianPrice(props.data.cost)}/-
            <span className="text-[12px] font-[400] ml-2">per person</span>
          </div>
          <div className="text-[12px] font-light text-[#7A7A7A]">
            Excluding applicable taxes
          </div>
        </div>
      ) : null}

      <POIDetailsDrawer
        show={show}
        ActivityiconId={props.data.id}
        handleCloseDrawer={handleCloseDrawer}
        name={props.data.name}
        removeDelete={props?.removeDelete}
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
