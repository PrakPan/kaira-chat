import React from 'react';
import styled from 'styled-components'
// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import validateTextSize from '../../../services/textSizeValidator';
const Container = styled.div`
position: fixed;
bottom: 0;
width: 100vw;
padding: 1rem;
z-index: 1000;
left: 0;
`;

const BannerMobile = (props) => {
  return (
    <Container className="" style={{ borderRadius: "0" }}>
      <Button
        fontWeight="600"
        onclick={() => props.onClick()}
        hovercolor="white"
        hoverbgcolor="black"
        padding="0.75rem"
        bgColor="#F7e700"
        borderWidth="1px"
        borderRadius="2rem"
        margin="0"
        width="100%"
      >
        <p className="font-opensans" style={{ margin: "0", fontWeight: "600" }}>
          {validateTextSize(
            `Craft a trip to ${props.cityName} now!`,
            7,
            "Craft a trip now!"
          )}
        </p>
      </Button>
    </Container>
  );
}

export default BannerMobile;
