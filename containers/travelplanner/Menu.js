import React from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";

const Container = styled.div`
  position: sticky;
  top: 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  background-color: black;
  z-index: 1000;
  height: 66px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  marginleft: 1rem;
  height: max-content;
  maxwidth: 100vw;
`;

const SetWidthContainer = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  @media screen and (min-width: 768px) {
    width: 90vw;
    margin: auto;
    padding-left: 2rem;
  }
`;

const Menu = (props) => {
  return (
    <Container className="" style={{}}>
      <SetWidthContainer>
        <FiltersContainer style={{}}></FiltersContainer>
        <div
          className="hidden-mobile"
          style={{
            color: "white",
            display: "flex",
            flexGrow: "1",
            paddingRight: "1rem",
          }}
        >
          <div
            className="font-lexend hidden-mobile hover-pointer center-div"
            style={{ marginRight: "0.5rem", lineHeight: "1" }}
            onClick={props.openWhatsapp}
          >
            Connect on WhatsApp
          </div>
          <ImageLoader
            onclick={props.openWhatsapp}
            url="media/icons/bookings/whatsapp.svg"
            width="2rem"
            height="2rem"
            widthmobile="2rem"
          ></ImageLoader>
        </div>
      </SetWidthContainer>
    </Container>
  );
};

export default Menu;
