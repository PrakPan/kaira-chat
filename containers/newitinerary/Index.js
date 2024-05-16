import styled from "styled-components";
import { useState, useEffect } from "react";
import Menu from "./Menu";
import Brief from "./breif/Index";
import NewFooter from "../../components/newfooter/Index";
import Itinerary from "./itinerary/Index";

const Container = styled.div`
  width: 90%;
  margin: 24vw auto 0 auto;
  @media screen and (min-width: 768px) {
    width: 85%;
    margin: 15vh auto 0 auto;
  }
`;

const Line = styled.div`
  border: 1px solid #f0f0f0;
  width: 100vw;
  margin-left: -1rem;
  margin-bottom: 1rem;
  @media screen and (min-width: 768px) {
    margin-left: -5rem;
    width: 100vw;
  }
`;

const NewItinerary = (props) => {
  const [offsets, setOffsets] = useState({
    Brief: null,
    Itinerary: null,
    Stays: null,
    Flights: null,
    Transfers: null,
    Activities: null,
  });
  const [currentMenu, setCurrentMenu] = useState("Brief");

  useEffect(() => {
    let prevScroll = window.pageYOffset;
    let scrollhandler = () => {
      try {
        if (
          window.pageYOffset > offsets.Brief &&
          window.pageYOffset < offsets.Itinerary
        )
          setCurrentMenu("Brief");

        if (
          window.pageYOffset > offsets.Itinerary &&
          window.pageYOffset < offsets.Stays
        )
          setCurrentMenu("Itinerary");
        if (
          window.pageYOffset > offsets.Stays &&
          window.pageYOffset < offsets.Flights
        )
          setCurrentMenu("Stays");
        if (
          window.pageYOffset > offsets.Flights &&
          window.pageYOffset < offsets.Transfers
        )
          setCurrentMenu("Flights");
        if (
          window.pageYOffset > offsets.Transfers &&
          window.pageYOffset < offsets.Activities
        )
          setCurrentMenu("Transfers");
        if (window.pageYOffset > offsets.Activities)
          setCurrentMenu("Activities");
      } catch {}
    };
    window.addEventListener("scroll", scrollhandler);
    return () => {
      window.removeEventListener("scroll", scrollhandler);
    };
  });

  return (
    <div style={{}}>
      <Container>
        <Menu currentMenu={currentMenu}></Menu>
        <Line></Line>
        <div
          ref={(el) => {
            if (!el) return;
          }}
        >
          <Brief></Brief>
        </div>
        <div
          style={{}}
          ref={(el) => {
            if (!el) return;
            else if (!offsets.Itinerary)
              setOffsets({
                ...offsets,
                Itinerary: el.getBoundingClientRect().top,
              });
            // prints 200px
            else return;
          }}
        >
          <Itinerary></Itinerary>
        </div>
        <div
          style={{ height: "70vh" }}
          ref={(el) => {
            if (!el) return;
            else if (!offsets.Stays)
              setOffsets({
                ...offsets,
                Stays: el.getBoundingClientRect().top,
              });
            else return;
          }}
        >
          Stays
        </div>
        <div
          style={{ height: "80vh" }}
          ref={(el) => {
            if (!el) return;
            else if (!offsets.Flights)
              setOffsets({
                ...offsets,
                Flights: el.getBoundingClientRect().top,
              });
            else return;
          }}
        >
          Flights
        </div>
        <div
          style={{ height: "90vh" }}
          ref={(el) => {
            if (!el) return;
            else if (!offsets.Transfers)
              setOffsets({
                ...offsets,
                Transfers: el.getBoundingClientRect().top,
              });
            else return;
          }}
        >
          Transfers
        </div>
        <div
          style={{ height: "90vh" }}
          ref={(el) => {
            if (!el) return;
            else if (!offsets.Activities)
              setOffsets({
                ...offsets,
                Activities: el.getBoundingClientRect().top,
              });
            else return;
          }}
        >
          Activities
        </div>
      </Container>
      <NewFooter></NewFooter>
    </div>
  );
};

export default NewItinerary;
