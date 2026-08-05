import React from "react";
import Button from "../../components/ui/button/Index";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import urls from "../../services/urls";
import ChatWithUs from "../../components/containers/ChatWithUs/ChatWithUs";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("https://d31aoa0ehgvjdi.cloudfront.net/eyJidWNrZXQiOiJ0aGV0YXJ6YW53YXktd2ViIiwia2V5IjoibWVkaWEvd2Vic2l0ZS93b3JsZE1hcFllbGxvdy5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjE2MDAsImZpdCI6Imluc2lkZSIsIndpdGhvdXRFbmxhcmdlbWVudCI6dHJ1ZX0sIndlYnAiOnsicXVhbGl0eSI6ODB9LCJqcGVnIjp7InF1YWxpdHkiOjgwLCJwcm9ncmVzc2l2ZSI6dHJ1ZX19fQ==");
  background-color: rgba(100, 100, 100, 0.3);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const ChatWithUsContainer = styled.div`
  width: 95%;
  margin-top: 2rem;
  margin-inline: auto;
  @media screen and (min-width: 768px) {
    margin-top: 0rem;
    width: 85%;
  }
`;

const LinksContainer = styled.div`
  @media screen and (min-width: 768px) {
    width: max-content;
  }
`;

const Heading = styled.div`
  font-size: 25vw;
  font-weight: 600;
  display: flex;
  line-height: 1;
  margin: 10vh 0;
  @media screen and (min-width: 768px) {
    font-size: 15vw;
  }
`;

const Tagline = styled.p`
  font-weight: 100;
  font-size: 1.5rem;
  text-align: center;
  margin: 1rem;
`;

const NotFound = (props) => {
  return (
    <>
      <Container className="center-div">
        <Heading className="font-opensnans">
          <div
            className=""
            style={{
              margin: "0",
              display: "inline",
              height: "max-content",
              lineHeight: "1",
            }}
          >
            4
          </div>
          <ImageLoader
            display="inline"
            url="media/website/404.svg"
            widthMobile="25vw"
            heightMobile="25vw"
            height="15vw"
            width="15vw"
            dimensions={{ width: 800, height: 800 }}
          ></ImageLoader>
          <div
            className=""
            style={{
              margin: "0",
              display: "inline",
              height: "max-content",
              lineHeight: "1",
            }}
          >
            4
          </div>
        </Heading>
        <Tagline className="font-nunito">
          We’re not on the same page, really.
        </Tagline>
        <LinksContainer>
          <Button
            borderWidth="1px"
            width="100%"
            margin=" 1rem 0"
            borderRadius="2rem"
            padding="0.25rem 1rem"
            boxShadow
            link={urls.HOMEPAGE}
          >
            Back to Home
          </Button>
        </LinksContainer>
      </Container>
      <ChatWithUsContainer>
        <ChatWithUs link="/contact" />
      </ChatWithUsContainer>
    </>
  );
};

export default NotFound;
