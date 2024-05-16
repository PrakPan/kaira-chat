import React, { useState } from "react";
import ImageLoader from "../../../components/ImageLoader";
import SkeletonCard from "../../../components/ui/LoadingLottie";
import useMediaQuery from "../../../components/media";

const CityDetails = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [imageLoading, setImageLoading] = useState(true);
  return (
    <div className="px-3 w-[100vw] lg:w-[35vw]">
      <div style={imageLoading ? { display: "none" } : { display: "initial" }}>
        <ImageLoader
          borderRadius="8px"
          marginTop="23px"
          widthMobile="100%"
          url={data.image}
          dimensionsMobile={{ width: 500, height: 280 }}
          dimensions={{ width: 468, height: 188 }}
          onload={() => {
            setImageLoading(false);
          }}
        ></ImageLoader>
      </div>
      {imageLoading && (
        <SkeletonCard width={isDesktop ? "468px" : "100%"} height={"188px"} />
      )}
      <div className="font-bold text-xl py-2">{data.city_name}</div>
      {<div>{data.short_description}</div>}
    </div>
  );
};

export default CityDetails;
