import styled, { keyframes } from "styled-components";
import media from "../../components/media";
import ImageLoader from "../../components/ImageLoader";
import usePageLoaded from "../../components/custom hooks/usePageLoaded";

const MapSlide = keyframes`
0% {
    margin-left: -30rem;
    }
    100% {
    margin-left: 0rem;
    }

`;

const StoriesHeading = styled.span`
  text-align: center;
  position: absolute;
  width: 100%;
  &:nth-of-type(1) {
    top: 15%;
    font-weight: 800;
    font-size: ${(props) => props.theme.fontsizes.mobile.headings.one};
    @media screen and (min-width: 768px) {
      top: 10%;
      font-size: ${(props) => props.theme.fontsizes.desktop.headings.two};
    }
  }
`;

const Bounce = keyframes`
0%{
opacity: 0;
margin-top: -2000px;
}
60%{
opacity: 1;
margin-top: 30px;
}
80%{
    margin-top: 10px;
}
100%{
    margin-top: 0px;
}
`;

const PinIcon = styled.div`
  animation: ${MapSlide} 8s;
  animation-fill-mode: both;
  height: 4rem !important;
  position: absolute;
  transform: none;
  transform: translate(-50%, -50%);

  @media screen and (min-width: 768px) {
    height: 4.5rem !important;
    animation: none;
    &:nth-of-type(5) {
      animation-name: ${Bounce};
      animation-fill-mode: both;
      animation-duration: 1s;
    }
    &:nth-of-type(3) {
      animation-name: ${Bounce};
      animation-fill-mode: both;
      animation-duration: 2s;
    }
  }

  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    &:nth-of-type(5) {
      display: none;
    }
    &:nth-of-type(1) {
      display: none;
    }
    &:nth-of-type(11) {
      display: none;
    }
  }
`;

const UserIcon = styled.div`
  animation: ${MapSlide} 8s;
  animation-fill-mode: both;
  cursor: pointer;
  background-color: #727272;
  height: 2rem !important;
  width: 2rem !important;
  border-radius: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: all 0.2s linear;
  &:hover {
    border-color: #4c4c4c;
    background-color: #4c4c4c;
  }
  @media screen and (min-width: 768px) {
    animation: none;
    height: 2.5rem !important;
    width: 2.5rem !important
    &:nth-of-type(4) {
      animation-name: ${Bounce};
      animation-fill-mode: both;
      animation-duration: 2s;
    }
    &:nth-of-type(6) {
      animation-name: ${Bounce};
      animation-fill-mode: both;
      animation-duration: 1s;
    }
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    &:nth-of-type(6) {
      display: none;
    }
    &:nth-of-type(2) {
      display: none;
    }
    &:nth-of-type(12) {
      display: none;
    }
    &:nth-of-type(4) {
      animation-name: ${Bounce};
      animation-fill-mode: both;
      animation-duration: 2s;
    }
    &:nth-of-type(6) {
      animation-name: ${Bounce};
      animation-fill-mode: both;
      animation-duration: 1s;
    }
  }
`;

const MapBg = styled.img`
  z-index: -1;
  height: 100vh;
  width: 60rem;
  transform: scale(1.4);
  object-fit: contain;
  position: relative;
  animation: ${MapSlide} 8s;
  @media screen and (min-width: 768px) {
    transform: none;
    overflow: hidden;
    animation: none;
    width: 100%;
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    transform: scale(1.4);
    overflow: hidden;
    height: 60vh;
    padding-top: 10vh;
  }
`;

const Container = styled.div`
  position: relative;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 100vw;
  @media screen and (min-width: 768px) {
    overflow: hidden;
  }
  @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    overflow: hidden;
  }
`;

const MapContainer = styled.div`
  height: 80vh;
  and (max-device-width : 1024px) {
  }
`;

const StoriesMap = () => {
  const isPageLoaded = usePageLoaded();
  let isPageWide = media("(min-width: 768px)");

  if (!isPageLoaded) return null;
  else {
    if (isPageWide) {
      return (
        <div>
          <StoriesHeading className="">Our Stories</StoriesHeading>

          <Container>
            <PinIcon style={{ left: "86%", top: "78.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>

            <UserIcon style={{ left: "85.8%", top: "76.5%" }}>
              <ImageLoader
                url={"media/testimonials/Dieter.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "59%", top: "35.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "58.8%", top: "33.5%" }}>
              <ImageLoader
                url={"media/testimonials/Damla.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "72.5%", top: "46.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "72.3%", top: "44.5%" }}>
              <ImageLoader
                url={"media/testimonials/Arnab.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "46%", top: "40.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "45.8%", top: "38.5%" }}>
              <ImageLoader
                url={"media/testimonials/Maria-Carolina.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "70%", top: "45.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "69.8%", top: "43.5%" }}>
              <ImageLoader
                url={"media/testimonials/Raghav.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>

            <PinIcon style={{ left: "50%", top: "39.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "49.8%", top: "37.5%" }}>
              <ImageLoader
                url={"media/testimonials/Mohamed.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "25%", top: "39.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>

            <UserIcon style={{ left: "24.8%", top: "37.5%" }}>
              <ImageLoader
                url={"media/testimonials/Shivam.jpg"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <MapContainer>
              <MapBg src="https://d31aoa0ehgvjdi.cloudfront.net/media/website/worldMap.webp" />
            </MapContainer>
          </Container>
        </div>
      );
    } else {
      return (
        <div>
          <StoriesHeading className="">Our Stories</StoriesHeading>

          <Container>
            <PinIcon style={{ left: "47.3rem", top: "40.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "47.1rem", top: "38.5%" }}>
              <ImageLoader
                url={"media/testimonials/Dieter.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "30rem", top: "42.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "29.8rem", top: "40.5%" }}>
              <ImageLoader
                url={"media/testimonials/Damla.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "35.3rem", top: "59.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "35.1rem", top: "57.5%" }}>
              <ImageLoader
                url={"media/testimonials/Arnab.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "5rem", top: "35.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "4.8rem", top: "33.5%" }}>
              <ImageLoader
                url={"media/testimonials/Maria-Carolina.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "13.7rem", top: "57.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "13.5rem", top: "55.5%" }}>
              <ImageLoader
                url={"media/testimonials/Raghav.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>
            <PinIcon style={{ left: "16.8rem", top: "65.9%" }}>
              <ImageLoader
                url={"media/icons/map-pin-yellow.svg"}
                dimensions={{ height: 100, width: 100 }}
                height="72px"
                width="72px"
                widthmobile="72px"
              />
            </PinIcon>
            <UserIcon style={{ left: "16.6rem", top: "63.5%" }}>
              <ImageLoader
                url={"media/testimonials/Mohamed.webp"}
                dimensions={{ height: 100, width: 100 }}
                height="40px"
                width="40px"
                widthmobile="40px"
                borderRadius="50%"
              />
            </UserIcon>

            <MapBg src="https://d31aoa0ehgvjdi.cloudfront.net/media/website/worldMap.webp" />
          </Container>
        </div>
      );
    }
  }
};

export default StoriesMap;
