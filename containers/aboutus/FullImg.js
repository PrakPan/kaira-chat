import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-scroll";
import classes from "./FullImg.module.css";

const TextContainer = styled.div`
  position: absolute;
  top: 10%;
  padding: 0.3rem;
  color: white;

  @media screen and (min-width: 768px) {
    padding: none;
    top: 18%;
    left: 5%;
  }
`;

const Heading = styled.h1`
  width: 100%;
  font-size: 3.5rem;
  font-weight: 650;
  margin: 2rem auto;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 6rem;
    text-align: left;
  }
`;

const Text = styled.p`
  font-size: 1rem;
  text-align: center;
  font-weight: 300 !important;
  width: 90%;
  margin: auto;
  @media screen and (min-width: 768px) {
    width: 70%;
    margin: 0;
    font-size: 1.5rem;
    text-align: left;
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    width: 80%;
  }
`;

const FontDiv = styled.span`
  @media screen and (min-width: 768px) {
    font-size: 6rem;
  }
  font-size: 4rem;
  position: absolute;

  left: 50%;

  transform: translate(-50%, -80%);
`;

const FullImg = () => {
  return (
    <div className={classes.Container}>
      <div className={classes.BackgroundImg}></div>
      <TextContainer>
        <Heading className="font-lexend">About Us</Heading>
        <Text className="font-nunito">
          What started as a way to do something during college turned into a
          venture to revolutionize the travel industry by becoming a travel
          buddy for every traveler.
        </Text>
        <br></br>
        <Text className="font-nunito">
          Celebrating the uniqueness of every traveler and recognizing their
          independent needs, we took a step forward by proffering authentic,
          immersive and personalized travel experience to globetrotters around
          the world.
        </Text>
      </TextContainer>

      <Link
        style={{ textDecoration: "none" }}
        to="about-anchor"
        smooth={true}
        duration={500}
      >
        <FontDiv>
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{ color: "white", animation: "bounce 2s infinite" }}
          ></FontAwesomeIcon>
        </FontDiv>
      </Link>
    </div>
  );
};

export default FullImg;
