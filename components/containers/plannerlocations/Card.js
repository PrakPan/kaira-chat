import React, { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../ImageLoader";
import Link from "next/link";
import { logEvent } from "../../../services/ga/Index";
import { getIndianPrice } from "../../../services/getIndianPrice";

const ImageFade = styled.div`
  width: 100%;
  height: auto;
  transition: 0.2s all ease-in-out;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    ${ImageFade} {
      transition: 0.2s all ease-in-out;
      transform: scale(1.1);
    }
  }
  @media screen and (min-width: 768px) {
    height: 35vh;
  }
`;

const Experiences = (props) => {
  const [loading, setLoading] = useState(true);

  const handleImageClick = (e) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: props?.page ? props.page : "",
        event_category: "Click",
        event_label: "View Destination",
        event_value: props?.location ? props.location : "",
        event_action: `Plan as per the best destinations${
          props.country && " in " + props.country
        }`,
      },
    });
  };

  return (
    <Link className="hover-pointer group" href={"/" + props.path}>
      <ImageContainer
        className={`w-full ${loading ? "bg-gray-200 animate-pulse" : ""}`}
        onClick={handleImageClick}
      >
        <ImageFade>
          <ImageLoader
            url={props.img}
            dimensions={{ width: 500, height: 500 }}
            dimensionsMobile={{ width: 800, height: 800 }}
            height="35vh"
            style={{ filter: "brightness(0.9)" }}
            onload={() => {
              setLoading(false);
            }}
          ></ImageLoader>
        </ImageFade>

        <div
          className={`w-full flex flex-col px-3 gap-4 rounded-[10px] absolute bottom-0 pb-4 translate-y-[60px] transition-all ${
            !loading &&
            "bg-gradient-to-t from-black from-60% group-hover:translate-y-0"
          }`}
        >
          {loading ? (
            <div className="w-full flex flex-col items-start gap-2">
              <div className="w-[80%] h-10 bg-gray-300 rounded-lg"></div>
              <div className="w-[60%] h-8 bg-gray-300 rounded-lg"></div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <div className="text-white text-lg font-bold leading-[16px]">
                {props.location}
              </div>
              {props.data?.budget && (
                <div className="text-white text-md font-light leading-[14px]">
                  From{" "}
                  <span className="font-bold">
                    ₹{getIndianPrice(props.data.budget)}
                  </span>
                  /- per day
                </div>
              )}
            </div>
          )}

          <button className="w-full bg-[#F7E700] rounded-lg text-sm text-black text-center px-2 py-2">
            Plan a trip
          </button>
        </div>
      </ImageContainer>
    </Link>
  );
};

export default Experiences;
