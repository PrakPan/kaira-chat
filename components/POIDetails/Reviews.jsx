import React, { useState } from "react";
import GoogleImageLoader from "../drawers/poiDetails/GoogleImageLoader";

const ReviewPoi = ({ review }) => {
  const [viewMore, setViewMore] = useState(false);
  return (
<<<<<<< HEAD
    <div className="w-full border rounded-[10px] p-[12px] min-w-[289px]">
      <div className="w-[39px]">
        <GoogleImageLoader
          url={review?.profile_photo_url}
          width={"39px"}
          height={"40px"}
          noLazy
        />
      </div>
      <div className="text-[16px]">{review?.author_name}</div>
      <div>
        <span style={{ color: "#FFD201" }}>★</span>{" "}
        <span className="text-[12px]">{review?.rating}</span>
      </div>
      <div className="text-[12px]">
        {viewMore ? (
          <>
            {review?.text}{" "}
            <div
              className="font-bold cursor-pointer"
              onClick={() => setViewMore(false)}
            >
              See less
            </div>
          </>
        ) : (
          <>
            {review?.text.slice(0, 150)}...
            {review?.text.length > 150 && (
              <div
                className="font-bold cursor-pointer"
                onClick={() => setViewMore(true)}
              >
                View more
              </div>
            )}
          </>
        )}
=======
    <div className="w-[289px] h-[208px] border rounded-[10px] p-[12px]">
      <div className="w-[39px]"><GoogleImageLoader
        url={review?.profile_photo_url}
        width={"39px"}
        height={"40px"}
        noLazy
      />
      </div>
      <div className="text-[16px]">{review?.author_name}</div>
      <div>
        <span style={{ color: "#FFD201" }}>★</span> <span className="text-[12px]">{review?.rating}</span>
      </div>
      <div>
      {viewMore ? (
        <div className="text-[12px] h-[72px] overflow-y-auto">
          {review?.text}{" "}
          <div className="font-bold cursor-pointer" onClick={()=>setViewMore(false)}>See less</div>
        </div>
      ) : (
        <div className="text-[12px]">
          {review?.text.slice(0, 150)}{" "}
          <div className="font-bold cursor-pointer h-[72px] overflow-auto" onClick={()=>setViewMore(true)}>View more</div>
        </div>
      )}
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ReviewPoi;
=======
export default ReviewPoi;
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
