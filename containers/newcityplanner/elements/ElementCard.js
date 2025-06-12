import { useState } from "react";
import styled from "styled-components";
import ImageLoader from "../../../components/ImageLoader";
import Drawer from "../../../components/ui/Drawer";

import H8 from "../../../components/heading/H8";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { imgUrlEndPoint } from "../../../components/theme/ThemeConstants";
import { PlanYourTripButton } from "../../travelplanner/ThemePage";

const Text = styled.p`
  font-size: 14px;
`;

const Heading = styled.p`
  font-size: 18px;
  font-weight: 800;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 100vw;
  @media screen and (min-width: 768px) {
    width: 500px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
`;


const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
  }
`;

const BackText = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;

export default function ElementCard(props) {
  const [hover, setHover] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);

  const handleCardClick = (e) => {
    props._handleOpen(props.index);
  };

  const handleCloseDrawer = (e) => {
    props.handleCloseDrawer(e);
  };


  const placeholderImage = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
  const shouldShowImageSection = true;

  return (
    <>
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="h-[300px] group relative cursor-pointer p-3 border-2 rounded-xl gap-3 flex flex-col mx-1 hover:border-yellow-300 transition-all duration-200"
      >
        <div
          className={`absolute transition w-fit flex place-self-center bottom-[60%] z-50 bg-gray-800 text-white px-3 py-2 rounded-md drop-shadow-2xl text-sm ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          {props?.data?.name}
        </div>

        <div className="h-[60%] overflow-hidden rounded-lg">
          <ImageLoader
            url={props?.data?.image || placeholderImage}
            dimensions={{ width: 500, height: 500 }}
            dimensionsMobile={{ width: 500, height: 200 }}
            width="100%"
            height="100%"
            borderRadius="8px"
            noLazy
            hoverpointer
          />
        </div>

        <div className="flex flex-col gap-2 h-[40%]">
          <div>
            <H8
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              {props?.data?.name}
            </H8>
          </div>

          <div className="text-[13px] font-[400] text-gray-600 line-clamp-2">
            {props?.data?.text}
          </div>
        </div>
      </div>

      <Drawer
        show={props.isOpen}
        anchor="right"
        backdrop
        width={500}
        style={{ zIndex: 1501 }}
        className="font-lexend"
        onHide={handleCloseDrawer}
      >
        <Container>
          <BackContainer>
            <div 
              onClick={handleCloseDrawer}
              className="cursor-pointer flex items-center gap-2"
            >
              <BackText>←</BackText>
              <span className="text-lg font-semibold">Back</span>
            </div>
          </BackContainer>

    
          {shouldShowImageSection && (
            <ImageContainer style={{ height: "200px", maxHeight: "200px" }}>
              <div style={{ height: "200px", overflow: "hidden" }}>
                <div style={{ display: imageLoaded ? "block" : "none", height: "200px", overflow: "hidden" }}>
                  <ImageLoader
                    borderRadius="8px"
                    widthMobile="100%"
                    width="100%"
                    height="200px"
                    style={{ objectFit: "cover", maxHeight: "200px" }}
                    url={
                      props.data.image && !imageFail
                        ? props.data.image
                        : placeholderImage
                    }
                    dimensionsMobile={{ width: 500, height: 200 }}
                    dimensions={{ width: 468, height: 200 }}
                    onload={() => {
                      setTimeout(() => {
                        setImageLoaded(true);
                      }, 500);
                    }}
                    onfail={() => {
                      setImageFail(true);
                      setImageLoaded(true);
                    }}
                    noLazy
                  />
                </div>

                <div
                  style={{
                    display: !imageLoaded ? "initial" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      borderRadius: "8px",
                    }}
                  >
                    <SkeletonCard />
                  </div>
                </div>
              </div>
            </ImageContainer>
          )}

          <div>
            <Heading>{props?.data?.name}</Heading>
          </div>

          {props.data?.description && (
            <div>
              <Heading>About</Heading>
              <Text>{props.data.description}</Text>
            </div>
          )}

          {props.data?.text && (
            <div>
              <Text style={{ fontStyle: "italic", color: "#666" }}>
                {props.data.text}
              </Text>
            </div>
          )}
           <PlanYourTripButton />
        </Container>
      </Drawer>
    </>
  );
}