import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import DesktopBanner from "../../components/containers/Banner";
import Experiences from "../../components/containers/Experiences";
import media from "../../components/media";
import BannerTwo from "./BannerTwo";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import Reviews from "./CaseStudies/Index";
import ExperienceCard from "../../components/cards/newitinerarycard-main/ExperienceCard";
import Overview from "./Overview";
import Button from "../../components/ui/button/Index";
import Locations from "../../components/containers/newplannerlocations/Index";
import OldLocations from "../../components/containers/plannerlocations/Index";
import MobileBanner from "./MobileBanner";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import openTailoredModal from "../../services/openTailoredModal";
import dynamic from "next/dynamic";
import AsSeenIn from "../testimonial/AsSeenIn";
import PathNavigation from "./PathNavigation.js";
import { logEvent } from "../../services/ga/Index";
import H3 from "../../components/heading/H3";
const MapBox = dynamic(() => import("../../components/Map.js"), {
  ssr: false,
});

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

const MapInfo = styled.div`
  b {
    font-weight: 600;
  }
`;

const MapGridContainer = styled.div`
  display: grid;
  grid-gap: 30px;
  @media screen and (min-width: 768px) {
    width: 100%;
    grid-template-columns: auto 500px;
    grid-gap: 40px;
    margin: 0 auto 0 auto;
  }
`;

const MapContainer = styled.div`
  @media screen and (min-width: 768px) {
    padding-top: 116px;
  }
`;

