import SwiperLocations from "../../components/containers/SwiperLocations/Index";
import styled from "styled-components";
import HeroBanner from "../../components/containers/HeroBanner/HeroBanner";
import Button from "../../components/ui/button/Index";
import PlanAsPerTheme from "../../containers/homepage/PlanAsPerTheme";
import PlanWithUs from "../../components/WhyPlanWithUs/Index";
import CaseStudies from "../../containers/travelplanner/CaseStudies/Index";
import { useRouter } from "next/router";
import media from "../../components/media";
import { logEvent } from "../../services/ga/Index";
import H3 from "../../components/heading/H3";

const Container = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }
`;

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 1.5rem 0.5rem;
  text-align: center;

  @media screen and (min-width: 768px) {
    text-align: left;
    margin: 3.5rem 0rem;
  }
`;

export default function DestinationsPageContainer({
  allDestinations,
  ThemeData,
  Count,
}) {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");

  const handlePlanButton = async (slug, continent) => {
    logEvent({
      action: "View_Destination",
      params: {
        page: "Destinations Page",
        event_category: "Button Click",
        event_label: "View Destination",
        event_value: continent,
        event_action: `Top countries to visit${" in " + continent}`,
      },
    });
    await router.push(`/${slug}`);
  };

  return (
    <>
      <HeroBanner
        image={
          allDestinations.length ? allDestinations[0].locations[0].image : ""
        }
        destination={""}
        title={`All Destinations Trip Planner`}
        page={"Destinations Page"}
      />

      <Container className="flex flex-col justify-center mb-5">
        {allDestinations && allDestinations.length
          ? allDestinations.map((dest, index) => (
              <div key={index} className="">
                <H3
                  style={{
                    textAlign: isPageWide ? "left" : "center",
                    margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
                  }}
                >
                  Top countries to visit in {dest.continent.title}
                </H3>

                <SwiperLocations
                  locations={dest.locations}
                  destination={dest.continent.title}
                  continent={dest.continent.title}
                  page={"Destinations Page"}
                  country
                  viewall
                ></SwiperLocations>

                <div className="w-full flex items-center justify-center mt-5">
                  <Button
                    onclick={() => {
                      logEvent({
                        action: "Create_Travel_Plan",
                        params: {
                          page: "Destinations Page",
                          event_category: "Button Click",
                          event_label: `Create your travel plan to ${dest.continent.title}`,
                          event_action: "Continent Section",
                          destination: dest.continent.title,
                        },
                      });
                      handlePlanButton(
                        dest.continent.slug,
                        dest.continent.title
                      );
                    }}
                    borderWidth="1px"
                    fontWeight="500"
                    borderRadius="6px"
                    margin="2rem auto"
                    padding="0.5rem 2rem"
                  >
                    Create your travel plan to {dest.continent.title}
                  </Button>
                </div>
              </div>
            ))
          : null}

        {ThemeData && ThemeData.length ? (
          <>
            <H3
              style={{
                textAlign: isPageWide ? "left" : "center",
                margin: isPageWide
                  ? "3rem 0 2rem 0"
                  : "2.5rem 0.5rem 1.5rem 0.5rem",
              }}
            >
              Plan trip as per mood
            </H3>
            <PlanAsPerTheme
              ThemeData={ThemeData}
              Count={Count}
              page={"Destinations Page"}
            />
          </>
        ) : null}

        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
          }}
        >
          Why plan with us?
        </H3>
        <PlanWithUs />

        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: isPageWide ? "3.5rem 0rem" : "1.5rem 0.5rem",
          }}
        >
          Happy Community of The Tarzan Way
        </H3>
        <CaseStudies></CaseStudies>
      </Container>
    </>
  );
}
