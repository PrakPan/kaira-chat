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
import PrimaryHeading from "../../components/heading/PrimaryHeading.jsx";
import SecondaryHeading from "../../components/heading/Secondary.jsx";
import Itinerary1Carousel from "../../components/theme/Itinerary1Carousel.jsx";
import DesktopPersonaliseBanner from "../../components/containers/Banner";
import MobileBanner from "../city/Banner/Mobile";
import validateTextSize from "../../services/textSizeValidator";
import SecondaryButton from "../../components/ui/SecondaryButton.jsx";
import BannerTwo from "./BannerTwo.js";
import Continentcarousel from "../../components/continentcarousel/continentcarousel.js";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/Index.js";
import AsSeenIn from "../testimonial/AsSeenIn.js";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs.js";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import Button from "../../components/ui/button/Index";
import OldLocations from "../../components/containers/plannerlocations/Index";
import Locations from "../../components/containers/newplannerlocations/Index";
import Activity2 from "../newcityplanner/activities/Index.js";
import Poi from "../newcityplanner/pois/Index";
import PathNavigation from "./PathNavigation.js";
import ThemeBackground from "../../components/theme/ThemeBackgroundImages.jsx";
import { imgUrlEndPoint } from "../../components/theme/ThemeConstants.js";
import BudgetFriendly from "../../components/theme/BudgetFriendly.jsx";
import ImageCarousel from "./ImageCaraousel.js";
import Element from "../newcityplanner/elements/Index.js";
import ThemeHeadline from "./ThemeHeadines.js";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  font-weight: 350px;
  @media screen and (min-width: 768px) {
    width: 85%;
    font-weight: 350px;
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

      setComponents(components);

      // Separate components based on `is_navigation_type`

      // const otherComponents = components.filter(
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
      {/* {props?.slug === 'la-tomatina-spain-2025' && <ThemeHeadline text={`Join the World's Biggest Tomato Fight – La Tomatina 2025`} />} */}
      {isPageWide ? (
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
      )}

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

      {props.slug === "japan-cherry-blossom" && (
        <div className="relative">
          {isPageWide && (
            <div className="absolute  left-0 -z-10 w-full md:w-[9.3%] h-[10rem]">
              <Image
                src={`${imgUrlEndPoint}media/themes/japan-banner-right.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}

          {isPageWide && (
            <div className="absolute -top-1 right-0 -z-10 w-[10%] h-[10rem]">
              <Image
                src={`${imgUrlEndPoint}media/themes/japan-banner-right.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}
        </div>
      )}

      {props.slug === "honeymoon-2025" && (
        <div className="relative">
          <div className="absolute -top-10 left-0 -z-10 w-full md:w-[50%] h-[10rem]">
            <Image
              src={`${imgUrlEndPoint}media/themes/Hearts.png`}
              fill
              className="absolute bottom-0 object-fill"
            />
          </div>

          {isPageWide && (
            <div className="absolute -top-10 right-0 -z-10 w-[50%] h-[10rem]">
              <Image
                src={`${imgUrlEndPoint}media/themes/Hearts.png`}
                fill
                className="absolute bottom-0 object-fill"
              />
            </div>
          )}
        </div>
      )}

      <SetWidthContainer>
        {props?.slug === "japan-cherry-blossom" && (
          <PathNavigation path={"asia/japan"} />
        )}
        {props.experienceData.overview_heading &&
        props.experienceData.overview_text ? (
          <Overview
            heading={props.experienceData.overview_heading}
            text={props.experienceData.overview_text}
            image={props.experienceData.overview_image}
            slug={props.slug}
          />
        ) : null}

        <div className="mt-5">
          {components &&
            components.map((component, index) => {
              if (component.type === "Menu" && !component.parent) {
                const navComponents = components.filter(
                  (childComponent) => childComponent.parent === component.id
                );

                return navComponents.length > 0 ? (
                  <div key={index} className={`mx-3 space-y-12 mt-5`}>
                    {props?.slug === "perfect-proposals-2025" ? (
                      <>
                        <ThemeBackground
                          component={component}
                          slug={props?.slug}
                        />
                      </>
                    ) : (
                      <PrimaryHeading> {component.heading}</PrimaryHeading>
                    )}

                    <Navigation slug={props?.slug} components={navComponents} />

                    <PlanYourTripButton text={"Plan Itinerary For Free"} />
                  </div>
                ) : null;
              }

              return (
                !component.parent && (
                  <div key={index} className="mx-3 space-y-12 mt-5">
                    <div className="space-y-3">
                      {(props?.slug === "perfect-proposals-2025" &&
                        (component?.priority == 13 ||
                          component?.priority == 9)) ||
                      props?.slug === "la-tomatina-spain-2025" ? (
                        ""
                      ) : (
                        <PrimaryHeading
                          className={` ${
                            props?.slug != "japan-cherry-blossom"
                              ? "mx-auto text-center"
                              : "mt-7"
                          }`}
                        >
                          {component.heading}
                        </PrimaryHeading>
                      )}
                      <SecondaryHeading className="mx-auto text-center">
                        {component.text}
                      </SecondaryHeading>
                    </div>

                    <ThemeBackground component={component} slug={props?.slug} />

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 4 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -left-[9vw] md:-left-[9vw] -top-[20rem] -z-10 w-full md:w-[50%] h-[100rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/japan-places-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 1 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -left-[20vw] -top-[10rem] -z-10 w-full md:w-[28%] h-[20rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/other-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 8 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -right-[8vw] -top-[10rem] -z-10 w-full md:w-[20%] h-[10rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/japan-corner.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {props.slug === "japan-cherry-blossom" &&
                      component?.priority == 7 &&
                      isPageWide && (
                        <div className="relative w-full">
                          <div className="absolute -right-[9vw] -top-[12rem] -z-10 w-full md:w-[20%] h-[30rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/other-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>

                          <div className="absolute -left-[9vw] top-[3rem] -z-10 w-full md:w-[28%] h-[30rem]">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/other-destination.png`}
                              fill
                              className="absolute bottom-0 object-fill"
                            />
                          </div>
                        </div>
                      )}

                    {/* Rendering Static Components */}

                    {component.type === "Generic" &&
                      component?.heading ===
                        "How We Keep It Budget-Friendly?" && (
                        <div>
                          <BudgetFriendly
                            page_id={props.experienceData?.id}
                            destination={props.experienceData?.destination}
                          ></BudgetFriendly>
                        </div>
                      )}

                    {component.type === "How it works?" && (
                      <div>
                        <BannerTwo
                          page_id={props.experienceData?.id}
                          destination={props.experienceData?.destination}
                        ></BannerTwo>
                      </div>
                    )}

                    {component.type === "Generic" &&
                      component.heading === "Why plan with us?" && (
                        <WhyPlanWithUs page_id={props.experienceData?.id} />
                      )}

                    {/* Render specific carousel components based on type */}

                    {component.carousel === "destination-1" ? (
                      <>
                        <Destination1Carousel
                          handlePlanButton={handlePlanButton}
                          setDestination={setDestination}
                          packages={[
                            ...component.cities.map((item) => ({
                              ...item,
                              type: "City",
                            })),
                            ...component.states.map((item) => ({
                              ...item,
                              type: "State",
                            })),
                            ...component.countries.map((item) => ({
                              ...item,
                              type: "Country",
                            })),
                          ]}
                        />
                        <PlanYourTripButton text={"Start your journey now!"} />
                      </>
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
                              src={`${imgUrlEndPoint}media/themes/red-hearts.png`}
                              className="object-fill absolute -left-[1rem] top-[10rem] md:-left-[9rem] md:top-0"
                              alt="Tilted Hearts"
                              height={300}
                              width={500}
                              style={{
                                opacity: "50%",
                              }}
                            />

                            <Image
                              src={`${imgUrlEndPoint}media/themes/red-hearts.png`}
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
                        <Activity1Carousel activities={component.activities} />{" "}
                        <PlanYourTripButton
                          text={"Create your free itinerary"}
                        />
                      </>
                    ) : component.carousel === "review-1" ? (
                      <div className="relative">
                        {props.slug === "honeymoon-2025" && (
                          <div className="-z-10 w-fit absolute -top-[16rem] right-0 md:-top-[9rem] overflow-hidden">
                            <Image
                              src={`${imgUrlEndPoint}media/themes/tilted-heart.png`}
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
                    ) : component.carousel === "destination-3" ? (
                      <>
                        <SwiperLocations
                          locations={component?.countries}
                          page_id={component?.id}
                          destination={component?.name}
                          viewall
                          country
                          page={"Country Page"}
                          continent={component?.countries}
                        ></SwiperLocations>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "state-1" ? (
                      <>
                        <OldLocations
                          locations={component?.states}
                          page_id={component?.id}
                          destination={component?.name}
                          viewall
                          country={component?.name}
                          planner
                          page={"Country Page"}
                        ></OldLocations>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "destination-4" ? (
                      <>
                        <div className="space-y-4">
                          <Locations
                            locations={component?.cities}
                            page={"Continent Page"}
                            viewall
                          ></Locations>
                        </div>
                      </>
                    ) : component.carousel === "Activity-2" ? (
                      <>
                        <Activity2
                          data={component.activities}
                          activities={component?.activities}
                          city={component?.name}
                          // handlePlanButtonClick={()=>{}}
                          // {handlePlanButtonClick}
                          slug={props?.slug}
                          page={"Country Page"}
                        />
                        <PlanYourTripButton text={"Plan Itinerary For Free"} />
                      </>
                    ) : component.carousel === "destination-2" ? (
                      <>
                        <Element
                          data={component.elements}
                          elements={component?.elements}
                          city={component?.name}
                          // handlePlanButtonClick={()=>{}}
                          // {handlePlanButtonClick}
                          slug={props?.slug}
                          page={"Country Page"}
                        />
                        <PlanYourTripButton text={"Plan Itinerary For Free"} />
                      </>
                    ) : component.carousel === "destination-5" ? (
                      <>
                        <Poi
                          elevation={component?.elevation}
                          data={component?.data}
                          thingsToDoPage={component?.thingsToDoPage}
                          pois={component?.pois}
                          city={component?.name}
                        />
                      </>
                    ) : component.carousel === "destination-6" ? (
                      <>
                        <Continentcarousel
                          data={props.continetCarousel}
                          page={"Country Page"}
                        ></Continentcarousel>
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
                    ) : component.carousel === "Image Caraousel" ? (
                      <>
                        <ImageCarousel />
                        <PlanYourTripButton
                          text={"Create your travel plan now!"}
                        />
                      </>
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
                src={`${imgUrlEndPoint}media/themes/tilted-heart.png`}
                className="object-fill"
                alt="Tilted Hearts"
                height={200}
                width={200}
              />
            </div>
          </div>
        )}

        <div className="my-[100px]">
          {props.experienceData.faq.length > 0 && (
            <ThemeFaqs faqs={props.experienceData.faq} />
          )}
        </div>

        {props?.experienceData?.slug === "japan-cherry-blossom" && (
          <>
            {isPageWide && (
              <div className="relative w-full">
                <div className="absolute -left-[8vw] top-[28rem] -z-10 w-full md:w-[20%] h-[10rem] ">
                  <Image
                    src={`${imgUrlEndPoint}media/themes/japan-corner.png`}
                    fill
                    className="absolute bottom-0 object-fill transform scale-x-[-1]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <PrimaryHeading className="mx-auto text-center">
                What they say?
              </PrimaryHeading>
            </div>
            <AsSeenIn />
            <ChatWithUs planner page_id={props.experienceData?.id}></ChatWithUs>
          </>
        )}
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
      <SecondaryButton onClick={handlePlanButton} className={props?.className}>
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