const Homepage = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");
  const [userItineraries, setUserItineraries] = useState([]);
  const [TTWItineraries, setTTWItineraries] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [desktopBannerLoading, setDesktopBannerLoading] = useState(false);
  const [overviewHeading, setOverviewHeading] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    let iti_exclusive = [];
    let iti_customer = [];
    try {
      for (var i = 0; i < props.experienceData.itinerary_data.length; i++) {
        if (props.experienceData.itinerary_data[i].owner === "TTW")
          iti_exclusive.push(
            <ExperienceCard
              data={props.experienceData.itinerary_data[i]}
              key={props.experienceData.itinerary_data[i].short_text}
              hardcoded={
                props.experienceData.itinerary_data[i].payment_info
                  ? true
                  : false
              }
              filter={
                props.experienceData.itinerary_data[i].experience_filters
                  ? props.experienceData.itinerary_data[i].experience_filters[0]
                  : null
              }
              rating={props.experienceData.itinerary_data[i].rating}
              slug={props.experienceData.itinerary_data[i].slug}
              id={props.experienceData.itinerary_data[i].id}
              number_of_adults={
                props.experienceData.itinerary_data[i].number_of_adults
              }
              locations={
                props.experienceData.itinerary_data[i]["itinerary_locations"]
              }
              text={props.experienceData.itinerary_data[i].short_text}
              experience={props.experienceData.itinerary_data[i].name}
              cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info.length
                    ? props.experienceData.itinerary_data[i].payment_info[0]
                      .cost
                    : null
                  : null
              }
              duration_number={
                props.experienceData.itinerary_data[i].duration_number
              }
              duration_unit={
                props.experienceData.itinerary_data[i].duration_unit
              }
              location={
                props.experienceData.itinerary_data[i]["experience_region"]
              }
              starting_cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info
                    .per_person_total_cost
                  : props.experienceData.itinerary_data[i].starting_price
              }
              images={props.experienceData.itinerary_data[i].images}
            ></ExperienceCard>
          );
        else
          iti_customer.push(
            <ExperienceCard
              data={props.experienceData.itinerary_data[i]}
              key={props.experienceData.itinerary_data[i].short_text}
              hardcoded={
                props.experienceData.itinerary_data[i].payment_info
                  ? true
                  : false
              }
              filter={
                props.experienceData.itinerary_data[i].experience_filters
                  ? props.experienceData.itinerary_data[i].experience_filters[0]
                  : null
              }
              rating={props.experienceData.itinerary_data[i].rating}
              slug={props.experienceData.itinerary_data[i].slug}
              id={props.experienceData.itinerary_data[i].id}
              number_of_adults={
                props.experienceData.itinerary_data[i].number_of_adults
              }
              locations={
                props.experienceData.itinerary_data[i]["itinerary_locations"]
              }
              text={props.experienceData.itinerary_data[i].short_text}
              experience={props.experienceData.itinerary_data[i].name}
              cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info.length
                    ? props.experienceData.itinerary_data[i].payment_info[0]
                      .cost
                    : null
                  : null
              }
              duration_number={
                props.experienceData.itinerary_data[i].duration_number
              }
              duration_unit={
                props.experienceData.itinerary_data[i].duration_unit
              }
              location={
                props.experienceData.itinerary_data[i]["experience_region"]
              }
              starting_cost={
                props.experienceData.itinerary_data[i].payment_info
                  ? props.experienceData.itinerary_data[i].payment_info
                    .per_person_total_cost
                  : props.experienceData.itinerary_data[i].starting_price
              }
              images={props.experienceData.itinerary_data[i].images}
            ></ExperienceCard>
          );
      }
    } catch { }
  }, []);

  useEffect(() => {
    if (props.experienceData?.headings) {
      let headings = props.experienceData?.headings;
      headings.sort((a, b) => a?.priority - b?.priority)
      setHeadings(headings);
    }
  }, [props.experienceData?.headings])

  useEffect(() => {
    const user = [];
    const ttw = [];
    if (props.experienceData.itinerary_data) {
      props.experienceData.itinerary_data.map((e) => {
        if (e.owner !== "TTW") user.push(e);
        else ttw.push(e);
      });
    }
    setUserItineraries(user);
    setTTWItineraries(ttw);
  }, [props.experienceData.itinerary_data]);

  useEffect(() => {
    // The counter changed!
    setOverviewHeading(props.experienceData.overview_heading);
    return () => setOverviewHeading(null);
  }, [router.query.link, props.experienceData]);

  var country;
  if (props.experienceData.ancestors) {
    if (
      props.experienceData.ancestors.length &&
      props.experienceData.ancestors[0].level == "Country" &&
      props.experienceData.ancestors[0].name
    ) {
      country = props.experienceData.ancestors[0].name;
    }
  }

  const InfoWindowContainer = (location) => (
    <MapInfo>
      <b>{location.name}</b>
      <div>
        {location.most_popular_for?.map((e, i) =>
          i != 0 ? <span key={i}>{", " + e}</span> : <span key={i}>{e}</span>
        )}
      </div>
    </MapInfo>
  );

  const handlePlanButtonClick = (location) => {
    openTailoredModal(
      router,
      props.experienceData.id,
      props.experienceData.destination
    );

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
    <div
      className={"Homepage"}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <HeroBanner
        image={props.experienceData.image}
        page_id={props.experienceData.id}
        destination={props.experienceData.destination}
        cities={props.experienceData.locations}
        children_cities={props.experienceData.children}
        title={props.experienceData.banner_heading}
        page={"State Page"}
      />

      <SetWidthContainer>
        {!props.themePage && <PathNavigation path={props.experienceData.path} />}

        {props.experienceData.page_type == "Theme" && (
          <MapGridContainer>
            <Overview
              locations={props.experienceData.locations}
              overview_heading={overviewHeading}
              overview_text={props.experienceData.overview_text}
            ></Overview>
            <MapContainer>
              {props.experienceData.locations &&
                props.experienceData.locations.length ? (
                <MapBox
                  InfoWindowContainer={InfoWindowContainer}
                  locations={props.experienceData.locations}
                  height="300px"
                />
              ) : (
                <></>
              )}
            </MapContainer>
          </MapGridContainer>
        )}

        {props?.experienceData?.locations?.length ? (
          <>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: isPageWide
                  ? "2.5rem 0 4.5rem 0"
                  : "2.5rem 0.5rem 1.5rem 0.5rem",
              }}
            >
              {props.experienceData.destination
                ? "Top locations across " + props.experienceData.destination
                : "Top Locations"}
            </H3>
            <Locations
              locations={props.experienceData.locations}
              viewall
              page={"State Page"}
              state={props?.experienceData?.destination}
            ></Locations>

            {props.themePage && (
              <Button
                onclick={() =>
                  handlePlanButtonClick(
                    `Top Locations`
                  )
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your travel plan now!
              </Button>
            )}

          </>
        ) : null}

        {headings.map((heading, index) => (
          <div key={index}>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: isPageWide
                  ? "2.5rem 0 2.5rem 0"
                  : "2.5rem 0.5rem 1.5rem 0.5rem",
              }}
            >
              {heading.name}
            </H3>
            <Experiences
              experiences={heading?.itinerary_data}
              page={"State Page"}
            ></Experiences>

            {index % 2 && (
              <Button
                onclick={() =>
                  handlePlanButtonClick(heading.name)
                }
                borderWidth="1px"
                fontWeight="500"
                borderRadius="6px"
                margin="2rem auto"
                padding="0.5rem 2rem"
              >
                Create your travel plan now!
              </Button>
            )}
          </div>
        ))}

        {userItineraries.length ? (
          <>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: isPageWide
                  ? "2.5rem 0 2.5rem 0"
                  : "2.5rem 0.5rem 1.5rem 0.5rem",
              }}
            >
              Trips by our users
            </H3>
            <Experiences
              experiences={userItineraries}
              page={"State Page"}
            ></Experiences>
          </>
        ) : null}

        {props.experienceData.page_type !== "Theme" && (
          <MapGridContainer>
            <Overview
              locations={props.experienceData.locations}
              overview_heading={overviewHeading}
              overview_text={props.experienceData.overview_text}
            ></Overview>
            <MapContainer>
              {props.experienceData.locations &&
                props.experienceData.locations.length ? (
                <MapBox
                  InfoWindowContainer={InfoWindowContainer}
                  locations={props.experienceData.locations}
                  height="300px"
                />
              ) : (
                <></>
              )}
            </MapContainer>
          </MapGridContainer>
        )}

        <Button
          onclick={() =>
            handlePlanButtonClick(
              `A little about ${props?.experienceData?.destination}`
            )
          }
          borderWidth="1px"
          fontWeight="500"
          borderRadius="6px"
          margin="2rem auto"
          padding="0.5rem 2rem"
        >
          {props.experienceData.page_type !== "Theme"
            ? `Craft a trip to ${props.experienceData.destination} now!`
            : "Create your travel plan now!"}
        </Button>
      </SetWidthContainer>

      <SetWidthContainer>
        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: isPageWide ? "3rem 0" : "2.5rem 0.5rem 0rem 0.5rem",
          }}
        >
          How it works?
        </H3>
        <div>
          <BannerTwo
            page_id={props.experienceData.id}
            destination={props.experienceData.destination}
            cities={props.experienceData.locations}
          ></BannerTwo>
        </div>

        {TTWItineraries.length ? (
          <>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: isPageWide
                  ? "2.5rem 0 2.5rem 0"
                  : "2.5rem 0.5rem 1.5rem 0.5rem",
              }}
            >
              Tarzan Way Community Top Picks
            </H3>
            <Experiences
              mobileGrid
              experiences={
                showMore ? TTWItineraries : TTWItineraries.slice(0, 4)
              }
              page={"State Page"}
            ></Experiences>
          </>
        ) : null}

        {!TTWItineraries.length || isPageWide ? null : showMore ? (
          <Button
            onclick={() =>
              handlePlanButtonClick(`Tarzan Way Community Top Picks`)
            }
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Unlock your adventure
          </Button>
        ) : (
          <Button
            onclick={() => setShowMore(true)}
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            View more
          </Button>
        )}

        {userItineraries.length ? (
          <Button
            onclick={() => handlePlanButtonClick(`Unlock your adventure`)}
            borderWidth="1px"
            fontWeight="500"
            borderRadius="6px"
            margin="2rem auto"
            padding="0.5rem 2rem"
          >
            Unlock your adventure
          </Button>
        ) : null}
      </SetWidthContainer>
      <DesktopBanner
        loading={desktopBannerLoading}
        onclick={() =>
          openTailoredModal(
            router,
            props.experienceData.id,
            props.experienceData.destination
          )
        }
        text={`Craft a personalized itinerary${props.experienceData.destination
          ? " to " + props.experienceData.destination + " now"
          : ""
          }!`}
      ></DesktopBanner>
      <div className="hidden-desktop">
        <MobileBanner
          handleClick={() =>
            openTailoredModal(
              router,
              props.experienceData.id,
              props.experienceData.destination
            )
          }
          city={props.experienceData.destination}
        />
      </div>
      <SetWidthContainer>
        {props.locations && props.locations.length ? (
          <>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
              }}
            >
              Other Destinations
            </H3>
            <OldLocations
              locations={props.locations}
              page_id={props.experienceData.id}
              destination={props.experienceData.destination}
              viewall
              country={country}
              planner
            ></OldLocations>
          </>
        ) : null}

        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: "3.5rem 0 3.5rem 0",
          }}
        >
          Why plan with us?
        </H3>
        <WhyPlanWithUs
          page_id={props.experienceData.id}
          destination={props.experienceData.destination}
          cities={props.experienceData.locations}
        />

        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: "4rem 0 2.5rem 0",
          }}
        >
          Happy Community of The Tarzan Way
        </H3>
        <Reviews></Reviews>
      </SetWidthContainer>

      <SetWidthContainer>
        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: "4rem 0 2.5rem 0",
          }}
        >
          What they say?
        </H3>
        <AsSeenIn />
        <ChatWithUs planner page_id={props.experienceData.id}></ChatWithUs>
      </SetWidthContainer>
    </div>
  );
};

export default Homepage;
