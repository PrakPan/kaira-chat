import styled from "styled-components";
import Brief from "./MenuItems/Brief";
import TopRecommendations from "./MenuItems/TopRecommendation";
import Poi from "./pois/Index";
import Activity from "./activities/Index";
import FoodToEat from "./MenuItems/FoodToEat";
import WhyPlanWithUs from "../../components/WhyPlanWithUs/PlanWithUsWithEnquiry";
import Reviews from "../travelplanner/CaseStudies/Index";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";
import NearbyLocations from "./MenuItems/NearbyLocations";
import AsSeenIn from "../testimonial/AsSeenIn";
import PathNavigation from "../travelplanner/PathNavigation";
import H3 from "../../components/heading/H3";
import media from "../../components/media";

const MenuContainer = styled.div`
  width: 95%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 85%;
  }

  #Brief {
    grid-area: Brief;
  }
  #Itinerary {
    grid-area: Itinerary;
  }
  #Places {
    grid-area: Places;
  }
  #Food {
    grid-area: Food;
  }
  #Reach {
    grid-area: Reach;
  }
  #Survival {
    grid-area: Survival;
  }
  #Folklore {
    grid-area: Folklore;
  }
  #Why {
    grid-area: Why;
  }
  #Customers {
    grid-area: Customers;
  }

  #nearby-places {
    grid-area: nearby-places;
  }
  ${(props) =>
    props.thingsToDoPage
      ? 'display : grid;grid-template-areas : "Places" "Food" "nearby-places" "Itinerary" "Reach" "Survival" "Folklore" "Why" "Customers"'
      : ""}
`;

const MenuItem = styled.div`
  @media screen and (min-width: 1400px) {
    margin-right: ${(props) => (props.single ? "29%" : "0")};
  }
`;

const P = styled.p`link
  font-weight: 300;
  text-align: left;
  line-height: 32px;
  @media screen and (min-width: 768px) {
    font-size: 16px;
  }
`;

const Menu = (props) => {
  let isPageWide = media("(min-width: 768px)");
  return (
    <MenuContainer thingsToDoPage={props.thingsToDoPage}>
      <PathNavigation path={props.data?.path} />

      {!!props.data.itinerary_data.length && (
        <MenuItem id="Itinerary">
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Trips by our users to {props.data.name}
          </H3>
          <TopRecommendations itinerary_data={props.data.itinerary_data} />
        </MenuItem>
      )}

      {props.data.short_description && !props.thingsToDoPage && (
        <MenuItem id="Brief">
          <H3 style={{ margin: "30px 0 30px 0" }}>
            {"A little about " + props.data.name}
          </H3>
          <Brief
            short_description={props.data.short_description}
            lat={props.data.lat}
            lon={props.data.long}
            name={props.data.name}
            elevation={
              props.data.elevation &&
              props.data.elevation.length &&
              props.data.elevation[0]?.elevation
            }
          />
        </MenuItem>
      )}

      {props.data.activities.length ? (
        <MenuItem id="Activities">
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Things to do in {props.data.name}
          </H3>
          <Activity
            data={props.data}
            activities={props.data.activities}
            city={props.data.name}
          />
        </MenuItem>
      ) : null}

      {!!props.data.pois.length && (
        <MenuItem id="Places">
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Places to visit in {props.data.name}
          </H3>
          <Poi
            elevation={props.elevation}
            data={props.data}
            thingsToDoPage={props.thingsToDoPage}
            pois={props.data.pois}
            city={props.data.name}
          />
        </MenuItem>
      )}

      <MenuItem id="nearby-places">
        <NearbyLocations nearbyCities={props.nearbyCities} data={props.data} />
      </MenuItem>

      {!!props.data.foods.length && (
        <MenuItem id="Food" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            }}
          >
            Food to eat
          </H3>
          <FoodToEat foods={props.data.foods} />
        </MenuItem>
      )}

      {props.data.conveyance_available && (
        <MenuItem id="Reach" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
              marginBottom: "1rem",
            }}
          >
            How to reach
          </H3>
          <P className="font-light">{props.data.conveyance_available}</P>
        </MenuItem>
      )}

      {props.data.survival_tips_and_tricks && (
        <MenuItem id="Survival" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Survival Tips & Tricks
          </H3>
          <P>{props.data.survival_tips_and_tricks}</P>
        </MenuItem>
      )}

      {props.data.folklore_or_story && (
        <MenuItem id="Folklore" single>
          <H3
            style={{
              lineHeight: "48px",
              marginBlock: isPageWide ? "3.5rem" : "1.5rem",
              marginBottom: "1rem",
            }}
          >
            Folklore or Story
          </H3>
          <P>{props.data.folklore_or_story}</P>
        </MenuItem>
      )}

      <MenuItem id="Why">
        <H3
          style={{
            lineHeight: "48px",
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
          }}
        >
          Why plan with us?
        </H3>
        <WhyPlanWithUs
          page_id={props.data.id}
          destination={props.destination}
        />
      </MenuItem>

      <MenuItem id="Customers">
        <H3
          style={{
            lineHeight: "48px",
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Happy Community of The Tarzan Way
        </H3>
        <Reviews />
      </MenuItem>

      <MenuItem>
        <H3
          style={{
            lineHeight: "48px",
            marginBlock: isPageWide ? "3.5rem" : "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          What they say?
        </H3>
        <AsSeenIn />
        <ChatWithUs />
      </MenuItem>
    </MenuContainer>
  );
};

export default Menu;
