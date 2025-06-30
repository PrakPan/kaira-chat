import React, { useState } from "react";
import styled from "styled-components";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import ImageLoader from "../../components/ImageLoader";
import SwiperCarousel from "../../components/SwiperCarousel.js";
import media from "../../components/media";
import { logEvent } from "../../services/ga/Index";
import { PlanYourTripButton } from "../../containers/travelplanner/ThemePage.jsx";
import TertiaryHeading from "../heading/Tertiary.jsx";
import NewPOIDetailsDrawer from "../drawers/poiDetails/NewPOIDetailsDrawer.js";

const Container = styled.div`
  width: 100%;
  position: relative;
`;

export default function Activity1Carousel(props) {
  let isPageWide = media("(min-width: 768px)");

  return (
    <SwiperCarousel
      cards={props.activities.map((activity, index) => (
        <ActivityCard key={index} scale={props.scale} data={activity} {...activity} />
      ))}
      slidesPerView={isPageWide ? 4 : 1}
      // spaceBetween={25}
      navigationButtons={true}
      navButtonsTop={isPageWide ? "140px" : "175px"}
      pageDots={!isPageWide}
    />
  );
}

const ActivityCard = ({ data, scale, id, image, name, short_description }) => {
  
  let isPageWide = media("(min-width: 768px)");
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);

  const handleCloseDrawer = (e) => {
    if (e) e.stopPropagation(e);
    setShow(false);
  };

  const handleActivityClick = (e) => {
    setShow(true);
    logEvent({
      action: "Details_View",
      params: {
        page: "Theme Page",
        event_category: "Click",
        event_value: name,
        event_action: `Activity details ${name}`,
      },
    });
  };

  var stars = [];
  for (let i = 0; i < Math.floor(data.rating); i++) {
    stars.push(<FaStar />);
  }

  if (Math.floor(data.rating) < data.rating) stars.push(<FaStarHalfAlt />);

  return (
    <Container
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleActivityClick}
      className="group cursor-pointer py-2"
    >
      <div className="flex flex-col h-full gap-3">
      <div className="relative group h-full overflow-hidden rounded-lg">
      <div className={`w-full h-full ${scale ? "hover:scale-110" : "group-hover:scale-105"} transition-all`}>
          <ImageLoader
            url={image}
            width={isPageWide ? "282px" : "350px"}
            height={isPageWide ? "282px" : "350px"}
            borderRadius="10px"
          />
      </div>

          {data.rating ? (
            <div
              className={`${
                hover ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 absolute bottom-1 left-3 flex items-center gap-1 text-white text-sm bg-black bg-opacity-50 rounded-full p-2`}
            >
              <span className="text-[#FFD201] flex">{stars}</span>
              <span>{data.rating}</span>

              {data.user_ratings_total ? (
                <span className="underline">
                  . {data.user_ratings_total} Google reviews
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="">
          <h3 className="text-[16px] leading-[28px] font-[700]">{name}</h3>
          <TertiaryHeading className="line-clamp-3">
            {short_description}
          </TertiaryHeading>
        </div>
      </div>

      <NewPOIDetailsDrawer
        themePage
        show={show}
        ActivityiconId={id}
        handleCloseDrawer={handleCloseDrawer}
        name={name}
        data={data}
        removeDelete={true}
      >
        <PlanYourTripButton />
      </NewPOIDetailsDrawer>
    </Container>
  );
};
