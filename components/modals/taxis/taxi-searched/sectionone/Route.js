import React from "react";
import styled from "styled-components";
import media from "../../../../media";
import ImageLoader from "../../../../ImageLoader";
import SectionFour from "../SectionFour";

const Container = styled.div`
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const RouteContainer = styled.div`
  display: flex;

  @media screen and (min-width: 768px) {
  }
`;

const Heading = styled.p`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  line-height: 1;
`;

const Location = styled.p`
  font-size: 13px;
  font-weight: 400;
  margin: 0;
`;

const IconHeading = styled.p`
  font-size: 13px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
`;

const Text = styled.p`
  font-size: 13px;
  font-weight: 300;
  margin: 0;
  letter-spacing: 1px;
  color: rgba(91, 89, 89, 1);
`;

const ModelText = styled.div`
  font-size: 0.8rem;
  color: #888080;
  font-weight: 300;
  margin: 0 0 0.5rem 0;
`;

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");

  if (props.data)
    return (
      <Container>
        <Heading>
          {props.data?.taxi_category?.type ? (
            <>
              {props.data.taxi_category.type}{" "}
              <>
                {props.data.taxi_category?.fuel_type && isPageWide ? (
                  `(${props.data.taxi_category.fuel_type})`
                ) : (
                  <></>
                )}
              </>
            </>
          ) : props.selectedBooking.transfer_type === "Intercity round-trip" ? (
            "Round-trip Taxi"
          ) : (
            "One-way Taxi"
          )}
        </Heading>

        {isPageWide && <ModelText>{props.data?.taxi_category?.model_name}</ModelText>}
        <RouteContainer className="font-lexend">
          <Location className="font-lexend">
            {props.selectedBooking.city}
          </Location>
          <div style={{ margin: "0 2px" }}>
            <ImageLoader
              url="media/icons/bookings/next.png"
              leftalign
              dimensions={{ width: 200, height: 200 }}
              width="1.25rem"
              widthmobile="1.25rem"
              noLazy
            ></ImageLoader>
          </div>
          <Location className="font-lexend">
            {props.selectedBooking.destination_city}
          </Location>
        </RouteContainer>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          <ImageLoader
            url="media/icons/bookings/distance.png"
            height="1.5rem"
            width="1.5rem"
            widthmobile="1.5rem"
            dimensions={{ width: 100, height: 100 }}
            margin="0"
            leftalign
            noLazy
          ></ImageLoader>

          <div style={{ display: "flex", gap: "1rem" }}>
            {props.data?.distance?.text ? (
              <div>
                <IconHeading className="font-lexend">
                  {props.data.distance.text}
                </IconHeading>
                <Text className="font-nunito">Included</Text>
              </div>
            ) : null}

            {props.data?.duration?.text ? (
              <div>
                <IconHeading className="font-lexend">
                  { props.data.duration.text}
                </IconHeading>
                <Text className="font-nunito">Included</Text>
              </div>
            ) : null}
          </div>
        </div>

        <SectionFour
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          getPaymentHandler={props.getPaymentHandler}
          selectedBooking={props.selectedBooking}
          _updateSearchedTaxi={props._updateSearchedTaxi}
          data={props.data}
          setShowTaxiModal={props.setShowTaxiModal}
        ></SectionFour>
      </Container>
    );
  else return null;
};

export default Section;
