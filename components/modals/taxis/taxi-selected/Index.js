import styled from "styled-components";
import SectionOne from "./sectionone/Index";
import SectionFour from "./SectionFour";

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
      <SectionOne selectedBooking={props.selectedBooking}></SectionOne>
      <SectionFour setShowTaxiModal={props.setShowTaxiModal}></SectionFour>
    </Container>
  );
};

export default Booking;
