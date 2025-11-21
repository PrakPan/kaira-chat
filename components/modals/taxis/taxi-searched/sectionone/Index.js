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
      <div className="">
        {/* <TaxiCard> */}
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
            isSelected={props?.isSelected}
            booking_id={props?.booking_id}
            airportBooking={props?.airportBooking}
            cityId={props?.cityId}
            handleAirportTaxiSelect={props?.handleAirportTaxiSelect}
            bookingLoad={props?.bookingLoad}
             handleTaxiDeselect={props?.handleTaxiDeselect}
          ></Route>
        {/* </TaxiCard> */}
      </div>
    );
  else return null;
};

export default Section;
