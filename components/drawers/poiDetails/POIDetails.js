import React from "react";
import styled from "styled-components";
import { useState } from "react";
import ImageLoader from "../../ImageLoader";
import media from "../../media";
import { TbArrowBack } from "react-icons/tb";
import SkeletonCard from "../../ui/SkeletonCard";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const Title = styled.p`
  font-weight: 800;
  font-size: 20px;
`;

const Reviews = styled.div`
  display: flex;
  align-items: center;
  margin-block: 0.5rem;
  gap: 0.2rem;
  p,
  u {
    font-size: 12px;
    color: #7a7a7a;
  }
  u {
    margin-inline: 0.2rem;
  }
`;

const Text = styled.p`
  font-size: 14px;
`;

const Heading = styled.p`
  font-size: 18px;
  font-weight: 800;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: ${(props) => (props.itineraryDrawer ? "0 1rem 1rem 1rem" : "1rem")};
  width: 100vw;
  @media screen and (min-width: 768px) {
    width: 500px;
  }
`;

const TimeStamp = styled.span`
  height: 31px;
  padding: 4px 8px;
  background-color: #000000bf;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  position: absolute;
  left: 10px;
  bottom: 10px;
  @media screen and (min-width: 768px) {
    bottom: 10px;

    left: 300px;
  }
`;

const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const POIDetails = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);
  var about = <p>{props?.data?.short_description} </p>;
  const [aboutText, setAboutText] = useState(about);

  var experience_filters = (
    <div>
      {props.data.experience_filters?.map((e, i) => (
        <span key={i}>
          {e} {props.data.experience_filters.length - 1 == i ? "" : <b>·</b>}{" "}
        </span>
      ))}
    </div>
  );

  var tips = (
    <ul style={{ paddingLeft: "0.5rem" }}>
      {props.data.tips?.map((e, i) => (
        <li key={i}>- {e}</li>
      ))}
    </ul>
  );

  var stars = [];
  for (let i = 0; i < Math.floor(props.data.rating); i++) {
    stars.push(<FaStar />);
  }

  if (Math.floor(props.data.rating) < props.data.rating)
    stars.push(<FaStarHalfAlt />);

  return (
    <Container itineraryDrawer={props.itineraryDrawer}>
      {!props.itineraryDrawer ? (
        <div>
          <TbArrowBack
            style={{ height: "32px", width: "32px" }}
            cursor={"pointer"}
            onClick={(e) => {
              props.handleCloseDrawer(e);
            }}
          />
        </div>
      ) : (
        <BackContainer className=" font-lexend">
          <IoMdClose
            className="hover-pointer"
            onClick={(e) => {
              props.handleCloseDrawer(e);
            }}
            style={{ fontSize: "2rem" }}
          ></IoMdClose>
          <BackText>Back to Itinerary</BackText>
        </BackContainer>
      )}

      <ImageContainer style={{ height: "188px" }}>
        <div>
          <div style={{ display: imageLoaded ? "initial" : "none" }}>
            <ImageLoader
              borderRadius="8px"
              marginTop="23px"
              widthMobile="100%"
              url={
                props.data.image && !imageFail
                  ? props.data.image
                  : "media/icons/bookings/notfounds/noroom.png"
              }
              dimensionsMobile={{ width: 500, height: 280 }}
              dimensions={{ width: 468, height: 188 }}
              onload={() => {
                setTimeout(() => {
                  setImageLoaded(true);
                }, 1000);
              }}
              onfail={() => {
                setImageFail(true);
                setImageLoaded(true);
              }}
              noLazy
            ></ImageLoader>
          </div>
          <div
            style={{
              display: !imageLoaded ? "initial" : "none",
            }}
          >
            <div
              style={{
                width: isPageWide ? "468px" : "100%",
                height: "188px",
                overflow: "hidden",
                borderRadius: "8px",
              }}
            >
              <SkeletonCard />
            </div>
          </div>
        </div>
        {props.data.ideal_duration_hours || props.data.ideal_duration_number ? (
          <TimeStamp>
            Approx Time :{" "}
            {props.data.ideal_duration_hours ||
              props.data.ideal_duration_number}{" "}
            hrs
          </TimeStamp>
        ) : (
          <></>
        )}
      </ImageContainer>
      <div>
        <Title>{props.data.name}</Title>
        {props.data.address && (
          <div>
            <span className="font-bold pr-1">Address:</span>{" "}
            {props.data.address}
          </div>
        )}
        <Reviews>
          {props.data.rating && (
            <div
              style={{ color: "#FFD201", marginBottom: "0.3rem" }}
              className="flex flex-row gap-1"
            >
              {stars}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            {props.data.rating && (
              <p style={{ marginBlock: "auto" }}>{props.data.rating} · </p>
            )}

            {props.data.user_ratings_total && (
              <u>
                {" "}
                {props.data.user_ratings_total}{" "}
                {props.data.activity_type ? "user reviews" : "Google reviews"}
              </u>
            )}
          </div>
        </Reviews>
        {props.data.experience_filters && <Text>{experience_filters}</Text>}
      </div>
      {props.data?.cost ? (
        <div className="flex flex-row">
          Cost: <span className="font-semibold px-1">₹</span>{props.data.cost}{" /- "}{"Per person"}
        </div>
      ) : (
        <div className="flex flex-row">
          Cost: Complimentary Activity
        </div>
      )}
      {props.data.short_description && (
        <div>
          <Heading>About</Heading>
          <Text onClick={() => setAboutText(props.data.short_description)}>
            {aboutText}
          </Text>
        </div>
      )}
      {props.data.getting_around && (
        <div>
          <Heading>Getting Around</Heading>
          <Text>{props.data.getting_around}</Text>
        </div>
      )}
      {props.data.timings && (
        <div>
          <Heading>Timings</Heading>
          <Text>
            {
              <ul>
                {props.data.timings.weekday_text?.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            }
          </Text>
        </div>
      )}
      {props.data.tips && props.data.tips.length ? (
        <div>
          <Heading>Tips</Heading>
          <Text>{tips}</Text>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
};

export default POIDetails;
