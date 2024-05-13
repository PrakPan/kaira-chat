import React, { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import urls from "../../services/urls";
import Terms from "../../components/modals/terms/PW";

const Container = styled.div`
  position: sticky;
  top: 0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  background-color: black;
  z-index: 1000;
  height: 66px;

  @media screen and (min-width: 768px) {
  }
`;

const SetWidthContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: auto max-content;
  @media screen and (min-width: 768px) {
    width: 90vw;
    margin: auto;
    padding-left: 2rem;
  }
`;

const Menu = (props) => {
  const [showTerms, setShowTerms] = useState(false);

  let message =
    "Hey TTWxPW! I need some help with planning my tailored experience.";

  return (
    <Container className="" style={{}}>
      <SetWidthContainer>
        <div
          className="font-lexend  hover-pointer"
          style={{ color: "white", display: "flex" }}
          onClick={() => setShowTerms(true)}
        >
          <div className="center-div">
            <ImageLoader
              center
              hoverpointer
              leftalign
              onclick={props.openWhatsapp}
              url="media/icons/bookings/information.png"
              width="1.5rem"
              height="1.5rem"
              widthmobile="1.5rem"
            ></ImageLoader>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", marginLeft: "4px" }}
          >
            Terms & Conditions
          </div>
        </div>

        <div
          className="hidden-mobile"
          style={{
            color: "white",
            display: "flex",
            flexGrow: "1",
            paddingRight: "1rem",
          }}
          onClick={() =>
            (window.location.href = urls.WHATSAPP + "?text=" + message)
          }
        >
          <div
            className="font-lexend hidden-mobile hover-pointer center-div"
            style={{ marginRight: "0.5rem", lineHeight: "1" }}
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

        <div
          className="hidden-desktop"
          style={{
            color: "white",
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            paddingRight: "1rem",
          }}
          onClick={() =>
            (window.location.href = urls.WHATSAPP + "?text=" + message)
          }
        >
          <div
            className="font-lexend hidden-mobile hover-pointer center-div"
            style={{ marginRight: "0.5rem", lineHeight: "1" }}
          >
            Connect on WhatsApp
          </div>

          <ImageLoader
            onclick={props.openWhatsapp}
            leftalign
            url="media/icons/bookings/whatsapp.svg"
            width="2rem"
            height="2rem"
            widthmobile="2rem"
          ></ImageLoader>
        </div>
      </SetWidthContainer>
      <Terms show={showTerms} hide={() => setShowTerms(false)}></Terms>
    </Container>
  );
};

export default Menu;
