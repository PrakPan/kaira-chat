import React from "react";
import Drawer from "../../../components/ui/Drawer";
import { IoMdClose } from "react-icons/io";
import styled from "styled-components";
import ImageLoader from "../../../components/ImageLoader";
import SkeletonCard from "../../../components/ui/SkeletonCard";

const Title = styled.p`
  font-weight: 800;
  font-size: 20px;
`;

const Reviews = styled.div`
  display: flex;
  align-items: center;
  margin-block: 0.5rem;
  gap: 0.2rem;
  p,
  u {
    font-size: 12px;
    color: #7a7a7a;
  }
  u {
    margin-inline: 0.2rem;
  }
`;

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
  padding: ${(props) => (props.itineraryDrawer ? "0 1rem 1rem 1rem" : "1rem")};
  width: 100vw;
  @media screen and (min-width: 768px) {
    width: 500px;
  }
`;

const TimeStamp = styled.span`
  height: 31px;
  padding: 4px 8px;
  background-color: #000000bf;
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  position: absolute;
  left: 10px;
  bottom: 10px;
  @media screen and (min-width: 768px) {
    bottom: 10px;

    left: 300px;
  }
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

const ImageContainer = styled.div`
  position: relative;
`;

const HotelDetails=(hotelDetails,setShowDetails,showDetails)=>{

    return(
        <Drawer
        show={showDetails}
        anchor={"right"}
        backdrop
        className="font-lexend"
        onHide={() => setShowDetails(false)}
        mobileWidth={"100%"}
        width="50%"
      >
        <Container>
          <BackContainer className=" font-lexend">
            <IoMdClose
              className="hover-pointer"
              onClick={() => setShowDetails(false)}
              style={{ fontSize: "2rem" }}
            ></IoMdClose>
            <BackText>Hotel Details</BackText>
          </BackContainer>
          <ImageContainer style={{ height: "188px" }}>
            <div>
              <div
                style={{
                  display: hotelDetails?.images?.[0]?.image
                    ? "initial"
                    : "none",
                }}
              >
                <ImageLoader
                  borderRadius="8px"
                  marginTop="23px"
                  widthMobile="100%"
                  url={
                    hotelDetails?.images?.[0]?.image
                      ? hotelDetails?.images?.[0]?.image
                      : "media/icons/bookings/notfounds/noroom.png"
                  }
                  dimensionsMobile={{ width: 500, height: 280 }}
                  dimensions={{ width: 468, height: 188 }}
                  noLazy
                ></ImageLoader>
              </div>

              <div
                style={{
                  display: !hotelDetails?.images?.[0]?.image
                    ? "initial"
                    : "none",
                }}
              >
                <div
                  style={{
                    width: "468px",
                    height: "188px",
                    overflow: "hidden",
                    borderRadius: "8px",
                  }}
                >
                  <SkeletonCard />
                </div>
              </div>
            </div>
          </ImageContainer>

          <div className="mt-3">
            <Title>{hotelDetails?.name}</Title>
            {hotelDetails?.addr1 && (
              <div>
                <span className="font-bold pr-1">Address:</span>{" "}
                {hotelDetails?.addr1}
              </div>
            )}

            <Reviews>
              {hotelDetails?.star_category ? (
                <div
                  style={{ color: "#FFD201", marginBottom: "0.3rem" }}
                  className="flex flex-row gap-1"
                >
                  {hotelDetails?.star_category}
                </div>
              ) : null}

              <div style={{ display: "flex", alignItems: "center" }}>
                {hotelDetails?.rating_ext ? (
                  <p style={{ marginBlock: "auto" }}>
                    {hotelDetails?.rating_ext} ·{" "}
                  </p>
                ) : null}

                {hotelDetails?.num_reviews_ext ? (
                  <u> {hotelDetails?.num_reviews_ext} user reviews</u>
                ) : null}
              </div>
            </Reviews>
            {/* {props.data?.experience_filters && (
              <Text>{experience_filters}</Text>
            )} */}
          </div>

          {hotelDetails?.cost ? (
            <div className="flex flex-row">
              Cost: <span className="font-semibold px-1">₹</span>
              {hotelDetails.cost}
              {" /- "}
              {"Per person"}
            </div>
          ) : hotelDetails?.price ? (
            <div className="flex flex-row">
              Cost: <span className="font-semibold px-1">₹</span>
              {hotelDetails?.price}
              {" /- "}
              {"Per person"}
            </div>
          ) : (
            <div className="flex flex-row">
              Cost: Complimentary Activity
            </div>
          )}

          {hotelDetails?.recommendations?.[0]?.rates?.[0]?.rooms?.[0]
            ?.description && (
            <div>
              <Heading>About</Heading>
              <Text>
                {
                  hotelDetails?.recommendations?.[0]?.rates?.[0]
                    ?.rooms?.[0]?.description
                }
              </Text>
            </div>
          )}
        </Container>
      </Drawer>
    )
}

export default HotelDetails