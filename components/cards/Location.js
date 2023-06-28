import React, { useState } from "react";
import styled from "styled-components";
import BackroundImageLoader from "../UpdatedBackgroundImageLoader";
import media from "../media";
import Button from "../ui/button/Index";
const Container = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  height: 60vh;
  position: relative;
  @media screen and (min-width: 768px) {
    margin: 0;
    max-width: 100%;
    height: 50vh;
  }
  &:hover {
    cursor: pointer;
    .TextContainer {
      bottom : 23%;
    }
    .CtaContainer{
      height : 20%;
    }
  }
`;
const TextContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  flex-direction: column;
  // margin-bottom: 2rem;
  position: absolute;
  bottom: 8%;
  ${(props) => props.loading && "bottom : 23%"};

  transition: bottom 0.3s ease;
`;
const CtaContainer = styled.div`
position absolute;
color : white;
font-size : 3rem;
 background: linear-gradient(to bottom, transparent, black);
overflow : hidden;
bottom : 0;
left : 0;
right : 0;
height : 0%;
${props => props.loading && 'height : 20%'};
   transition : height 0.3s ease;
`;

const Name = styled.p`
  text-align: center;
  padding: 0rem 0;
  color: white;
  font-weight: 500;
  margin: 0;
  line-height: 1;
  font-weight: 300;
  font-size: 22px;
  width: 100%;
  letter-spacing: 1px;
  @media screen and (min-width: 768px) {
  }
`;
const Experiences = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [loading , setLoading] = useState(false)
  /*Require props: imgWidth*/

  return (
    <Container onClick={props.onclick ? props.onclick : null}>
      <BackroundImageLoader
        filter="linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))"
        // filter="brightness(0.65)"
        padding="0"
        zoomonhover
        // center
        dimensions={{ width: 900, height: 1800 }}
        height={isPageWide ? "50vh" : "60vh"}
        url={props.img}
      >
        <TextContainer loading={loading} className="TextContainer">
          <Name className="font-lexend">{props.heading}</Name>
          <Name
            className="font-lexend"
            style={{
              fontSize: "28px",
              fontWeight: "700",
              letterSpacing: "0",
              marginTop: "0.5rem",
            }}
          >
            {props.location}
          </Name>
        </TextContainer>
      </BackroundImageLoader>
      <CtaContainer loading={loading} className="CtaContainer">
        <Button
          margin="1.5rem auto"
          color="white"
          borderColor="white"
          borderRadius="50px"
          style={{ maxWidth: "95%", fontSize: "0.9rem" }}
          loading={loading}
          onclick={() => {
            if (props.onclick) {
              setLoading(true);
              props.onclick();
            }
          }}
        >
          Plan trip to {props.location} !
        </Button>
      </CtaContainer>
    </Container>
  );
};

export default Experiences;
