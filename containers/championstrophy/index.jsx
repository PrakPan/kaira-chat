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
import Navigation from "../../components/championsTrophy/Navigation.jsx";
import PrimaryHeading from "../../components/heading/PrimaryHeading.jsx";
import SecondaryHeading from "../../components/heading/Secondary.jsx";
import Itinerary1Carousel from "../../components/theme/Itinerary1Carousel.jsx";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import MobileBanner from "../city/Banner/Mobile";
import validateTextSize from "../../services/textSizeValidator";
import SecondaryButton from "../../components/ui/SecondaryButton.jsx";
import BannerMobile from "../city/Banner/Mobile";
import DesktopBanner from "../../components/containers/Banner";
import ICCBanner from "../../components/containers/ICCBanner/ICCBanner.js";
import WhyChooseUs from "../../components/championsTrophy/WhyChooseUs.jsx";



const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  font-weight: 350px;
  @media screen and (min-width: 768px) {
    width: 85%;
    font-weight: 350px;
  }
`;

export default function ChampionsTrophy(props) {
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

      setComponents(components);

      // Separate components based on `is_navigation_type`

      //  t otherComponents = components.filter(
      //   (component) => !component.is_navigation_type
      // );
      // // setNavigationComponents(navComponents);
      // setComponents(otherComponents);
    }
  }, []);

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
      {/* {isPageWide ? (
        <DesktopPersonaliseBanner
          onclick={() =>
            openTailoredModal(
              router,
              props.experienceData.id,
              props.experienceData.destination
            )
          }
          text={validateTextSize(
            `Craft a personalized itinerary now!`,
            9,
            `Craft a trip now!`
          )}
        ></DesktopPersonaliseBanner>
      ) : (
        <MobileBanner
          cityName={props.experienceData.destination ?? null}
          onClick={() =>
            openTailoredModal(
              router,
              props.experienceData.id,
              props.experienceData.destination
            )
          }
        />
      )} */}

      <ICCBanner
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

      {isPageWide ? <DesktopBanner
        newYear
        onclick={() => openTailoredModal(router)}
        text="Want to personalize your own experience?"
      ></DesktopBanner> : <BannerMobile onclick={() => openTailoredModal(router)}/>}



      <SetWidthContainer>
        <Overview
          heading={props.experienceData.overview_heading}
          text={props.experienceData.overview_text}
          image={props.experienceData.overview_image}
          slug={props.slug}
        />

        <div className="mt-5">
          {components &&
            components.map((component, index) => {
              if (component.type === "Menu" && !component.parent) {
                const navComponents = components.filter(
                  (childComponent) => childComponent.parent === component.id
                );

                return navComponents.length > 0 ? (
                  <div key={index} className="mx-3 space-y-12 mt-5">
                    <PrimaryHeading className="m-auto">
                      {" "}
                      {component.heading}
                    </PrimaryHeading>
                    <Navigation components={navComponents} className="m-auto" />

                    <PlanYourTripButton text={"Plan Itinerary For Free"} />
                  </div>
                ) : null;
              }

              return (
                !component.parent && (
                  <div key={index} className="mx-3 space-y-12 mt-5">
                    <div className="space-y-3">
                      <PrimaryHeading className="mx-auto text-center relative z-10">
                        {component.heading }
                      </PrimaryHeading>
                      <SecondaryHeading className="mx-auto text-center">
                        {component.text}
                      </SecondaryHeading>
                    </div>

                    {
                      component?.heading == "Why Choose Us?" ? <WhyChooseUs heading={component?.heading}/> : null
                    }

                    {/* Render specific carousel components based on type */}
                    {component.carousel === "destination-1" ? (
                      <>
                        <Destination1Carousel
                          handlePlanButton={handlePlanButton}
                          setDestination={setDestination}
                          packages={[
                            ...component.cities,
                            ...component.states,
                            ...component.countries,
                          ]}
                        />
                        <PlanYourTripButton text={"Start your journey now!"} />
                      </>
                    ) : component.carousel === "destination-2" ? (
                      <></>
                    ) : component.carousel === "itinerary-1" ? (
                      <>
                        <Itinerary1Carousel
                          itineraries={component.itineraries}
                        />
                        <PlanYourTripButton />
                      </>
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
                              className="object-fill absolute -right-[1rem] top-[35rem] md:-right-[6rem] md:top-0"
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
                      <>
                        <Activity1Carousel activities={component.activities} scale={true}/>
                        <PlanYourTripButton
                          text={"Create your free itinerary"} 
                        />
                      </>
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
                        <PlanYourTripButton />
                      </div>
                    ) : null}
                  </div>
                )
              );
            })}
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

export const PlanYourTripButton = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [showTailoredModal, setShowTailoredModal] = useState(false);
  const router = useRouter();

  const handlePlanButton = () => {
    if (isPageWide) {
      setShowTailoredModal(true);
    } else {
      openTailoredModal(router, props.page_id, props.destination);
    }

    logEvent({
      action: "Plan_Itinerary",
      params: {
        page: props.page ? props.page : "",
        event_category: "Button Click",
        event_label: "Plan Itinerary For Free!",
        event_action: "Banner",
      },
    });
  };

  return (
    <div className="flex items-center justify-center mt-5 bg-white">
      <SecondaryButton onClick={handlePlanButton}>
        {props.text
          ? props.text
          : props.slug === "honeymoon-2025"
          ? "Plan Your Honeymoon!"
          : "Plan Your Trip Now!"}
      </SecondaryButton>

      <TailoredFormMobileModal
        destinationType={"city-planner"}
        page_id={props.page_id}
        children_cities={props.children_cities}
        destination={props.destination}
        cities={props.cities}
        onHide={() => {
          setShowTailoredModal(false);
        }}
        show={showTailoredModal}
        eventDates={props.eventDates}
      />
    </div>
  );
};
