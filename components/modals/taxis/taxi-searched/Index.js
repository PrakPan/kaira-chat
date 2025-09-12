import styled from "styled-components";
import SectionOne from "./sectionone/Index";
import ComboSection from "./sectionone/ComboSection";

// const Container = styled.div`
//   width: 100%;
//   background-color: white;
//   border-radius: 10px;
//   display: flex;
//   flex-flow: column;
//   height: 100%;
//   margin-bottom: 0.5rem;
//   @media screen and (min-width: 768px) {
//     border-radius: 10px;
//     position: relative;
//   }
// `;
const Container = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  flex-flow: column;
  height: 100%;
  @media screen and (min-width: 768px) {
    position: relative;
  }
`;
const Booking = (props) => {
  return (
    <Container className="" >
      {props?.combo ? 
      <ComboSection
      setHideBookingModal={props.setHideBookingModal}
      _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
      _updateSearchedTaxi={props._updateSearchedTaxi}
      getPaymentHandler={props.getPaymentHandler}
      setShowTaxiModal={props.setShowTaxiModal}
      selectedBooking={props.selectedBooking}
      data={props.data}
      handleTaxiSelect={props.handleTaxiSelect}
      onSelect={props?.onSelect}
      isSelected={props?.isSelected} 
      onTaxiSelect={props?.onTaxiSelect} 
      index={props?.index}
      start_date={props?.start_date}
      start_time={props?.start_time}
      edge={props?.edge}
       booking_id={props?.booking_id}
    ></ComboSection>
      :
      <SectionOne
        setHideBookingModal={props.setHideBookingModal}
         handleTaxiDeselect={props?.handleTaxiDeselect}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        _updateSearchedTaxi={props._updateSearchedTaxi}
        getPaymentHandler={props.getPaymentHandler}
        setShowTaxiModal={props.setShowTaxiModal}
        selectedBooking={props.selectedBooking}
        data={props.data}
        // isSelected={props?.isSelected} 
        handleTaxiSelect={props.handleTaxiSelect}
        origin_itinerary_city_id={props?.origin_itinerary_city_id}
        destination_itinerary_city_id={props?.destination_itinerary_city_id}
        edge={props?.edge}
         booking_id={props?.booking_id}
         airportBooking={props?.airportBooking}
         cityId={props?.cityId}
         handleAirportTaxiSelect={props?.handleAirportTaxiSelect}
         bookingLoad={props?.bookingLoad}
      ></SectionOne>
      }
    </Container>
  );
};

export default Booking;
