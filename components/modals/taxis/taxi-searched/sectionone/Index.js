import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";
import Route from "./Route";
import { PiTaxiLight } from "react-icons/pi";

const Container = styled.div`
  padding: 1rem 0.75rem;
`;
const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 10px;
`;

const TaxiCard = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
`;
const Section = (props) => {
  if (props.data)
    return (
      <Container className="font-lexend">
        <TaxiCard>
        <ImageContainer
          // style={{
          //   padding: "0.75rem 0rem",
          //   borderColor: "rgba(238, 238, 238, 1)",
          //   borderWidth: "1px",
          //   borderStyle: "none solid none none",
          // }}
        >
          <PiTaxiLight size={18}/>
          {/* {props.data?.taxi_category?.image ? (
            <ImageLoader
              is_url
              noLazy
              url={props.data.taxi_category.image}
              width="80%"
              widthmobile="70%"
              height="auto"
            ></ImageLoader>
          ) : ( */}
            {/* <ImageLoader
              url={"media/icons/bookings/car (2).png"}
              width="80%"
              widthmobile="70%"
              height="auto"
            ></ImageLoader>
          )} */}
          {/* <p
            style={{
              margin: "0.5rem 0rem 0rem 0rem",
              fontSize: "15px",
              fontWeight: "700",
            }}
            className="font-lexend text-center"
          >
            {props.data.taxi_category.type}
          </p> */}
          {/* <p
            style={{
              margin: "0 0rem 0.25rem 0rem",
              fontSize: "13px",
              fontWeight: "300",
            }}
            className="font-lexend text-center"
          >
            {props.data?.taxi_category?.seating_capacity + "-seater"}
          </p> */}
        </ImageContainer>

        <Route
          setHideBookingModal={props.setHideBookingModal}
          _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
          getPaymentHandler={props.getPaymentHandler}
          selectedBooking={props.selectedBooking}
          data={props.data}
          _updateSearchedTaxi={props._updateSearchedTaxi}
          handleTaxiSelect={props.handleTaxiSelect}
          origin_itinerary_city_id={props?.origin_itinerary_city_id}
                destination_itinerary_city_id={props?.destination_itinerary_city_id}
                edge={props?.edge}
                 booking_id={props?.booking_id}
        ></Route>
        </TaxiCard>
      </Container>
    );
  else return null;
};

export default Section;
