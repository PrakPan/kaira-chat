import React, { useState } from "react";
import styled from "styled-components";
import media from "../../media";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Button from "../../Button";
import Progress from "./Progress";
import urls from "../../../services/urls";

const Container = styled.div`
  width: 100vw;
  height: 100vw;

  position: absolute;
`;

const InnerContainer = styled.div`
  width: 50vw;
  min-height: 50vh;
  position: sticky;
  z-index: 1000;
  top: 0vh;
  left: 25vw;
  background-color: white;
  float: right;
  border-style: solid;
  border-color: #f7e700;
  border-width: 5px;
`;

const Time = styled.p`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 300;
`;

const ButtonsContainer = styled.div`
  min-width: 35%;
`;

const TimeRemaining = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
`;

const Timer = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [timer, setTimer] = useState("");
  const [hideTimer, setHideTimer] = useState(false);

  const _handleTimerClose = () => {
    window.scrollTo(0, window.innerHeight);
    setHideTimer(true);
    props._hideTimerHandler();
  };

  if (isPageWide)
    return (
      <InnerContainer
        style={{
          width: hideTimer ? "max-content" : "30vw",
          left: hideTimer ? "auto" : "35vw",
          right: hideTimer ? "0" : "auto",
          position: hideTimer ? "sticky" : "sticky",
          top: hideTimer ? "12.5vh" : "15vh",
          minHeight: hideTimer ? "max-content" : "70vh",
          float: hideTimer ? "right" : "none",
          padding: hideTimer ? "1rem" : "0",
        }}
        className="borde center-div"
      >
        <TimeRemaining
          style={{ fontSize: hideTimer ? "1rem" : "1.5rem" }}
          className="font-lexend"
        >
          Time Remaining
        </TimeRemaining>
        <Time>{timer}</Time>
        {!hideTimer ? <Progress></Progress> : null}
        <ButtonsContainer>
          {hideTimer ? null : (
            <Button
              hoverColor="white"
              width="100%"
              hoverBgColor="black"
              borderRadius="2rem"
              bgColor="white"
              margin="0.5rem auto"
              onclick={_handleTimerClose}
            >
              Show Itinerary
            </Button>
          )}
          {hideTimer ? null : (
            <Button
              onclick={() =>
                (window.location.href =
                  urls.WHATSAPP +
                  "?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20")
              }
              hoverColor="white"
              hoverBgColor="black"
              onclickparam={null}
              width="100%"
              bgColor="white"
              borderRadius="2rem"
              borderColor="black"
              margin="0"
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                style={{ marginRight: "0.5rem" }}
              />
              Connect on WhatsApp
            </Button>
          )}
        </ButtonsContainer>
      </InnerContainer>
    );
  else
    return (
      <Container>
        <InnerContainer
          style={{
            width: hideTimer ? "max-content" : "70vw",
            left: hideTimer ? "auto" : "15vw",
            right: hideTimer ? "0" : "auto",
            position: hideTimer ? "sticky" : "sticky",
            top: hideTimer ? "12.5vh" : "15vh",
            minHeight: hideTimer ? "max-content" : "70vh",
            float: hideTimer ? "right" : "none",
            padding: hideTimer ? "1rem" : "0",
          }}
          className="borde center-div"
        >
          <TimeRemaining
            style={{ fontSize: hideTimer ? "1rem" : "1.5rem" }}
            className="font-lexend"
          >
            Time Remaining
          </TimeRemaining>
          <Time>{timer}</Time>
          {!hideTimer ? <Progress></Progress> : null}
          <ButtonsContainer>
            {hideTimer ? null : (
              <Button
                hoverColor="white"
                width="100%"
                hoverBgColor="black"
                borderRadius="2rem"
                bgColor="white"
                margin="0.5rem auto"
                onclick={_handleTimerClose}
              >
                Show Itinerary
              </Button>
            )}
            {hideTimer ? null : (
              <Button
                onclick={() =>
                  (window.location.href =
                    urls.WHATSAPP +
                    "?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20")
                }
                hoverColor="white"
                hoverBgColor="black"
                onclickparam={null}
                width="100%"
                bgColor="white"
                borderRadius="2rem"
                borderColor="black"
                margin="0"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  style={{ marginRight: "0.5rem" }}
                />
                Connect on WhatsApp
              </Button>
            )}
          </ButtonsContainer>
        </InnerContainer>
      </Container>
    );
};

export default Timer;
