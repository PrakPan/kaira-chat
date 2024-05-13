import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faCircle } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr auto 2fr auto auto;
  grid-gap: 1rem;
  color: black;
  width: 100%;
  margin: 1rem 0;
`;
const IconContainer = styled.div`
  background-color: #f7e700;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
`;

const RouteSlab = (props) => {
  return (
    <Container>
      <IconContainer className="center-div">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          style={{ width: "1rem", height: "1rem", margin: "0", color: "black" }}
        />
      </IconContainer>
      <div className="center-div">{props.city}</div>
      <div className="center-div">
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(0,0,0,1)",
            width: "100%",
          }}
        ></div>
      </div>
      <div
        className="center-di"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p className="" style={{ margin: "0" }}>
          {props.duration}
        </p>
      </div>
      <div className="center-div">
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(0,0,0,1)",
            width: "100%",
          }}
        ></div>
      </div>
      <div className="center-div">
        <FontAwesomeIcon
          className=""
          icon={faCircle}
          style={{ color: "rgba(0,0,0,1)" }}
          onClick={() => props._moveUpHandler(props.index)}
        />
      </div>
    </Container>
  );
};

export default React.memo(RouteSlab);
