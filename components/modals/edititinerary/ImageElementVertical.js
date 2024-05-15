import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: 100%;
  color: black !important;
  text-align: center;
`;

const PoiName = styled.p`
  font-size: ${(props) => props.theme.fontsizes.desktop.text.default};
  font-weight: 600;
  margin: 0.5rem 0;
  &:hover {
  }
`;

const ImgContainer = styled.div`
  width: 10vw;
  margin: auto;
  height: 10vw;
  border-radius: 50%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
`;

const Selected = styled.div`
  width: max-content;
`;

const Poi = (props) => {
  const [selectedState, setSelectedState] = useState({
    one: false,
  });
  const [hoverState, setHoverState] = useState({
    one: false,
  });

  return (
    <Container>
      <ImgContainer
        className="center-div"
        onClick={() =>
          setSelectedState({ ...selectedState, one: !selectedState.one })
        }
        style={{ backgroundImage: `url(${props.image})` }}
        onMouseEnter={() => setHoverState({ ...hoverState, one: true })}
        onMouseLeave={() => setHoverState({ ...hoverState, one: false })}
      >
        {selectedState.one ? (
          <div
            style={{
              backgroundColor: "rgba(247, 231, 0, 0.6)",
              height: "100%",
              width: "100%",
              borderRadius: "50%",
            }}
            className="center-div"
          >
            <Selected>
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            </Selected>
          </div>
        ) : null}
        {hoverState.one && !selectedState.one ? (
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              height: "100%",
              width: "100%",
              borderRadius: "50%",
            }}
          ></div>
        ) : null}
      </ImgContainer>
      <div style={{ padding: "0 1rem" }}>
        <PoiName className="">
          <b>{props.name}</b>
        </PoiName>
      </div>
    </Container>
  );
};

export default Poi;
