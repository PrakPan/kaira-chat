import React, { useEffect } from "react";
import styled from "styled-components";
import { ImCross } from "react-icons/im";

const Container = styled.div`
  font-size: 14px;
  font-weight: 500;
  position: absolute;
  line-height: 20px;
  padding: 5px 15px;
  color: white;
  font-size: 14px;
  text-align: center;
  background: rgb(255 84 84);
  border: 4px solid rgb(255 84 84);
  border-radius: 5px;
  text-shadow: rgba(0, 0, 0, 0.1) 1px 1px 1px;
  box-shadow: rgba(0, 0, 0, 0.098) 1px 1px 2px 0px;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  bottom: ${(props) => props.bottom};
  right: ${(props) => props.right};
  z-index: 1;

  @media screen and (max-width: 768px) {
    top: ${(props) => props.mobiletop};
    left: ${(props) => props.mobileleft};
    bottom: ${(props) => props.mobileBottom};
    right: ${(props) => props.mobileRight};
  }

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent rgb(255 84 84) transparent;
    top: ${(props) => (props.tipTop ? props.tipTop : "-22px")};
    left: ${(props) => (props.tipLeft ? props.tipLeft : "50px")};
  }
`;

const Popup = (props) => {
  function handlePopup() {
    if (props.setShowPopup)
      props.setShowPopup({
        dateStart: false,
        dateEnd: false,
        group: false,
        InputOne: false,
      });
  }

  return (
    <Container {...props} onClick={handlePopup}>
      {props.text}{" "}
      <ImCross
        style={{
          top: "0",
          fontSize: "8px",
          position: "absolute",
          right: "0",
          cursor: "pointer",
        }}
      />
    </Container>
  );
};

export default Popup;
