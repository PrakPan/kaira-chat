import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";
import { useRouter } from "next/router";

const Container = styled.div`
  width: 100%;

  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
`;

const ImageFade = styled.div`
  width: 100%;
  height: auto;
  transition: 0.2s all ease-in-out;
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  &:hover {
    ${ImageFade} {
      transition: 0.2s all ease-in-out;
      transform: scale(1.1);
    }
  }
`;

const BlackContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  position: absolute;
  color: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
  top: 0;
  flex-direction: column;
`;

const Heading = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const Subheading = styled.p`
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 300;
`;

const Explorers = (props) => {
  const router = useRouter();

  const _handleRedirect = (id) => {
    router.push("/itinerary/" + id);
  };

  return (
    <Container className="center-dv">
      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("506ed241-dc09-4498-ac0a-d78c19f2d574")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/nisagra.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Nisagra's</Heading>
          <Subheading>Uttarakhand Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("d8ed95ae-3eff-4fdd-b5f2-8e81d67f4dbd")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/ahilaja.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Ahilaji's</Heading>
          <Subheading>Spiti Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("40b075cc-3a2c-4643-aae4-687bbd7b2004")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/matt.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Matt's</Heading>
          <Subheading>India Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("c333c311-2ba9-4679-9b02-7f941d08f0db")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/meena.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Meena's</Heading>
          <Subheading>Kashmir Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("7d6233b7-02c4-454c-9452-3e20c242cc13")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/eric.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Eric's</Heading>
          <Subheading>North East Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("59e104e7-2e75-4df7-94ec-d356c02b479e")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/SAMA.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>SAMA's</Heading>
          <Subheading>Kashmir Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("0ec9c580-92aa-4dd6-8681-7e6eb18cca0c")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/prasenjeet.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Prasenjit's</Heading>
          <Subheading>Kashmir Trip</Subheading>
        </BlackContainer>
      </ImageContainer>
      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("70b98d5c-7595-40bb-8182-61e0230241e0")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/hema.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Hema's</Heading>
          <Subheading>North East Trip</Subheading>
        </BlackContainer>
      </ImageContainer>
      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("a2abace4-2350-4f06-a4da-6024432de316")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/chintan.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Chintan's</Heading>
          <Subheading>Ladkakh Trip</Subheading>
        </BlackContainer>
      </ImageContainer>
      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("3c27ed35-1bee-4a0c-b0c5-b22d34184e73")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/gureerat.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Gurkeerat's</Heading>
          <Subheading>Spiti Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("9cfed405-3fed-4f80-b513-c2c9ff86b119")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/payal.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Payal's</Heading>
          <Subheading>Goa Trip</Subheading>
        </BlackContainer>
      </ImageContainer>

      <ImageContainer
        className="hover-pointer"
        onClick={(e) => _handleRedirect("e2a07637-b53e-40a8-8c0f-c91adcd95223")}
      >
        <ImageFade>
          <ImageLoader
            url="media/website/explorers/puneet.jpeg"
            dimensions={{ width: 1200, height: 1200 }}
            dimensionsMobile={{ width: 900, height: 900 }}
            height="auto"
          ></ImageLoader>
        </ImageFade>
        <BlackContainer className="">
          <Heading>Puneet's</Heading>
          <Subheading>Kerala Trip</Subheading>
        </BlackContainer>
      </ImageContainer>
    </Container>
  );
};

export default Explorers;
