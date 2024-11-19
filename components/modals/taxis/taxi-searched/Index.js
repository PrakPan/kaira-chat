import styled from "styled-components";
import SectionOne from "./sectionone/Index";

const Container = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  height: 100%;
  margin-bottom: 0.5rem;
  @media screen and (min-width: 768px) {
    border-radius: 10px;
    position: relative;
  }
`;

const Booking = (props) => {
  return (
    <Container className="border" style={{ borderRadius: "10px" }}>
      <SectionOne
        setHideBookingModal={props.setHideBookingModal}
        _updateTaxiBookingHandler={props._updateTaxiBookingHandler}
        _updateSearchedTaxi={props._updateSearchedTaxi}
        getPaymentHandler={props.getPaymentHandler}
        setShowTaxiModal={props.setShowTaxiModal}
        selectedBooking={props.selectedBooking}
        data={props.data}
        handleTaxiSelect={props.handleTaxiSelect}
      ></SectionOne>
    </Container>
  );
};

export default Booking;
