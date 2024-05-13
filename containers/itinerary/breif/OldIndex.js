import React from "react";
import Row from "../../../components/experiencecity/info/Row";
import Route from "./route/Index";
import Overview from "./overview/Index";
import styled from "styled-components";
import { useRouter } from "next/router";
import DesktopBanner from "../../../components/containers/Banner";
import Banner from "../../homepage/banner/Mobile";
import openTailoredModal from "../../../services/openTailoredModal";

const DetailsContainer = styled.div`
  width: 100%;
  margin: 0 auto 10vh auto;
  padding: 0 1rem;
  @media screen and (min-width: 768px) {
    width: 80%;
    padding: 0;
    margin: 10vh auto 10vh auto;
  }
`;

const Details = (props) => {
  const router = useRouter();

  return (
    <div>
      <DetailsContainer>
        <div>
          <div id="route">
            <Row class="experience-headings" heading="Route">
              <Route breif={props.breif}></Route>
            </Row>
          </div>
        </div>
        <div>
          <div id="route">
            <Row class="experience-headings" heading={"Locations"}>
              {true ? <Overview breif={props.breif}></Overview> : null}
            </Row>
          </div>
        </div>
      </DetailsContainer>
      {props.traveleritinerary ? (
        <DesktopBanner
          onclick={() => openTailoredModal(router)}
          text="Want to personalize your own experience like this?"
        ></DesktopBanner>
      ) : null}
      {props.traveleritinerary ? (
        <div className="hidden-desktop">
          <Banner
            text="Want to craft your own travel experience like this?"
            buttontext="Start Now"
            color="black"
            buttonbgcolor="#f7e700"
          ></Banner>
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(Details);
