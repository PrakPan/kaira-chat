import React from "react";
import styled from "styled-components";
import media from "../../components/media";
import Heading from "../../components/newheading/heading/Index";
import Experiences from "../../components/containers/Experiences";
import Banner from "../homepage/banner/Mobile";
import Blogs from "../../components/containers/Blogs";
import SwiperLocations from "../../components/containers/SwiperLocations/Index";

const SetWidthContainer = styled.div`
  width: 100%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 90%;
    padding: 0 2rem;
  }
`;

const Details = (props) => {
  let isPageWide = media("(min-width: 768px)");
  let JSX = [];

  for (var i = 0; i < props.data.length; i++) {
    JSX.push(
      <Heading
        key={i}
        align="center"
        aligndesktop="left"
        margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "5rem 0"}
        bold
      >
        {props.data[i].name}
      </Heading>
    );

    let experiences = [];
    let blogs = [];
    let locations = [];

    if (props.data[i].cities.length) {
      for (var j = 0; j < props.data[i].cities.length; j++)
        locations.push(props.data[i].cities[j]);
      JSX.push(<SwiperLocations locations={locations}></SwiperLocations>);
      JSX.push(<div key={i + 1000} style={{ margin: "5rem" }}></div>);
    }
    if (props.data[i].itineraries.length) {
      for (var j = 0; j < props.data[i].itineraries.length; j++)
        experiences.push(props.data[i].itineraries[j]);
      JSX.push(
        <Experiences margin="0" experiences={experiences}></Experiences>
      );
      JSX.push(<div key={i + 2000} style={{ margin: "5rem" }}></div>);
    }
    if (props.data[i].blogs.length) {
      for (var j = 0; j < props.data[i].blogs.length; j++)
        blogs.push(props.data[i].blogs[j]);
      JSX.push(<Blogs cityblogs={blogs} margin="0"></Blogs>);
    }
  }

  return (
    <div>
      <SetWidthContainer>{JSX}</SetWidthContainer>
      {!isPageWide ? (
        <Banner
          text="Want to craft your own travel experience?"
          buttontext="Start Now"
          color="black"
          buttonbgcolor="#f7e700"
        ></Banner>
      ) : null}
    </div>
  );
};

export default React.memo(Details);
