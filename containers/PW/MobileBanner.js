import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/button/Index";
import { useRouter } from "next/router";
import { FaLongArrowAltRight } from "react-icons/fa";
import openTailoredModal from "../../services/openTailoredModal";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  padding: 1rem;
  background-color: white;
  z-index: 1000;
  left: 0;
`;

const BannerMobile = (props) => {
  const router = useRouter();

  return (
    <Container className="border" style={{ borderRadius: "0" }}>
      <Button
        boxShadow
        onclick={() => openTailoredModal(router)}
        onclickparam={null}
        hovercolor="white"
        hoverbgcolor="black"
        padding="0.75rem"
        bgColor="#F7e700"
        borderWidth="0"
        borderRadius="2rem"
        margin="0"
        width="100%"
      >
        <FaLongArrowAltRight
          style={{
            fontSize: "1.75rem",
            marginLeft: "0.25rem",
            lineHeight: "1",
          }}
        ></FaLongArrowAltRight>
      </Button>
    </Container>
  );
};

export default BannerMobile;
