import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import media from "../../components/media";
import ThemeBanner from "../../components/containers/ThemeBanner/ThemeBanner";
import openTailoredModal from "../../services/openTailoredModal";
import { logEvent } from "../../services/ga/Index";
import Overview from "../themes/Overview.jsx";
import Image from "next/image.js";
import TailoredFormMobileModal from "../../components/modals/TailoredFomrMobile";
import ThemeFaqs from "../themes/ThemeFaqs.jsx";
import Destination1Carousel from "../../components/theme/Destination1Carousel.jsx";
import Activity1Carousel from "../../components/theme/Activity1Carousel.jsx";
import Reviews1Carousel from "../../components/theme/Reviews1Carousel.jsx";
import Itinerary2Carousel from "../../components/theme/Itinerary2Carousel.jsx";
import Navigation from "../../components/theme/Navigation.jsx";

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
  const [components, setComponents] = useState([]);
  const [navigationComponents, setNavigationComponents] = useState([]);
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if (props.experienceData?.components) {
      let components = props.experienceData?.components;
      components.sort((a, b) => a?.priority - b?.priority);

      // Separate components based on `is_navigation_type`
      const navComponents = components.filter(
        (component) => component.is_navigation_type
      );
      const otherComponents = components.filter(
        (component) => !component.is_navigation_type
      );
      setNavigationComponents(navComponents);
      setComponents(otherComponents);
    }
  }, [props.experienceData?.components]);

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
    <div className="mb-5">
      <ThemeBanner
        image={props.experienceData.image}
        page_id={props.experienceData.id}
        destination={props.experienceData.destination}
        cities={props.experienceData.locations}
        children_cities={props.experienceData.children}
        title={props.experienceData.banner_heading}
        subheading={props.experienceData.banner_text}
        page={"State Page"}
        slug={props.slug}
      />

      {props.slug === "honeymoon-2025" && (
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
      )}

      <SetWidthContainer>
        {navigationComponents.length ? (
          <Navigation components={navigationComponents} />
        ) : null}

        <Overview
          heading={props.experienceData.overview_heading}
          text={props.experienceData.overview_text}
          image={props.experienceData.overview_image}
          slug={props.slug}
        />

        <div className="space-y-[100px]">
          {components.map((component, index) => (
            <div key={index} className="mx-3">
              <div className="text-center my-6 mt-[4rem] ">
                <h1 className="md:text-4xl font-bold">{component.heading}</h1>
                <p className="text-gray-500 mt-2">{component.text}</p>
              </div>

              {component.carousel === "destination-1" ? (
                <Destination1Carousel
                  handlePlanButton={handlePlanButton}
                  setDestination={setDestination}
                  packages={[...component.cities, ...component.countries]}
                />
              ) : component.carousel === "destination-2" ? (
                <></>
              ) : component.carousel === "itinerary-1" ? (
                <></>
              ) : component.carousel === "itinerary-2" ? (
                <div className="w-full relative">
                  {props.slug === "honeymoon-2025" && (
                    <>
                      <Image
                        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/red-hearts.png`}
                        className="object-fill absolute -left-[1rem] top-[10rem] md:-left-[9rem] md:top-0"
                        alt="Tilted Hearts"
                        height={300}
                        width={500}
                        style={{
                          opacity: "50%",
                        }}
                      />

                      <Image
                        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/red-hearts.png`}
                        className="object-fill absolute -right-[1rem] top-[35rem] md:-right-[9rem] md:top-0"
                        alt="Tilted Hearts"
                        height={300}
                        width={500}
                        style={{
                          opacity: "50%",
                        }}
                      />
                    </>
                  )}

                  <Itinerary2Carousel elements={component.elements} />
                </div>
              ) : component.carousel === "activity-1" ? (
                <Activity1Carousel activities={component.activities} />
              ) : component.carousel === "review-1" ? (
                <div className="relative">
                  {props.slug === "honeymoon-2025" && (
                    <div className="-z-10 w-fit absolute -top-[16rem] right-0 md:-top-[9rem] overflow-hidden">
                      <Image
                        src={`https://d31aoa0ehgvjdi.cloudfront.net/media/themes/tilted-heart.png`}
                        className="object-fill"
                        alt="Tilted Hearts"
                        height={200}
                        width={200}
                        style={{ transform: "rotate(45deg)" }}
                      />
                    </div>
                  )}

                  <Reviews1Carousel reviews={component.reviews} />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {props.slug === "honeymoon-2025" && (
          <div className="relative">
            <div
              className="-z-10 absolute -top-[3rem] w-[18rem] h-[18rem]"
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
        )}

        <div className="my-[100px]">
          <ThemeFaqs faqs={props.experienceData.faq} />
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
      />
    </div>
  );
}
