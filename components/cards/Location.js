import React, { useState } from "react";
import ImageLoader from "../ImageLoader";
import { getIndianPrice } from "../../services/getIndianPrice";

const LocationCard = (props) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div
      onClick={props.onclick ? props.onclick : null}
      className={`group relative h-[45vh] rounded-[10px] overflow-hidden ${
        imageLoading ? "bg-gray-200 animate-pulse" : ""
      }`}
    >
      <ImageLoader
        noLazy={props.noLazy}
        url={props.img}
        style={{ filter: props.filter }}
        height={props.height ? props.height : "45vh"}
        width={props.width ? props.width : "100%"}
        dimensions={props.dimensions}
        dimensionsMobile={props.dimensionsMobile}
        borderRadius={props.borderRadius ? props.borderRadius : "10px"}
        noPlaceholder={props.noPlaceholder}
        resizeMode={props.resizeMode}
        onload={() => {
          setImageLoading(false);
        }}
      />

      {props.location.best_time ? (
        imageLoading ? (
          <div className="w-[40%] h-6 absolute top-4 left-4 rounded-full  bg-gray-300 animate-pulse"></div>
        ) : (
          <div className="w-fit absolute top-4 left-4 rounded-full text-xs text-center font-normal text-white bg-[#01202B] px-[10px] py-1">
            Best time : {props.location.best_time}
          </div>
        )
      ) : null}

      <div
        className={`w-full flex flex-col px-3 gap-2 rounded-[10px] absolute bottom-0 pb-4 translate-y-[60px] transition-all ${
          !imageLoading &&
          "bg-gradient-to-t from-black from-60% group-hover:translate-y-0"
        }`}
      >
        <div className="w-full">
          {imageLoading ? (
            <div className="w-full flex flex-col gap-2 items-start py-2">
              <div className="w-[80%] h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
            </div>
          ) : (
            <div className="w-full flex flex-col py-1">
              <div>
                <p className="text-white text-lg font-bold leading-[16px]">
                  {props.name}
                </p>
                {props.location?.budget ? (
                  <p className="text-white text-md font-light leading-[14px]">
                    From{" "}
                    <span className="font-bold">
                      ₹{getIndianPrice(props.location.budget)}
                    </span>
                    /- per day
                  </p>
                ) : (
                  <p className="text-white text-md font-light leading-[14px]">
                    {props.heading}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="w-full bg-[#F7E700] rounded-lg text-sm text-black text-center px-2 py-2">
          Plan a trip
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
