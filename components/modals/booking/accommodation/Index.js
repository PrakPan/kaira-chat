import styled from "styled-components";
import Info from "./Info";
import Gallery from "./gallery/Index";

const Container = styled.div`
  margin: 0 0 1rem 0;
  border-radius: 5px;
  @media screen and (min-width: 768px) {
    padding: 0.5rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  @media screen and (min-width: 768px) {
    grid-template-columns: max-content auto;
  }
`;

const Accommodation = (props) => {
  return (
    <Container className="border-thin">
      <GridContainer>
        <div className="center-div">
          <Gallery
            images={props.images}
            review_score={props.review_score}
            review_count={props.review_count}
          ></Gallery>
        </div>
        <Info
          pricing_type={props.pricing_type}
          selectedBooking={props.selectedBooking}
          includeBreakfast={props.includeBreakfast}
          room_type={props.room_type}
          updateLoadingState={props.updateLoadingState}
          tailored_id={props.tailored_id}
          booking_id={props.booking_id}
          itinerary_id={props.itinerary_id}
          accommodation_id={props.accommodation_id}
          _updateBookingHandler={props._updateBookingHandler}
          type={props.type}
          name={props.name}
          description={props.description}
          location={props.location}
          star={props.star}
          cost={props.cost}
        />
      </GridContainer>
    </Container>
  );
};

export default Accommodation;
