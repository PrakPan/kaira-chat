import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Bar from "./Bar";
import Pannel from "./pannel/Index";
import { fadeIn } from "react-animations";
import { connect } from "react-redux";

const Container = styled.div`
  width: 600px;
  margin: auto;
  position: initial;
`;

const BlackContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
`;

const MobileSearch = (props) => {
  const [pannelOpen, setPannelOpen] = useState(false);
  const [hotLocationsData, setHotLocationsData] = useState();

  useEffect(() => {
    setHotLocationsData(props.hotLocations);
  }, []);

  return (
    <Container>
      <BlackContainer onClick={props.onclose}></BlackContainer>

      <Bar
        setPannelOpen={() => setPannelOpen(true)}
        hidden={pannelOpen ? true : false}
      ></Bar>

      <Pannel
        hotlocations={hotLocationsData}
        setPannelClose={props.onclose}
      ></Pannel>
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    hotLocations: state.HotLocationSearch.locations,
  };
};

export default connect(mapStateToPros)(MobileSearch);
