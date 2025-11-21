import React from "react";
import styled from "styled-components";
import { IoCheckboxOutline } from "react-icons/io5";
import { IoMdSquareOutline } from "react-icons/io";
import Spinner from "../../../Spinner";
import { connect } from "react-redux";

const Container = styled.div`
  margin: 0.5rem 0.5rem 0 0.5rem;
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 768px) {
  }
`;

const HoverConainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const Section = (props) => {
  if (props.data)
    return (
      <Container className="">
        <HoverConainer
          onClick={
            props.token && !props.is_registration_needed
              ? () =>
                  props._deselectBookingHandler(
                    props.data,
                    props.data.user_selected ? false : true
                  )
              : !props.is_registration_needed
              ? () => props.setShowLoginModal(true)
              : () => console.log("")
          }
          style={{
            height: "max-content",
            display: "flex",
            fontSize: "13px",
            alignItems: "center",
            fontWeight: "700",
            padding: "0.25rem",
            backgroundColor: props.data.user_selected
              ? "#f7e700"
              : "transparent",
            borderRadius: "5px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: props.data.user_selected ? "#f7e700" : "#e4e4e4",
          }}
        >
          <div
            style={{ lineHeight: "1", fontSize: "13px" }}
            className=""
          >
            {props.is_selecting ? (
              <Spinner size={16} margin="0 0 0 0.25rem"></Spinner>
            ) : props.data.user_selected ? (
              <IoCheckboxOutline
                style={{
                  lineHeight: "1",
                  fontSize: "20px",
                  fontWeight: "700",
                  marginTop: "0px",
                }}
              ></IoCheckboxOutline>
            ) : (
              <IoMdSquareOutline
                style={{
                  lineHeight: "1",
                  fontSize: "20px",
                  fontWeight: "700",
                  marginTop: "0px",
                }}
              ></IoMdSquareOutline>
            )}
          </div>
          <div style={{ marginLeft: "4px" }}>
            {props.data.user_selected ? "Selected" : "Select"}
          </div>
        </HoverConainer>
        <div className="center-di"></div>
      </Container>
    );
  else return null;
};

const mapStateToPros = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToPros)(Section);
