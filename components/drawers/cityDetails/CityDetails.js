import React from "react";
import { useState } from "react";
import ImageLoader from "../../ImageLoader";
import media from "../../media";
import styled from "styled-components";
import Text from "./Text";
import WeatherWidget from "../../WeatherWidget/WeatherWidget";
import dynamic from "next/dynamic";
import Button from "../../ui/button/Index";
import { Link } from "react-scroll";
const MapBox = dynamic(() => import("../../Map.js"), {
  ssr: false,
});

const Title = styled.p`
  font-weight: 600;
  font-size: 20px;
  margin-block: 1rem 0rem;
`;

const MapInfo = styled.div`
  b {
    font-weight: 600;
  }
`;

const Heading = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-block: 0rem;
`;

const WeatherContainer = styled.div`
  border: 1px solid #eceaea;
  border-radius: 10px;
  padding: 25px;
  height: max-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  margin-top: 1rem;
  @media screen and (min-width: 768px) {
    margin-top: 0rem;
  }
`;

const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 16px;
  width: 100vw;
  @media screen and (min-width: 768px) {
    width: 500px;
  }
`;

const TimeStamp = styled.p`
  height: 31px;
  padding: 4px 8px;
  background-color: #000000bf;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  position: absolute;
  bottom: 0px;
  right: 20px;
`;

const CityDetails = (props) => {
  const [imageLoading, setImageLoading] = useState(true);
  let isPageWide = media("(min-width: 768px)");
  function scrollToTargetAdjusted(id) {
    const element = document.getElementById(id);
    const headerOffset = 117;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
    });
  }
  const InfoWindowContainer = (location) => (
    <MapInfo>
      <b>{location.name}</b>
      <div>
        {location.experience_filters.map((e, i) =>
          i != 0 ? <span key={i}>{", " + e}</span> : <span key={i}>{e}</span>
        )}
      </div>
      {location.ideal_duration_hours && (
        <p>Ideal duration : {location.ideal_duration_hours} hrs</p>
      )}
    </MapInfo>
  );
  return (
    <Container style={{ padding: "0.5rem 1rem" }}>
      <div style={{ position: "relative" }}>
        <ImageLoader
          borderRadius="8px"
          marginTop="23px"
          widthMobile="100%"
          style={imageLoading ? { display: "none" } : {}}
          url={props.data?.images[0].image || props.data?.images[1].image}
          dimensionsMobile={{ width: 500, height: 280 }}
          dimensions={{ width: 468, height: 188 }}
          yuu
          onload={() => {
            setImageLoading(false);
          }}
          noLazy
        ></ImageLoader>
        {!imageLoading&&<TimeStamp>
          Ideal duration - {props.data.ideal_duration_days} days
        </TimeStamp>}
      </div>
      {imageLoading && (
        <div
          style={{ width: isPageWide ? "468px" : "100%", height: "188px" }}
        />
      )}
      <Title>{props.data.name}</Title>
      {props.data.short_description && (
        <div>
          <Text text={props.data.short_description} />
        </div>
      )}
      <Link to={props.data.name} offset={-50}>
        {props.dayId ? (
          <Button
            onclick={() => {
              props.onHide();
              scrollToTargetAdjusted(props.dayId);
            }}
            style={{ marginInline: "auto" }}
            margin="1rem auto"
            borderRadius="8px"
          >
            View {props.data.name} in your itinerary
          </Button>
        ) : (
          <></>
        )}
      </Link>
      {props.data.pois && props.data.pois.length ? (
        <div>
          <MapBox
            locations={props.data.pois}
            defaultZoom={12}
            height={"300px"}
            InfoWindowContainer={InfoWindowContainer}
          />
        </div>
      ) : (
        <div></div>
      )}
      <Heading>Weather in {props.data.name}</Heading>
      <WeatherContainer>
        <WeatherWidget
          city={props.data.name}
          lat={props.data.lat}
          lon={props.data.lon}
        />
        {props.elevation && (
          <div>
            <TextBold>Altitude</TextBold>
            <p style={{ fontWeight: "300", marginBottom: "0" }}>
              {Math.floor(props.elevation)} metres (
              {Math.floor(props.elevation * 3.281)} feet) above sea level
            </p>
          </div>
        )}
      </WeatherContainer>
      {props.data.conveyance_available && (
        <>
          <Heading>How to reach</Heading>
          <Text text={props.data.conveyance_available} />
        </>
      )}
    </Container>
  );
};

export default CityDetails;
