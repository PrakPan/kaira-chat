import React, { useState } from "react";
import GoogleImageLoader from "../drawers/poiDetails/GoogleImageLoader";

const ReviewPoi = ({ review }) => {
  const [viewMore, setViewMore] = useState(false);
  return (
    <div className="w-[289px] border rounded-[10px] p-[12px]">
      <GoogleImageLoader
        url={review?.profile_photo_url}
        width={"39px"}
        height={"40px"}
        noLazy
      />
      <div className="text-[16px]">{review?.author_name}</div>
      <div>
        <span style={{ color: "#FFD201" }}>★</span> <span className="text-[12px]">{review?.rating}</span>
      </div>
      {viewMore ? (
        <div className="text-[12px] h-[72px] overflow-y-auto">
          {review?.text}{" "}
          <span className="font-bold cursor-pointer" onClick={()=>setViewMore(false)}>See less</span>
        </div>
      ) : (
        <div className="text-[12px]">
          {review?.text.slice(0, 150)}{" "}
          <span className="font-bold cursor-pointer h-[72px] overflow-auto" onClick={()=>setViewMore(true)}>View more</span>
        </div>
      )}
    </div>
  );
};

export default ReviewPoi;
