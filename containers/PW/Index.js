import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FullImage from "../../components/FullImage";
import AsSeenIn from "../testimonial/AsSeenIn";
import Heading from "../../components/newheading/heading/Index";
import media from "../../components/media";
import BannerOne from "./BannerOne";
import WhyUs from "../../components/WhyPlanWithUs/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import FullImgContent from "./FullImgContent";
import Menu from "./Menu";
import axiossearchinstance from "../../services/sales/search/Search";
import ExperienceCard from "../../components/cards/newitinerarycard-main/ExperienceCard";
import LoadingLottie from "../../components/ui/LoadingLottie";
import CaseStudies from "../travelplanner/CaseStudies/Index";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 90%;
  }
`;

const MinHeightContainer = styled.div`
  min-height: 40vh;
  @media screen and (min-width: 768px) {
    min-height: 60vh;
  }
`;

const VideoContainer = styled.div`
  width: 90vw;
  height: 50vw;
  @media screen and (min-width: 768px) {
    width: 60vw;
    height: 30vw;
  }
`;

const GridContainer = styled.div`
  display: grid;
  padding: 1rem;
  grid-gap: 1rem;
  @media screen and (min-width: 768px) {
    padding: 2rem 0;
    grid-gap: 2rem;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Homepage = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [loading, setLoading] = useState(true);
  const [itinerariesJSX, setItinerariesJSX] = useState(null);
  const [filters, setFilters] = useState({
    Trek: true,
    "Road Trip": true,
  });

  useEffect(() => {
    let itineraries = [];

    axiossearchinstance
      .post(`?search_type=itinerary&page_id=1`, {
        theme_category: [],
      })
      .then((res) => {
        setLoading(false);
        for (var i = 0; i < res.data.length; i++) {
          itineraries.push(
            <ExperienceCard
              data={res.data[i]}
              key={res.data[i].short_text}
              hardcoded={res.data[i].payment_info ? true : false}
              filter={
                res.data[i].experience_filters
                  ? res.data[i].experience_filters[0]
                  : null
              }
              rating={res.data[i].rating}
              slug={res.data[i].slug}
              id={res.data[i].id}
              number_of_adults={res.data[i].number_of_adults}
              PW={true}
              locations={res.data[i]["itinerary_locations"]}
              text={res.data[i].short_text}
              experience={res.data[i].name}
              cost={
                res.data[i].payment_info
                  ? res.data[i].payment_info.length
                    ? res.data[i].payment_info[0].cost
                    : null
                  : null
              }
              duration_number={res.data[i].duration_number}
              duration_unit={res.data[i].duration_unit}
              location={res.data[i]["experience_region"]}
              starting_cost={
                res.data[i].payment_info
                  ? res.data[i].payment_info.per_person_total_cost
                  : res.data[i].starting_price
              }
              images={res.data[i].images}
            ></ExperienceCard>
          );
        }

        setItinerariesJSX(itineraries);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const _populateResultsHandelr = (filters) => {
    let itineraries = [];
    setLoading(true);

    axiossearchinstance
      .post(`?search_type=itinerary&page_id=1`, {
        theme_category: filters,
      })
      .then((res) => {
        setLoading(false);

        for (var i = 0; i < res.data.length; i++) {
          itineraries.push(
            <ExperienceCard
              data={res.data[i]}
              key={res.data[i].short_text}
              hardcoded={res.data[i].payment_info ? true : false}
              filter={
                res.data[i].experience_filters
                  ? res.data[i].experience_filters[0]
                  : null
              }
              rating={res.data[i].rating}
              slug={res.data[i].slug}
              id={res.data[i].id}
              number_of_adults={res.data[i].number_of_adults}
              PW={true}
              locations={res.data[i]["itinerary_locations"]}
              text={res.data[i].short_text}
              experience={res.data[i].name}
              cost={
                res.data[i].payment_info
                  ? res.data[i].payment_info.length
                    ? res.data[i].payment_info[0].cost
                    : null
                  : null
              }
              duration_number={res.data[i].duration_number}
              duration_unit={res.data[i].duration_unit}
              location={res.data[i]["experience_region"]}
              starting_cost={
                res.data[i].payment_info
                  ? res.data[i].payment_info.per_person_total_cost
                  : res.data[i].starting_price
              }
              images={res.data[i].images}
            ></ExperienceCard>
          );
        }

        setItinerariesJSX(itineraries);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const _fetchResultsHandler = (filter) => {
    let FILTERS = [];
    switch (filter) {
      case "Trek":
        if (!filters["Trek"]) FILTERS.push("Trek");
        if (filters["Road Trip"]) FILTERS.push("Road Trip");
        break;
      case "Road Trip":
        if (!filters["Road Trip"]) FILTERS.push("Road Trip");
        if (filters["Trek"]) FILTERS.push("Trek");
        break;
      default:
        FILTERS.push("Road Trip");
        FILTERS.push("Trek");
    }

    _populateResultsHandelr(FILTERS);
  };

  const _toggleFilterHandler = (filter_text) => {
    switch (filter_text) {
      case "Treks":
        _fetchResultsHandler("Trek");
        setFilters({ ...filters, Trek: !filters["Trek"] });

        break;
      case "Road Trips":
        _fetchResultsHandler("Road Trip");
        setFilters({ ...filters, "Road Trip": !filters["Road Trip"] });
        break;
      default:
        _fetchResultsHandler();
    }
  };

  return (
    <div
      className={"Homepage"}
      id="homepage-anchor"
      style={{ visibility: props.hidden ? "hidden" : "visible" }}
    >
      <FullImage
        url="media/website/Andaman.jpeg"
        filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"
      >
        <FullImgContent />
      </FullImage>
      <BannerOne></BannerOne>

      <Menu
        _toggleFilterHandler={_toggleFilterHandler}
        filters={filters}
      ></Menu>

      <SetWidthContainer>
        <div id="holi"></div>
        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem" : "2.5rem 0rem"}
          bold
          noline
        >
          Recommended trips for you
        </Heading>
        {!loading ? (
          <GridContainer>{itinerariesJSX}</GridContainer>
        ) : (
          <MinHeightContainer className="center-div">
            <LoadingLottie height={"5rem"} width={"5rem"} margin="none" />{" "}
          </MinHeightContainer>
        )}
      </SetWidthContainer>

      <SetWidthContainer id="link">
        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem" : "2.5rem 0rem"}
          bold
          noline
        >
          How it works?
        </Heading>

        <VideoContainer
          style={{ position: "relative", display: "block", margin: "auto" }}
        >
          <iframe
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
            }}
            src="https://www.youtube.com/embed/NQ5aHR_HNzg"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </VideoContainer>

        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem" : "2.5rem 0rem"}
          bold
          noline
        >
          Why plan with us?
        </Heading>

        <div style={{ marginBottom: "3rem" }}>
          <WhyUs></WhyUs>
        </div>
      </SetWidthContainer>

      <SetWidthContainer>
        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem" : "2.5rem 0rem"}
          bold
          noline
        >
          What They Say?
        </Heading>
        <AsSeenIn disablelinks></AsSeenIn>
        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem" : "2.5rem 0rem"}
          bold
          noline
        >
          Happy Community of The Tarzan Way
        </Heading>
        <CaseStudies></CaseStudies>
        <ChatWithUs></ChatWithUs>
      </SetWidthContainer>
      <div className="hidden-desktop"></div>
    </div>
  );
};

export default Homepage;
