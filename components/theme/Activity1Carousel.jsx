import React, { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import SwiperCarousel from "../../components/SwiperCarousel.js";
import media from "../../components/media";
import POIDetailsDrawer from "../../components/drawers/poiDetails/POIDetailsDrawer";
import { logEvent } from "../../services/ga/Index";
import { PlanYourTripButton } from "../../containers/travelplanner/ThemePage.jsx";
import SecondaryHeading from "../heading/Secondary.jsx";

const Container = styled.div`
  width: 100%;
  position: relative;
`;

export default function Activity1Carousel(props) {
  let isPageWide = media("(min-width: 768px)");

  return (
    <SwiperCarousel
      cards={props.activities.map((activity, index) => (
        <ActivityCard key={index} {...activity} />
      ))}
      slidesPerView={isPageWide ? 4 : 1}
      // spaceBetween={25}
      navigationButtons={true}
      navButtonsTop={isPageWide ? "140px" : "175px"}
      pageDots={!isPageWide}
    />
  );
}

const ActivityCard = ({ id, image, name, short_description }) => {
  let isPageWide = media("(min-width: 768px)");
  const [show, setShow] = useState(false);

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

  return (
    <Container
      onClick={handleActivityClick}
      style={
        {
          // width: isPageWide ? "282px" : "350px",
        }
      }
      className="cursor-pointer"
    >
      <div className="flex flex-col h-full gap-3">
        <div className="relative w-h-full overflow-hidden">
          <ImageLoader
            url={image}
            width={isPageWide ? "282px" : "350px"}
            height={isPageWide ? "282px" : "350px"}
            borderRadius="10px"
          />
        </div>

        <div className="">
          <h3 className="text-[16px] leading-[28px] font-[700]">{name}</h3>
          <SecondaryHeading className="line-clamp-3">
            {short_description}
          </SecondaryHeading>
        </div>
      </div>

      <POIDetailsDrawer
        show={show}
        ActivityiconId={id}
        handleCloseDrawer={handleCloseDrawer}
        name={name}
      >
        <PlanYourTripButton />
      </POIDetailsDrawer>
    </Container>
  );
};
