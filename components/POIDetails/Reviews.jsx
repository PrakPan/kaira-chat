import React, { useState, useRef, useEffect } from "react";
import GoogleImageLoader from "../drawers/poiDetails/GoogleImageLoader";

const ReviewPoi = ({ review }) => {
  const [viewMore, setViewMore] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);
  const text = review?.text || "";

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight + 1);
  }, [text]);
  return (
    <div className="flex gap-[12px] w-full py-[16px] border-b border-[#e5e7eb] last:border-b-0">
      <div className="shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden">
        <GoogleImageLoader
          url={review?.profile_photo_url}
          width={"40px"}
          height={"40px"}
          noLazy
        />
      </div>
      <div className="flex flex-col gap-[2px] flex-1 min-w-0">
        <div className="ttw-type-body font-semibold text-[#0b1220]">
          {review?.author_name}
        </div>
        <div className="flex items-center gap-1">
          <span style={{ color: "#FFD201" }}>★</span>
          <span className="text-[12px]">{review?.rating}</span>
        </div>
        <div className="ttw-type-body text-[#475467]">
          <div ref={textRef} className={viewMore ? "" : "line-clamp-4"}>
            {text}
          </div>
          {(isClamped || viewMore) && (
            <span
              className="font-semibold cursor-pointer text-[#0b1220]"
              onClick={() => setViewMore((v) => !v)}
            >
              {viewMore ? "See less" : "View more"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPoi;
