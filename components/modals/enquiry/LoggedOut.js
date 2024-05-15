import React, { useState } from "react";
import Heading from "../../newheading/heading/Index";
import styled, { keyframes } from "styled-components";
import TextField from "@mui/material/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { fadeIn } from "react-animations";

const LoggedOut = (props) => {
  const fadeInAnimation = keyframes`${fadeIn}`;
  const [index, setIndex] = useState(0);

  const ModalTitle = styled.h1`
    font-size: ${(props) => props.theme.fontsizes.desktop.headings.two};
    text-align: center;
  `;

  const OptionField = styled(TextField)`
    width: 50%;
  `;

  const _prevQuestionHandler = (event) => {
    setIndex(index - 1);
  };

  const _nextQuestionHandler = (event) => {
    setIndex(index + 1);
  };

  const _nextQuestionEnterHandler = (event) => {
    if (event.key === "Enter") setIndex(index + 1);
  };

  const StyledHeading = styled(Heading)``;

  const Animate = styled.div`
    animation: ${fadeInAnimation} ease 1s;
  `;
  
  const Questions = [
    <StyledHeading align="center" margin="2rem">
      Enter your name
    </StyledHeading>,
    <StyledHeading align="center" margin="2rem">
      Enter your email
    </StyledHeading>,
    <StyledHeading align="center" margin="2rem">
      Enter your phone
    </StyledHeading>,
    <StyledHeading align="center" margin="2rem">
      Enter your query
    </StyledHeading>,
    <StyledHeading align="center" margin="2rem">
      We'll get back to you in 24 hours.
    </StyledHeading>,
  ];

  const Options = [
    <OptionField
      id="standard-basic"
      placeholder="Jon Snow"
      onKeyDown={_nextQuestionEnterHandler}
    />,
    <OptionField
      id="standard-basic"
      placeholder="name@webiste.com"
      onKeyDown={_nextQuestionEnterHandler}
    />,
    <OptionField
      id="standard-basic"
      placeholder="+91 9999999999"
      onKeyDown={_nextQuestionEnterHandler}
    />,
    <OptionField
      id="standard-basic"
      placeholder="Enter Query"
      onKeyDown={_nextQuestionEnterHandler}
    />,
  ];
  return (
    <div>
      <ModalTitle className="font-nunito">
        {index === 4 ? "Your reponse has been submitted :)" : props.title}
      </ModalTitle>
      <Animate>{Questions[index]}</Animate>
      <div style={{ textAlign: "center" }}>
        <Animate>{Options[index]}</Animate>
        <br></br>
        {index === 4 ? null : (
          <FontAwesomeIcon
            icon={faAngleLeft}
            style={{ fontSize: "4rem", margin: "3rem 2rem" }}
            onClick={_prevQuestionHandler}
          ></FontAwesomeIcon>
        )}
        {index === 4 ? null : (
          <FontAwesomeIcon
            icon={faAngleRight}
            style={{ fontSize: "4rem", margin: "3rem 2rem" }}
            onClick={_nextQuestionHandler}
          ></FontAwesomeIcon>
        )}
      </div>
    </div>
  );
};

export default LoggedOut;
