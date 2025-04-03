import React from "react";
import GoogleImageLoader from "../drawers/poiDetails/GoogleImageLoader";
import { PiStarThin } from "react-icons/pi";

const ReviewComponent = ({ review }) => {
  return (
    <div className="p-4 w-[250px] h-[250px] border-2">
      <div className="flex gap-2">
        <GoogleImageLoader
          url={review?.profile_photo_url}
          width={"65px"}
          height={"65px"}
          noLazy
        />
        <div className="flex flex-col h-fit">
          <div className="text-white text-xl flex gap-2">
            {Array.from({ length: review?.rating }).map((_, i) => (
              <span key={i} className="bg-orange-500 rounded-md">★</span>
            ))}
            <span className="">
              {Array.from({ length: 5 - review?.rating }).map((_, i) => (
                <span key={i} className="bg-gray-400 ">☆</span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReviewComponent;
