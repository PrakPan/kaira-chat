import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DesktopBanner from "../../components/containers/Banner";
import media from "../../components/media";
import ThemeBanner from "../../components/containers/ThemeBanner/ThemeBanner";
import openTailoredModal from "../../services/openTailoredModal";
import { logEvent } from "../../services/ga/Index";
import H3 from "../../components/heading/H3";
import Overview from "../themes/Overview.jsx";
import Image from "next/image.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import HoneymoonPackages from "../../components/theme/HoneymoonPackages.jsx";
import ThemeBannerCards from "../../components/theme/ThemeBannerCards.jsx";
import ThemeFaqs from "../themes/ThemeFaqs.jsx";
import Destination1Carousel from "../../components/theme/Destination1Carousel.jsx";
import Activity1Carousel from "../../components/theme/Activity1Carousel.jsx";
import Reviews1Carousel from "../../components/theme/Reviews1Carousel.jsx";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

export default function ThemePage(props) {
  let isPageWide = media("(min-width: 768px)");
  const router = useRouter();
  const [headings, setHeadings] = useState([]);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if (props.experienceData?.headings) {
      let headings = props.experienceData?.headings;
      headings.sort((a, b) => a?.priority - b?.priority);
      setHeadings(headings);
    }
  }, [props.experienceData?.headings]);

  const handlePlanButton = (pageId, destination, type) => {
    if (isPageWide) {
      setShowTailoredModal(true);
    } else {
      openTailoredModal(router, pageId, destination, type);
    }

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: "State Page",
        event_category: "Button Click",
        event_label: "Create your travel plan now!",
        event_action: location,
      },
    });
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div
        className={"Homepage"}
        id="homepage-anchor"
        style={{ visibility: props.hidden ? "hidden" : "visible" }}
      >
        <ThemeBanner
          image={props.experienceData.image}
          page_id={props.experienceData.id}
          destination={props.experienceData.destination}
          cities={props.experienceData.locations}
          children_cities={props.experienceData.children}
          title={props.experienceData.banner_heading}
          subheading={props.experienceData.banner_text}
          page={"State Page"}
          eventDates={props.eventDates}
        />
        <div className="relative">
          <div className="absolute -top-10 left-0 -z-10 w-full md:w-[50%] h-[10rem]">
            <Image
              src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Hearts.png`}
              fill
              className="absolute bottom-0 object-fill"
            />
          </div>

          {isPageWide && (
            <div className="absolute -top-10 right-0 -z-10 w-[50%] h-[10rem]">
              <Image
                src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/Hearts.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}
        </div>

        <SetWidthContainer>
          <div className="mt-5 mx-3">
            <H3
              style={{
                color: "black",
                margin: !isPageWide
                  ? "auto" //"2.5rem 0.5rem 1.5rem 0.5rem"
                  : "3rem 0 2rem 0",
                padding: "5px",
              }}
            >
              Explore the World’s Most Romantic Getaways
            </H3>
            <HoneymoonPackages />
          </div>

          <Overview
            heading={props.experienceData.overview_heading}
            text={props.experienceData.overview_text}
            image={props.experienceData.overview_image}
          />

          <div className="space-y-[100px]">
            {headings.map((heading, index) => (
              <div key={index} className="mx-3">
                <div className="text-center my-6 mt-[4rem] ">
                  <h1 className="md:text-4xl font-bold">{heading.name}</h1>
                  <p className="text-gray-500 mt-2">{heading.text}</p>
                </div>

                {heading.carousel === "destination-1" ? (
                  <Destination1Carousel
                    handlePlanButton={handlePlanButton}
                    setDestination={setDestination}
                    packages={heading.elements}
                  />
                ) : heading.carousel === "destination-2" ? (
                  <></>
                ) : heading.carousel === "itinerary-1" ? (
                  <></>
                ) : heading.carousel === "activity-1" ? (
                  <Activity1Carousel activities={heading.activities} />
                ) : heading.carousel === "review-1" ? (
                  <Reviews1Carousel reviews={heading.reviews} />
                ) : null}
              </div>
            ))}
          </div>

          <div className="my-[100px] mx-3">
            <ThemeBannerCards />
          </div>

          <div className="relative">
            <div
              className="absolute top-2 -right-20 w-[12rem] h-[16rem] overflow-hidden"
              style={{ transform: "rotate(45deg)" }}
            >
              <Image
                src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
                className="object-fill"
                alt="Tilted Hearts"
                height={200}
                width={200}
              />
            </div>
          </div>

          <div classname="mb-5">
            <div className="relative">
              <div
                className="absolute -top-[6rem] w-[18rem] h-[18rem]"
                style={{ transform: "rotate(-12deg)" }}
              >
                <Image
                  src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
                  className="object-fill"
                  alt="Tilted Hearts"
                  height={200}
                  width={200}
                />
              </div>
            </div>

            <ThemeFaqs />
          </div>
        </SetWidthContainer>

        <TailoredFormMobileModal
          destinationType={destination?.type}
          page_id={destination?.pageId}
          children_cities={props?.children_cities}
          destination={destination?.name}
          cities={props?.cities}
          onHide={() => {
            setShowTailoredModal(false);
          }}
          show={showTailoredModal}
          eventDates={props?.eventDates}
        />
      </div>
    </div>
  );
}
