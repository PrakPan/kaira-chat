import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../Button";
import styled from "styled-components";

const Carousel = (props) => {
  const GridContainer = styled.div`
    display: grid;
    width: 100%;
    margin: auto;
    @media screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  `;

  return (
    <Modal
      className="edit-modal"
      show={props.show}
      size="xl"
      centered
      onHide={props.hide}
    >
      <Modal.Body
        style={{
          padding: "2rem",
          borderStyle: "solid",
          borderColor: "#f7e700",
          borderRadius: "5px",
          borderWidth: "10px",
        }}
      >
        <h1
          style={{ fontSize: "32px", textAlign: "left" }}
          className=""
        >
          Hi Maria,
        </h1>
        <h2
          style={{ fontSize: "24px", fontWeight: "200" }}
          className="font-nunito"
        >
          Thanks for joining our little community.
        </h2>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
            margin: "2rem 0",
          }}
          className="font-nunito"
        >
          Pick activities you like
        </h2>
        <GridContainer></GridContainer>
        <Button
          margin="auto"
          borderRadius="2rem"
          padding="0.5rem 1rem"
          borderWidth="1px"
          onclick={props.hide}
          hoverColor="black"
          hoverBgColor="#F7e700"
        >
          Confirm
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default Carousel;
